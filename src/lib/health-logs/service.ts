import { ZodError } from "zod";
import type { AuthContext } from "@/lib/auth/types";
import { HealthLogError } from "./errors";
import type { HealthLogStore } from "./types";
import { parseHealthLogInput } from "./validation";

function householdId(context: AuthContext) {
  if (!context.activeHousehold) {
    throw new HealthLogError("no_household", "No active household is available.", 403);
  }
  return context.activeHousehold.id;
}

function parseInput(input: unknown) {
  try {
    return parseHealthLogInput(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HealthLogError("invalid_health_log", "Check the health log details and try again.", 400);
    }
    throw error;
  }
}

async function requirePet(store: HealthLogStore, activeHouseholdId: string, petId: string) {
  if (!(await store.petExists(activeHouseholdId, petId))) {
    throw new HealthLogError("pet_not_found", "Pet profile was not found.", 404);
  }
}

export async function listHealthLogs(context: AuthContext, store: HealthLogStore, petId: string, type?: string | null) {
  const activeHouseholdId = householdId(context);
  await requirePet(store, activeHouseholdId, petId);
  return store.listLogs(activeHouseholdId, petId, type);
}

export async function createHealthLog(context: AuthContext, store: HealthLogStore, petId: string, input: unknown) {
  const activeHouseholdId = householdId(context);
  await requirePet(store, activeHouseholdId, petId);
  return store.createLog(activeHouseholdId, petId, context.user.id, parseInput(input));
}

export async function updateHealthLog(context: AuthContext, store: HealthLogStore, logId: string, input: unknown) {
  const log = await store.updateLog(householdId(context), logId, parseInput(input));
  if (!log) {
    throw new HealthLogError("health_log_not_found", "Health log was not found.", 404);
  }
  return log;
}

export async function deleteHealthLog(context: AuthContext, store: HealthLogStore, logId: string) {
  const deleted = await store.deleteLog(householdId(context), logId);
  if (!deleted) {
    throw new HealthLogError("health_log_not_found", "Health log was not found.", 404);
  }
  return { ok: true };
}
