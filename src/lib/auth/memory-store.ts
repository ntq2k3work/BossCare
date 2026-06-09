import type {
  AuthContext,
  AuthStore,
  CreateAccountInput,
  CreateAccountResult,
  HouseholdMemberSummary,
  HouseholdSummary,
  StoredUser,
} from "./types";
import { freeEntitlements } from "@/lib/entitlements/plans";

type StoredSession = {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
};

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export class MemoryAuthStore implements AuthStore {
  private users = new Map<string, StoredUser>();
  private households = new Map<string, HouseholdSummary[]>();
  private members = new Map<string, HouseholdMemberSummary[]>();
  private householdNames = new Map<string, string>();
  private sessions = new Map<string, StoredSession>();

  async findUserByEmail(email: string) {
    return this.users.get(email) ?? null;
  }

  async createAccount(input: CreateAccountInput): Promise<CreateAccountResult> {
    const user: StoredUser = {
      id: id("user"),
      email: input.email,
      displayName: input.displayName,
      passwordHash: input.passwordHash,
    };
    const household: HouseholdSummary = {
      id: id("household"),
      name: input.householdName,
      role: "OWNER",
    };

    this.users.set(user.email, user);
    this.households.set(user.id, [household]);
    this.householdNames.set(household.id, household.name);
    this.members.set(household.id, [
      {
        id: id("member"),
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        role: "OWNER",
        createdAt: new Date().toISOString(),
      },
    ]);
    return { user, household };
  }

  async createSession(userId: string, tokenHash: string, expiresAt: Date) {
    this.sessions.set(tokenHash, { tokenHash, userId, expiresAt });
  }

  async findContextBySession(tokenHash: string, now: Date) {
    const session = this.sessions.get(tokenHash);
    if (!session || session.expiresAt <= now) {
      return null;
    }

    const user = [...this.users.values()].find((item) => item.id === session.userId);
    if (!user) {
      return null;
    }

    const households = this.households.get(user.id) ?? [];
    return authContext(user, households);
  }

  async deleteSession(tokenHash: string) {
    this.sessions.delete(tokenHash);
  }

  async listHouseholdMembers(householdId: string) {
    return this.members.get(householdId) ?? [];
  }

  async addHouseholdMember(householdId: string, email: string) {
    const user = this.users.get(email);
    if (!user) {
      return "missing_user";
    }
    const existingMembers = this.members.get(householdId) ?? [];
    if (existingMembers.some((member) => member.userId === user.id)) {
      return "already_member";
    }
    const member: HouseholdMemberSummary = {
      id: id("member"),
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      role: "MEMBER",
      createdAt: new Date().toISOString(),
    };
    this.members.set(householdId, [...existingMembers, member]);
    this.households.set(user.id, [
      ...(this.households.get(user.id) ?? []),
      {
        id: householdId,
        name: this.householdNames.get(householdId) ?? "Shared household",
        role: "MEMBER",
      },
    ]);
    return member;
  }
}

export function authContext(user: StoredUser, households: HouseholdSummary[]): AuthContext {
  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    },
    households,
    activeHousehold: households[0] ?? null,
    entitlements: {
      ...freeEntitlements(),
    },
  };
}
