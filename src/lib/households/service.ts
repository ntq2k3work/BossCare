import { z, ZodError } from "zod";
import type { AuthContext } from "@/lib/auth/types";
import type { AuthStore } from "@/lib/auth/types";
import { HouseholdError } from "./errors";

const inviteSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase().trim()),
});

function activeHousehold(context: AuthContext) {
  if (!context.activeHousehold) throw new HouseholdError("no_household", "No active household is available.", 403);
  return context.activeHousehold;
}

export async function listMembers(context: AuthContext, store: AuthStore) {
  return store.listHouseholdMembers(activeHousehold(context).id);
}

export async function inviteMember(context: AuthContext, store: AuthStore, input: unknown) {
  const household = activeHousehold(context);
  if (household.role !== "OWNER") throw new HouseholdError("not_owner", "Only household owners can invite members.", 403);
  const members = await store.listHouseholdMembers(household.id);
  if (members.length >= context.entitlements.memberLimit) {
    throw new HouseholdError("member_limit_reached", "Upgrade before adding more household members.", 409);
  }
  let email: string;
  try {
    email = inviteSchema.parse(input).email;
  } catch (error) {
    if (error instanceof ZodError) throw new HouseholdError("invalid_invite", "Enter a valid account email.", 400);
    throw error;
  }
  const result = await store.addHouseholdMember(household.id, email);
  if (result === "missing_user") throw new HouseholdError("user_not_found", "That user does not have an account yet.", 404);
  if (result === "already_member") throw new HouseholdError("already_member", "That user is already a household member.", 409);
  return result;
}
