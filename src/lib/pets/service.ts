import { ZodError } from "zod";
import type { AuthContext } from "@/lib/auth/types";
import { PetError } from "./errors";
import type { PetStore } from "./types";
import { parsePetInput } from "./validation";

function activeHouseholdId(context: AuthContext) {
  if (!context.activeHousehold) {
    throw new PetError("no_household", "No active household is available.", 403);
  }

  return context.activeHousehold.id;
}

function parseInput(input: unknown) {
  try {
    return parsePetInput(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new PetError("invalid_pet", "Check the pet profile details and try again.", 400);
    }
    throw error;
  }
}

export async function listPets(context: AuthContext, store: PetStore) {
  return store.listPets(activeHouseholdId(context));
}

export async function createPet(context: AuthContext, store: PetStore, input: unknown) {
  const householdId = activeHouseholdId(context);
  const parsed = parseInput(input);
  const activeCount = await store.countActivePets(householdId);

  if (activeCount >= context.entitlements.petLimit) {
    throw new PetError("pet_limit_reached", "Archive a pet or upgrade before adding another active pet.", 409);
  }

  return store.createPet(householdId, parsed);
}

export async function getPet(context: AuthContext, store: PetStore, petId: string) {
  const pet = await store.findPet(activeHouseholdId(context), petId);
  if (!pet) {
    throw new PetError("pet_not_found", "Pet profile was not found.", 404);
  }

  return pet;
}

export async function updatePet(context: AuthContext, store: PetStore, petId: string, input: unknown) {
  const pet = await store.updatePet(activeHouseholdId(context), petId, parseInput(input));
  if (!pet) {
    throw new PetError("pet_not_found", "Pet profile was not found.", 404);
  }

  return pet;
}

export async function archivePet(context: AuthContext, store: PetStore, petId: string) {
  const pet = await store.archivePet(activeHouseholdId(context), petId, new Date());
  if (!pet) {
    throw new PetError("pet_not_found", "Pet profile was not found.", 404);
  }

  return pet;
}
