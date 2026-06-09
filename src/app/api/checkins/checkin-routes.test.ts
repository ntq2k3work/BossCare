import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { setAuthStoreForTests } from "@/lib/auth/store";
import { MemoryCheckInStore } from "@/lib/checkins/memory-store";
import { setCheckInStoreForTests } from "@/lib/checkins/store";
import { MemoryPetStore } from "@/lib/pets/memory-store";
import { setPetStoreForTests } from "@/lib/pets/store";
import { POST as register } from "../auth/register/route";
import { POST as createPet } from "../pets/route";
import { GET as listCheckIns, POST as createCheckIn } from "../pets/[id]/checkins/route";

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
    request("/api/pets", "POST", { name: "Milo", species: "Dog" }, cookie),
  );
  const pet = await createdPet.json();
  return { cookie, petId: pet.id };
}

beforeEach(() => {
  setAuthStoreForTests(new MemoryAuthStore());
  setPetStoreForTests(new MemoryPetStore());
  setCheckInStoreForTests(new MemoryCheckInStore());
});

describe("check-in route handlers", () => {
  it("requires authentication", async () => {
    const response = await listCheckIns(request("/api/pets/pet_1/checkins", "GET"), {
      params: Promise.resolve({ id: "pet_1" }),
    });
    expect(response.status).toBe(401);
  });

  it("creates and lists check-ins", async () => {
    const { cookie, petId } = await setupAccountAndPet();
    const created = await createCheckIn(
      request(
        `/api/pets/${petId}/checkins`,
        "POST",
        {
          occurredAt: "2026-06-01T08:00:00.000Z",
          mood: "playful",
          note: "Fetched ball",
          media: { storageKey: "demo/milo.webp", mimeType: "image/webp", byteSize: 1024 },
        },
        cookie,
      ),
      { params: Promise.resolve({ id: petId }) },
    );
    expect(created.status).toBe(201);

    const listed = await listCheckIns(request(`/api/pets/${petId}/checkins`, "GET", undefined, cookie), {
      params: Promise.resolve({ id: petId }),
    });
    await expect(listed.json()).resolves.toMatchObject({
      checkIns: [{ mood: "playful", mediaAssets: [{ storageKey: "demo/milo.webp" }] }],
    });
  });
});
