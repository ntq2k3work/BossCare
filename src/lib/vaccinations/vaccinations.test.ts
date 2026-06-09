import { beforeEach, describe, expect, it } from "vitest";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { registerUser } from "@/lib/auth/service";
import type { AuthContext } from "@/lib/auth/types";
import { vaccinationStatus } from "./status";
import { MemoryVaccinationStore } from "./memory-store";
import { createVaccination, listVaccinations, updateVaccination } from "./service";

let context: AuthContext;
let store: MemoryVaccinationStore;
const petId = "pet_milo";
const today = new Date("2026-06-09T00:00:00.000Z");

beforeEach(async () => {
  store = new MemoryVaccinationStore();
  const account = await registerUser(new MemoryAuthStore(), {
    email: "lan@example.com",
    displayName: "Lan Nguyen",
    password: "password123",
    householdName: "Lan household",
  });
  context = account.context;
  store.registerPet(context.activeHousehold?.id ?? "", petId);
});

describe("vaccination status", () => {
  it("classifies overdue, upcoming, scheduled, and complete records", () => {
    expect(vaccinationStatus("2026-06-08", today)).toBe("overdue");
    expect(vaccinationStatus("2026-06-09", today)).toBe("upcoming");
    expect(vaccinationStatus("2026-07-01", today)).toBe("upcoming");
    expect(vaccinationStatus("2026-08-01", today)).toBe("scheduled");
    expect(vaccinationStatus(null, today)).toBe("complete");
  });
});

describe("vaccination service", () => {
  it("creates, lists, and updates vaccination records with derived status", async () => {
    const record = await createVaccination(
      context,
      store,
      petId,
      {
        vaccineName: "Rabies",
        givenAt: "2025-06-01",
        nextDueAt: "2026-06-08",
        clinicName: "Happy Vet",
        note: "Annual shot",
      },
      today,
    );

    expect(record.status).toBe("overdue");
    await expect(listVaccinations(context, store, petId, today)).resolves.toMatchObject([
      { vaccineName: "Rabies", status: "overdue" },
    ]);

    const updated = await updateVaccination(
      context,
      store,
      record.id,
      {
        vaccineName: "Rabies booster",
        givenAt: "2026-06-09",
        nextDueAt: "2026-07-01",
      },
      today,
    );
    expect(updated).toMatchObject({ vaccineName: "Rabies booster", status: "upcoming" });
  });

  it("rejects unknown pets and invalid vaccination input", async () => {
    await expect(
      createVaccination(
        context,
        store,
        "pet_unknown",
        {
          vaccineName: "Rabies",
          givenAt: "2026-06-09",
        },
        today,
      ),
    ).rejects.toMatchObject({ code: "pet_not_found", status: 404 });

    await expect(
      createVaccination(
        context,
        store,
        petId,
        {
          vaccineName: "",
          givenAt: "bad-date",
        },
        today,
      ),
    ).rejects.toMatchObject({ code: "invalid_vaccination", status: 400 });
  });
});
