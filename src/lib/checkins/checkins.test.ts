import { beforeEach, describe, expect, it } from "vitest";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { registerUser } from "@/lib/auth/service";
import type { AuthContext } from "@/lib/auth/types";
import { MemoryCheckInStore } from "./memory-store";
import { createCheckIn, listCheckIns } from "./service";

let context: AuthContext;
let store: MemoryCheckInStore;
const petId = "pet_milo";

beforeEach(async () => {
  store = new MemoryCheckInStore();
  const account = await registerUser(new MemoryAuthStore(), {
    email: "lan@example.com",
    displayName: "Lan Nguyen",
    password: "password123",
    householdName: "Lan household",
  });
  context = account.context;
  store.registerPet(context.activeHousehold?.id ?? "", petId);
});

describe("check-in service", () => {
  it("creates and lists check-ins with optional media metadata", async () => {
    await createCheckIn(context, store, petId, {
      occurredAt: "2026-06-01T08:00:00.000Z",
      mood: "playful",
      note: "Fetched ball",
      media: {
        storageKey: "demo/milo.webp",
        mimeType: "image/webp",
        byteSize: 1024,
      },
    });

    await expect(listCheckIns(context, store, petId)).resolves.toMatchObject([
      {
        mood: "playful",
        mediaAssets: [{ storageKey: "demo/milo.webp", mimeType: "image/webp" }],
      },
    ]);
  });

  it("rejects invalid media before creating a record", async () => {
    await expect(
      createCheckIn(context, store, petId, {
        occurredAt: "2026-06-01T08:00:00.000Z",
        mood: "playful",
        media: {
          storageKey: "demo/bad.gif",
          mimeType: "image/gif",
          byteSize: 1024,
        },
      }),
    ).rejects.toMatchObject({ code: "invalid_checkin", status: 400 });

    await expect(listCheckIns(context, store, petId)).resolves.toHaveLength(0);
  });

  it("enforces media storage limit", async () => {
    await expect(
      createCheckIn(context, store, petId, {
        occurredAt: "2026-06-01T08:00:00.000Z",
        media: {
          storageKey: "demo/huge.webp",
          mimeType: "image/webp",
          byteSize: 11 * 1024 * 1024,
        },
      }),
    ).rejects.toMatchObject({ code: "invalid_checkin", status: 400 });
  });
});
