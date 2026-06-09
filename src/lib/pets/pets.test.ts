import { beforeEach, describe, expect, it } from "vitest";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { registerUser } from "@/lib/auth/service";
import type { AuthContext } from "@/lib/auth/types";
import { MemoryPetStore } from "./memory-store";
import { archivePet, createPet, getPet, listPets, updatePet } from "./service";

let context: AuthContext;
let store: MemoryPetStore;

beforeEach(async () => {
  store = new MemoryPetStore();
  const account = await registerUser(new MemoryAuthStore(), {
    email: "lan@example.com",
    displayName: "Lan Nguyen",
    password: "password123",
    householdName: "Lan household",
  });
  context = account.context;
});

describe("pet profile service", () => {
  it("creates, updates, archives, and reads a household pet", async () => {
    const pet = await createPet(context, store, {
      name: "Milo",
      species: "Dog",
      breed: "Corgi",
    });

    expect(await listPets(context, store)).toHaveLength(1);
    await expect(getPet(context, store, pet.id)).resolves.toMatchObject({
      name: "Milo",
      species: "Dog",
    });

    const updated = await updatePet(context, store, pet.id, {
      name: "Milo",
      species: "Dog",
      breed: "Corgi",
      allergies: "Chicken",
    });
    expect(updated.allergies).toBe("Chicken");

    const archived = await archivePet(context, store, pet.id);
    expect(archived.archivedAt).toEqual(expect.any(String));
  });

  it("enforces the active pet limit but allows creating after archive", async () => {
    const pet = await createPet(context, store, {
      name: "Milo",
      species: "Dog",
    });

    await expect(
      createPet(context, store, {
        name: "Luna",
        species: "Cat",
      }),
    ).rejects.toMatchObject({
      code: "pet_limit_reached",
      status: 409,
    });

    await archivePet(context, store, pet.id);
    await expect(
      createPet(context, store, {
        name: "Luna",
        species: "Cat",
      }),
    ).resolves.toMatchObject({ name: "Luna" });
  });

  it("rejects invalid required fields", async () => {
    await expect(
      createPet(context, store, {
        name: "",
        species: "",
      }),
    ).rejects.toMatchObject({
      code: "invalid_pet",
      status: 400,
    });
  });
});
