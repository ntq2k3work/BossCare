import type { EntitlementLimits } from "@/lib/entitlements/plans";

export type HouseholdRole = "OWNER" | "MEMBER";

export type PublicUser = {
  id: string;
  email: string;
  displayName: string;
};

export type HouseholdSummary = {
  id: string;
  name: string;
  role: HouseholdRole;
};

export type HouseholdMemberSummary = {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  role: HouseholdRole;
  createdAt: string;
};

export type AuthContext = {
  user: PublicUser;
  households: HouseholdSummary[];
  activeHousehold: HouseholdSummary | null;
  entitlements: EntitlementLimits;
};

export type StoredUser = PublicUser & {
  passwordHash: string;
};

export type CreateAccountInput = {
  email: string;
  displayName: string;
  passwordHash: string;
  householdName: string;
};

export type CreateAccountResult = {
  user: StoredUser;
  household: HouseholdSummary;
};

export type AdminAuthStats = {
  users: number;
  households: number;
  members: number;
};

export interface AuthStore {
  findUserByEmail(email: string): Promise<StoredUser | null>;
  createAccount(input: CreateAccountInput): Promise<CreateAccountResult>;
  createSession(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  findContextBySession(tokenHash: string, now: Date): Promise<AuthContext | null>;
  deleteSession(tokenHash: string): Promise<void>;
  listHouseholdMembers(householdId: string): Promise<HouseholdMemberSummary[]>;
  addHouseholdMember(householdId: string, email: string): Promise<HouseholdMemberSummary | "missing_user" | "already_member">;
  getAdminAuthStats(): Promise<AdminAuthStats>;
}
