import { beforeEach, describe, expect, it } from "vitest";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { registerUser } from "@/lib/auth/service";
import type { AuthContext } from "@/lib/auth/types";
import { MemoryHealthLogStore } from "./memory-store";
import {
  createHealthLog,
  deleteHealthLog,
  listHealthLogs,
  updateHealthLog,
} from "./service";

let context: AuthContext;
let store: MemoryHealthLogStore;
const petId = "pet_milo";

beforeEach(async () => {
  store = new MemoryHealthLogStore();
  const account = await registerUser(new MemoryAuthStore(), {
    email: "lan@example.com",
    displayName: "Lan Nguyen",
    password: "password123",
    householdName: "Lan household",
  });
  context = account.context;
  store.registerPet(context.activeHousehold?.id ?? "", petId);
});

describe("health log service", () => {
  it("creates, lists by type, updates, and deletes logs chronologically", async () => {
    await createHealthLog(context, store, petId, {
      type: "symptom",
      occurredAt: "2026-06-01T08:00:00.000Z",
      title: "Morning cough",
      note: "Short cough after breakfast",
    });
    const later = await createHealthLog(context, store, petId, {
      type: "weight",
      occurredAt: "2026-06-02T08:00:00.000Z",
      title: "Weight check",
      note: "12kg",
    });

    await expect(listHealthLogs(context, store, petId)).resolves.toMatchObject([
      { title: "Weight check" },
      { title: "Morning cough" },
    ]);
    await expect(listHealthLogs(context, store, petId, "symptom")).resolves.toMatchObject([
      { title: "Morning cough" },
    ]);

    const updated = await updateHealthLog(context, store, later.id, {
      type: "weight",
      occurredAt: "2026-06-02T08:00:00.000Z",
      title: "Weight check updated",
      note: "12.2kg",
    });
    expect(updated.title).toBe("Weight check updated");

    await expect(deleteHealthLog(context, store, later.id)).resolves.toEqual({ ok: true });
    await expect(listHealthLogs(context, store, petId)).resolves.toHaveLength(1);
  });

  it("rejects unknown pets and invalid log input", async () => {
    await expect(
      createHealthLog(context, store, "pet_unknown", {
        type: "weight",
        occurredAt: "2026-06-01T08:00:00.000Z",
        title: "Weight",
      }),
    ).rejects.toMatchObject({ code: "pet_not_found", status: 404 });

    await expect(
      createHealthLog(context, store, petId, {
        type: "",
        occurredAt: "not-a-date",
        title: "",
      }),
    ).rejects.toMatchObject({ code: "invalid_health_log", status: 400 });
  });
});
