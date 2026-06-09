export type PetProfile = {
  id: string;
  householdId: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  birthdate: string | null;
  estimatedAge: string | null;
  allergies: string | null;
  medicalNotes: string | null;
  avatarAssetId: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PetInput = {
  name: string;
  species: string;
  breed?: string | null;
  sex?: string | null;
  birthdate?: string | null;
  estimatedAge?: string | null;
  allergies?: string | null;
  medicalNotes?: string | null;
  avatarAssetId?: string | null;
};

export interface PetStore {
  listPets(householdId: string): Promise<PetProfile[]>;
  countActivePets(householdId: string): Promise<number>;
  createPet(householdId: string, input: PetInput): Promise<PetProfile>;
  findPet(householdId: string, petId: string): Promise<PetProfile | null>;
  updatePet(householdId: string, petId: string, input: PetInput): Promise<PetProfile | null>;
  archivePet(householdId: string, petId: string, archivedAt: Date): Promise<PetProfile | null>;
}
