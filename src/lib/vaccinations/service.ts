import { ZodError } from "zod";
import type { AuthContext } from "@/lib/auth/types";
import { VaccinationError } from "./errors";
import type { VaccinationStore } from "./types";
import { parseVaccinationInput } from "./validation";

function householdId(context: AuthContext) {
  if (!context.activeHousehold) {
    throw new VaccinationError("no_household", "No active household is available.", 403);
  }
  return context.activeHousehold.id;
}

function parseInput(input: unknown) {
  try {
    return parseVaccinationInput(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new VaccinationError("invalid_vaccination", "Check the vaccination details and try again.", 400);
    }
    throw error;
  }
}

async function requirePet(store: VaccinationStore, activeHouseholdId: string, petId: string) {
  if (!(await store.petExists(activeHouseholdId, petId))) {
    throw new VaccinationError("pet_not_found", "Pet profile was not found.", 404);
  }
}

export async function listVaccinations(context: AuthContext, store: VaccinationStore, petId: string, today = new Date()) {
  const activeHouseholdId = householdId(context);
  await requirePet(store, activeHouseholdId, petId);
  return store.listRecords(activeHouseholdId, petId, today);
}

export async function createVaccination(context: AuthContext, store: VaccinationStore, petId: string, input: unknown, today = new Date()) {
  const activeHouseholdId = householdId(context);
  await requirePet(store, activeHouseholdId, petId);
  return store.createRecord(activeHouseholdId, petId, parseInput(input), today);
}

export async function updateVaccination(context: AuthContext, store: VaccinationStore, recordId: string, input: unknown, today = new Date()) {
  const record = await store.updateRecord(householdId(context), recordId, parseInput(input), today);
  if (!record) {
    throw new VaccinationError("vaccination_not_found", "Vaccination record was not found.", 404);
  }
  return record;
}
