import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { setAuthStoreForTests } from "@/lib/auth/store";
import { MemoryHealthLogStore } from "@/lib/health-logs/memory-store";
import { setHealthLogStoreForTests } from "@/lib/health-logs/store";
import { MemoryPetStore } from "@/lib/pets/memory-store";
import { setPetStoreForTests } from "@/lib/pets/store";
import { POST as register } from "../auth/register/route";
import { POST as createPet } from "../pets/route";
import { GET as listLogs, POST as createLog } from "../pets/[id]/health-logs/route";
import { DELETE as deleteLog, PATCH as updateLog } from "./[id]/route";

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
  setHealthLogStoreForTests(new MemoryHealthLogStore());
  setPetStoreForTests(new MemoryPetStore());
});

describe("health log route handlers", () => {
  it("requires authentication", async () => {
    const response = await listLogs(request("/api/pets/pet_1/health-logs", "GET"), {
      params: Promise.resolve({ id: "pet_1" }),
    });
    expect(response.status).toBe(401);
  });

  it("creates, filters, updates, and deletes a health log", async () => {
    const { cookie, petId } = await setupAccountAndPet();
    const created = await createLog(
      request(
        `/api/pets/${petId}/health-logs`,
        "POST",
        {
          type: "symptom",
          occurredAt: "2026-06-01T08:00:00.000Z",
          title: "Morning cough",
          note: "Short cough",
        },
        cookie,
      ),
      { params: Promise.resolve({ id: petId }) },
    );
    expect(created.status).toBe(201);
    const log = await created.json();

    const filtered = await listLogs(
      new NextRequest(`http://localhost/api/pets/${petId}/health-logs?type=symptom`, {
        headers: { cookie },
      }),
      { params: Promise.resolve({ id: petId }) },
    );
    await expect(filtered.json()).resolves.toMatchObject({
      logs: [{ title: "Morning cough", type: "symptom" }],
    });

    const updated = await updateLog(
      request(
        `/api/health-logs/${log.id}`,
        "PATCH",
        {
          type: "symptom",
          occurredAt: "2026-06-01T08:00:00.000Z",
          title: "Morning cough resolved",
          note: "No cough after lunch",
        },
        cookie,
      ),
      { params: Promise.resolve({ id: log.id }) },
    );
    await expect(updated.json()).resolves.toMatchObject({ title: "Morning cough resolved" });

    const deleted = await deleteLog(request(`/api/health-logs/${log.id}`, "DELETE", undefined, cookie), {
      params: Promise.resolve({ id: log.id }),
    });
    expect(deleted.status).toBe(200);
  });
});
