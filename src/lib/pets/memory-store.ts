import type { PetInput, PetProfile, PetStore } from "./types";
import { getHealthLogStore } from "@/lib/health-logs/store";
import { MemoryHealthLogStore } from "@/lib/health-logs/memory-store";
import { getVaccinationStore } from "@/lib/vaccinations/store";
import { MemoryVaccinationStore } from "@/lib/vaccinations/memory-store";
import { getCheckInStore } from "@/lib/checkins/store";
import { MemoryCheckInStore } from "@/lib/checkins/memory-store";

function id() {
  return `pet_${Math.random().toString(36).slice(2, 10)}`;
}

function now() {
  return new Date().toISOString();
}

export class MemoryPetStore implements PetStore {
  private pets = new Map<string, PetProfile>();

  async listPets(householdId: string) {
    return [...this.pets.values()]
      .filter((pet) => pet.householdId === householdId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async countActivePets(householdId: string) {
    return [...this.pets.values()].filter((pet) => pet.householdId === householdId && !pet.archivedAt).length;
  }

  async createPet(householdId: string, input: PetInput) {
    const timestamp = now();
    const pet: PetProfile = {
      id: id(),
      householdId,
      name: input.name,
      species: input.species,
      breed: input.breed ?? null,
      sex: input.sex ?? null,
      birthdate: input.birthdate ?? null,
      estimatedAge: input.estimatedAge ?? null,
      allergies: input.allergies ?? null,
      medicalNotes: input.medicalNotes ?? null,
      avatarAssetId: input.avatarAssetId ?? null,
      archivedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.pets.set(pet.id, pet);
    const healthLogStore = getHealthLogStore();
    if (healthLogStore instanceof MemoryHealthLogStore) {
      healthLogStore.registerPet(householdId, pet.id);
    }
    const vaccinationStore = getVaccinationStore();
    if (vaccinationStore instanceof MemoryVaccinationStore) {
      vaccinationStore.registerPet(householdId, pet.id);
    }
    const checkInStore = getCheckInStore();
    if (checkInStore instanceof MemoryCheckInStore) {
      checkInStore.registerPet(householdId, pet.id);
    }
    return pet;
  }

  async findPet(householdId: string, petId: string) {
    const pet = this.pets.get(petId);
    return pet?.householdId === householdId ? pet : null;
  }

  async updatePet(householdId: string, petId: string, input: PetInput) {
    const pet = await this.findPet(householdId, petId);
    if (!pet) {
      return null;
    }

    const updated: PetProfile = {
      ...pet,
      ...input,
      breed: input.breed ?? null,
      sex: input.sex ?? null,
      birthdate: input.birthdate ?? null,
      estimatedAge: input.estimatedAge ?? null,
      allergies: input.allergies ?? null,
      medicalNotes: input.medicalNotes ?? null,
      avatarAssetId: input.avatarAssetId ?? null,
      updatedAt: now(),
    };
    this.pets.set(petId, updated);
    return updated;
  }

  async archivePet(householdId: string, petId: string, archivedAt: Date) {
    const pet = await this.findPet(householdId, petId);
    if (!pet) {
      return null;
    }

    const archived = {
      ...pet,
      archivedAt: pet.archivedAt ?? archivedAt.toISOString(),
      updatedAt: now(),
    };
    this.pets.set(petId, archived);
    return archived;
  }
}
