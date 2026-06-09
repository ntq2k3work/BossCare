import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { setAuthStoreForTests } from "@/lib/auth/store";
import { MemoryPetStore } from "@/lib/pets/memory-store";
import { setPetStoreForTests } from "@/lib/pets/store";
import { MemoryVaccinationStore } from "@/lib/vaccinations/memory-store";
import { setVaccinationStoreForTests } from "@/lib/vaccinations/store";
import { POST as register } from "../auth/register/route";
import { POST as createPet } from "../pets/route";
import { GET as listVaccinations, POST as createVaccination } from "../pets/[id]/vaccinations/route";
import { PATCH as updateVaccination } from "./[id]/route";

function request(path: string, method: string, body?: unknown, cookie?: string) {
  return new NextRequest(`http://localhost${path}`, {
    method,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...(cookie ? { cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function setupAccountAndPet() {
  const registered = await register(
    request("/api/auth/register", "POST", {
      email: "lan@example.com",
      displayName: "Lan Nguyen",
      password: "password123",
      householdName: "Lan household",
    }),
  );
  const cookie = registered.headers.get("set-cookie")?.split(";")[0] ?? "";
  const createdPet = await createPet(
    request(
      "/api/pets",
      "POST",
      {
        name: "Milo",
        species: "Dog",
      },
      cookie,
    ),
  );
  const pet = await createdPet.json();
  return { cookie, petId: pet.id };
}

beforeEach(() => {
  setAuthStoreForTests(new MemoryAuthStore());
  setPetStoreForTests(new MemoryPetStore());
  setVaccinationStoreForTests(new MemoryVaccinationStore());
});

describe("vaccination route handlers", () => {
  it("requires authentication", async () => {
    const response = await listVaccinations(request("/api/pets/pet_1/vaccinations", "GET"), {
      params: Promise.resolve({ id: "pet_1" }),
    });
    expect(response.status).toBe(401);
  });

  it("creates, lists, and updates vaccination records", async () => {
    const { cookie, petId } = await setupAccountAndPet();
    const created = await createVaccination(
      request(
        `/api/pets/${petId}/vaccinations`,
        "POST",
        {
          vaccineName: "Rabies",
          givenAt: "2025-06-01",
          nextDueAt: "2026-06-08",
          clinicName: "Happy Vet",
        },
        cookie,
      ),
      { params: Promise.resolve({ id: petId }) },
    );
    expect(created.status).toBe(201);
    const record = await created.json();

    const listed = await listVaccinations(request(`/api/pets/${petId}/vaccinations`, "GET", undefined, cookie), {
      params: Promise.resolve({ id: petId }),
    });
    await expect(listed.json()).resolves.toMatchObject({
      vaccinations: [{ vaccineName: "Rabies" }],
    });

    const updated = await updateVaccination(
      request(
        `/api/vaccinations/${record.id}`,
        "PATCH",
        {
          vaccineName: "Rabies booster",
          givenAt: "2026-06-09",
          nextDueAt: "2026-07-01",
          clinicName: "Happy Vet",
        },
        cookie,
      ),
      { params: Promise.resolve({ id: record.id }) },
    );
    await expect(updated.json()).resolves.toMatchObject({ vaccineName: "Rabies booster" });
  });
});
