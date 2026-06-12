import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { setAuthStoreForTests } from "@/lib/auth/store";
import { MemoryAiCareStore } from "@/lib/ai-care/memory-store";
import { setAiCareStoreForTests } from "@/lib/ai-care/store";
import { POST as register } from "../auth/register/route";
import { POST as askCareGuide } from "./route";

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
      email: "linh@example.com",
      displayName: "Linh Nguyen",
      password: "password123",
      householdName: "Linh household",
    }),
  );
  return response.headers.get("set-cookie")?.split(";")[0] ?? "";
}

beforeEach(() => {
  setAuthStoreForTests(new MemoryAuthStore());
  setAiCareStoreForTests(new MemoryAiCareStore());
});

describe("AI Care Guide route", () => {
  it("answers authenticated care questions", async () => {
    const cookie = await authCookie();
    const response = await askCareGuide(request("/api/ai-care-guide", "POST", { question: "My dog has diarrhea" }, cookie));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ classification: "general", quota: { used: 1 } });
  });
});
