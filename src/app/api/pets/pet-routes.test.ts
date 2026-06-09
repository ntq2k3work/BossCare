import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { setAuthStoreForTests } from "@/lib/auth/store";
import { MemoryPetStore } from "@/lib/pets/memory-store";
import { setPetStoreForTests } from "@/lib/pets/store";
import { POST as register } from "../auth/register/route";
import { GET as listPets, POST as createPet } from "./route";
import { GET as getPet, PATCH as updatePet } from "./[id]/route";
import { POST as archivePet } from "./[id]/archive/route";

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

async function authCookie() {
  const response = await register(
    request("/api/auth/register", "POST", {
      email: "lan@example.com",
      displayName: "Lan Nguyen",
      password: "password123",
      householdName: "Lan household",
    }),
  );
  return response.headers.get("set-cookie")?.split(";")[0] ?? "";
}

beforeEach(() => {
  setAuthStoreForTests(new MemoryAuthStore());
  setPetStoreForTests(new MemoryPetStore());
});

describe("pet route handlers", () => {
  it("requires authentication", async () => {
    const response = await listPets(request("/api/pets", "GET"));
    expect(response.status).toBe(401);
  });

  it("creates, lists, updates, reads, and archives a pet", async () => {
    const cookie = await authCookie();
    const created = await createPet(
      request(
        "/api/pets",
        "POST",
        {
          name: "Milo",
          species: "Dog",
          breed: "Corgi",
        },
        cookie,
      ),
    );
    expect(created.status).toBe(201);
    const pet = await created.json();

    const listed = await listPets(request("/api/pets", "GET", undefined, cookie));
    await expect(listed.json()).resolves.toMatchObject({
      pets: [{ name: "Milo", archivedAt: null }],
    });

    const updated = await updatePet(
      request(
        `/api/pets/${pet.id}`,
        "PATCH",
        {
          name: "Milo",
          species: "Dog",
          breed: "Corgi",
          allergies: "Chicken",
        },
        cookie,
      ),
      { params: Promise.resolve({ id: pet.id }) },
    );
    expect(updated.status).toBe(200);

    const read = await getPet(request(`/api/pets/${pet.id}`, "GET", undefined, cookie), {
      params: Promise.resolve({ id: pet.id }),
    });
    await expect(read.json()).resolves.toMatchObject({
      name: "Milo",
      allergies: "Chicken",
    });

    const archived = await archivePet(request(`/api/pets/${pet.id}/archive`, "POST", undefined, cookie), {
      params: Promise.resolve({ id: pet.id }),
    });
    await expect(archived.json()).resolves.toMatchObject({
      name: "Milo",
      archivedAt: expect.any(String),
    });
  });
});
