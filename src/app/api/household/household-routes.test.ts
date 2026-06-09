import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { setAuthStoreForTests } from "@/lib/auth/store";
import { POST as register } from "../auth/register/route";
import { GET as listMembers, POST as inviteMember } from "./members/route";

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

async function createAccount(email: string, name: string) {
  const response = await register(
    request("/api/auth/register", "POST", {
      email,
      displayName: name,
      password: "password123",
      householdName: `${name} household`,
    }),
  );
  return response.headers.get("set-cookie")?.split(";")[0] ?? "";
}

beforeEach(() => {
  setAuthStoreForTests(new MemoryAuthStore());
});

describe("household routes", () => {
  it("requires authentication", async () => {
    const response = await listMembers(request("/api/household/members", "GET"));
    expect(response.status).toBe(401);
  });

  it("lists members and enforces free invite limit", async () => {
    const ownerCookie = await createAccount("owner@example.com", "Owner");
    await createAccount("member@example.com", "Member");

    const invited = await inviteMember(
      request("/api/household/members", "POST", { email: "member@example.com" }, ownerCookie),
    );
    expect(invited.status).toBe(409);

    const listed = await listMembers(request("/api/household/members", "GET", undefined, ownerCookie));
    await expect(listed.json()).resolves.toMatchObject({
      members: [
        { email: "owner@example.com", role: "OWNER" },
      ],
    });
  });
});
