import { beforeEach, describe, expect, it } from "vitest";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { getContextFromToken, registerUser } from "@/lib/auth/service";
import type { AuthContext } from "@/lib/auth/types";
import { inviteMember, listMembers } from "./service";

let store: MemoryAuthStore;
let owner: AuthContext;
let memberToken: string;

beforeEach(async () => {
  store = new MemoryAuthStore();
  owner = (await registerUser(store, {
    email: "owner@example.com",
    displayName: "Owner",
    password: "password123",
    householdName: "Owner household",
  })).context;
  const memberResult = await registerUser(store, {
    email: "member@example.com",
    displayName: "Member",
    password: "password123",
    householdName: "Member household",
  });
  memberToken = memberResult.session.token;
});

describe("household service", () => {
  it("lists members and enforces free member limits", async () => {
    await expect(listMembers(owner, store)).resolves.toMatchObject([{ email: "owner@example.com", role: "OWNER" }]);
    await expect(inviteMember(owner, store, { email: "member@example.com" })).rejects.toMatchObject({
      code: "member_limit_reached",
      status: 409,
    });
  });

  it("blocks non-owner invites in a shared household", async () => {
    const familyOwner = {
      ...owner,
      entitlements: { ...owner.entitlements, plan: "family" as const, memberLimit: 5 },
    };
    await inviteMember(familyOwner, store, { email: "member@example.com" });
    const refreshedMember = await getContextFromToken(store, memberToken);
    expect(refreshedMember?.households).toHaveLength(2);
    const sharedHouseholdMember = {
      ...refreshedMember,
      activeHousehold: refreshedMember?.households.find((household) => household.id === owner.activeHousehold?.id) ?? null,
    } as AuthContext;
    await expect(inviteMember(sharedHouseholdMember, store, { email: "owner@example.com" })).rejects.toMatchObject({
      code: "not_owner",
      status: 403,
    });
  });
});
