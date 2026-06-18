import { getPrisma } from "@/lib/db/prisma";
import type { AuthStore, CreateAccountInput } from "./types";
import { authContext } from "./memory-store";

export class PrismaAuthStore implements AuthStore {
  async findUserByEmail(email: string) {
    const user = await getPrisma().user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      passwordHash: user.passwordHash,
    };
  }

  async createAccount(input: CreateAccountInput) {
    const result = await getPrisma().$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          displayName: input.displayName,
          passwordHash: input.passwordHash,
        },
      });
      const household = await tx.household.create({
        data: {
          name: input.householdName,
          ownerUserId: user.id,
          members: {
            create: {
              userId: user.id,
              role: "OWNER",
            },
          },
        },
      });

      return { user, household };
    });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        displayName: result.user.displayName,
        passwordHash: result.user.passwordHash,
      },
      household: {
        id: result.household.id,
        name: result.household.name,
        role: "OWNER" as const,
      },
    };
  }

  async createSession(userId: string, tokenHash: string, expiresAt: Date) {
    await getPrisma().session.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  async findContextBySession(tokenHash: string, now: Date) {
    const session = await getPrisma().session.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            memberships: {
              include: { household: true },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!session || session.expiresAt <= now) {
      return null;
    }

    return authContext(
      {
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.displayName,
        passwordHash: session.user.passwordHash,
      },
      session.user.memberships.map((membership) => ({
        id: membership.household.id,
        name: membership.household.name,
        role: membership.role,
      })),
    );
  }

  async deleteSession(tokenHash: string) {
    await getPrisma().session.deleteMany({ where: { tokenHash } });
  }

  async listHouseholdMembers(householdId: string) {
    const members = await getPrisma().householdMember.findMany({
      where: { householdId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });
    return members.map((member) => ({
      id: member.id,
      userId: member.userId,
      email: member.user.email,
      displayName: member.user.displayName,
      role: member.role,
      createdAt: member.createdAt.toISOString(),
    }));
  }

  async getAdminAuthStats() {
    const [users, households, members] = await Promise.all([
      getPrisma().user.count(),
      getPrisma().household.count(),
      getPrisma().householdMember.count(),
    ]);
    return { users, households, members };
  }

  async addHouseholdMember(householdId: string, email: string) {
    const user = await getPrisma().user.findUnique({ where: { email } });
    if (!user) return "missing_user" as const;
    const existing = await getPrisma().householdMember.findUnique({
      where: { householdId_userId: { householdId, userId: user.id } },
    });
    if (existing) return "already_member" as const;
    const member = await getPrisma().householdMember.create({
      data: { householdId, userId: user.id, role: "MEMBER" },
      include: { user: true },
    });
    return {
      id: member.id,
      userId: member.userId,
      email: member.user.email,
      displayName: member.user.displayName,
      role: member.role,
      createdAt: member.createdAt.toISOString(),
    };
  }
}
