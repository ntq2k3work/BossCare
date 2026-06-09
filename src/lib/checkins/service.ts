import { ZodError } from "zod";
import type { AuthContext } from "@/lib/auth/types";
import { CheckInError } from "./errors";
import type { CheckInStore } from "./types";
import { parseCheckInInput } from "./validation";

function householdId(context: AuthContext) {
  if (!context.activeHousehold) throw new CheckInError("no_household", "No active household is available.", 403);
  return context.activeHousehold.id;
}

function parseInput(input: unknown) {
  try {
    return parseCheckInInput(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new CheckInError("invalid_checkin", "Check the check-in details and try again.", 400);
    }
    throw error;
  }
}

async function requirePet(store: CheckInStore, activeHouseholdId: string, petId: string) {
  if (!(await store.petExists(activeHouseholdId, petId))) {
    throw new CheckInError("pet_not_found", "Pet profile was not found.", 404);
  }
}

export async function listCheckIns(context: AuthContext, store: CheckInStore, petId: string) {
  const activeHouseholdId = householdId(context);
  await requirePet(store, activeHouseholdId, petId);
  return store.listCheckIns(activeHouseholdId, petId);
}

export async function createCheckIn(context: AuthContext, store: CheckInStore, petId: string, input: unknown) {
  const activeHouseholdId = householdId(context);
  await requirePet(store, activeHouseholdId, petId);
  const parsed = parseInput(input);
  const currentBytes = await store.currentMediaBytes(activeHouseholdId);
  const nextBytes = currentBytes + (parsed.media?.byteSize ?? 0);
  if (nextBytes > context.entitlements.mediaLimitMb * 1024 * 1024) {
    throw new CheckInError("media_limit_reached", "Media storage limit reached.", 409);
  }
  return store.createCheckIn(activeHouseholdId, petId, context.user.id, parsed);
}
