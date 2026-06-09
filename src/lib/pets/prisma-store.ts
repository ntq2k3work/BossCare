import { getPrisma } from "@/lib/db/prisma";
import type { PetInput, PetProfile, PetStore } from "./types";

function toProfile(pet: {
  id: string;
  householdId: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  birthdate: Date | null;
  estimatedAge: string | null;
  allergies: string | null;
  medicalNotes: string | null;
  avatarAssetId: string | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): PetProfile {
  return {
    id: pet.id,
    householdId: pet.householdId,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    sex: pet.sex,
    birthdate: pet.birthdate?.toISOString().slice(0, 10) ?? null,
    estimatedAge: pet.estimatedAge,
    allergies: pet.allergies,
    medicalNotes: pet.medicalNotes,
    avatarAssetId: pet.avatarAssetId,
    archivedAt: pet.archivedAt?.toISOString() ?? null,
    createdAt: pet.createdAt.toISOString(),
    updatedAt: pet.updatedAt.toISOString(),
  };
}

function toData(input: PetInput) {
  return {
    name: input.name,
    species: input.species,
    breed: input.breed ?? null,
    sex: input.sex ?? null,
    birthdate: input.birthdate ? new Date(`${input.birthdate}T00:00:00.000Z`) : null,
    estimatedAge: input.estimatedAge ?? null,
    allergies: input.allergies ?? null,
    medicalNotes: input.medicalNotes ?? null,
    avatarAssetId: input.avatarAssetId ?? null,
  };
}

export class PrismaPetStore implements PetStore {
  async listPets(householdId: string) {
    const pets = await getPrisma().pet.findMany({
      where: { householdId },
      orderBy: [{ archivedAt: "asc" }, { createdAt: "asc" }],
    });
    return pets.map(toProfile);
  }

  async countActivePets(householdId: string) {
    return getPrisma().pet.count({
      where: { householdId, archivedAt: null },
    });
  }

  async createPet(householdId: string, input: PetInput) {
    const pet = await getPrisma().pet.create({
      data: { householdId, ...toData(input) },
    });
    return toProfile(pet);
  }

  async findPet(householdId: string, petId: string) {
    const pet = await getPrisma().pet.findFirst({
      where: { id: petId, householdId },
    });
    return pet ? toProfile(pet) : null;
  }

  async updatePet(householdId: string, petId: string, input: PetInput) {
    const exists = await this.findPet(householdId, petId);
    if (!exists) {
      return null;
    }

    const pet = await getPrisma().pet.update({
      where: { id: petId },
      data: toData(input),
    });
    return toProfile(pet);
  }

  async archivePet(householdId: string, petId: string, archivedAt: Date) {
    const exists = await this.findPet(householdId, petId);
    if (!exists) {
      return null;
    }

    const pet = await getPrisma().pet.update({
      where: { id: petId },
      data: { archivedAt: exists.archivedAt ? undefined : archivedAt },
    });
    return toProfile(pet);
  }
}
