import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { setAuthStoreForTests } from "@/lib/auth/store";
import { POST as login } from "./login/route";
import { POST as logout } from "./logout/route";
import { POST as register } from "./register/route";
import { GET as me } from "../me/route";

function jsonRequest(path: string, body: unknown, cookie?: string) {
  return new NextRequest(`http://localhost${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  setAuthStoreForTests(new MemoryAuthStore());
});

describe("auth route handlers", () => {
  it("registers, returns /api/me context, and logs out", async () => {
    const registered = await register(
      jsonRequest("/api/auth/register", {
        email: "lan@example.com",
        displayName: "Lan Nguyen",
        password: "password123",
        householdName: "Lan household",
      }),
    );

    expect(registered.status).toBe(201);
    const setCookie = registered.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(SESSION_COOKIE);

    const cookie = setCookie.split(";")[0];
    const context = await me(
      new NextRequest("http://localhost/api/me", {
        headers: { cookie },
      }),
    );
    expect(context.status).toBe(200);
    await expect(context.json()).resolves.toMatchObject({
      user: { email: "lan@example.com" },
      activeHousehold: { name: "Lan household", role: "OWNER" },
    });

    const loggedOut = await logout(jsonRequest("/api/auth/logout", {}, cookie));
    expect(loggedOut.status).toBe(200);
    const afterLogout = await me(
      new NextRequest("http://localhost/api/me", {
        headers: { cookie },
      }),
    );
    expect(afterLogout.status).toBe(401);
  });

  it("logs in with valid credentials and rejects bad credentials", async () => {
    await register(
      jsonRequest("/api/auth/register", {
        email: "lan@example.com",
        displayName: "Lan Nguyen",
        password: "password123",
      }),
    );

    const success = await login(
      jsonRequest("/api/auth/login", {
        email: "lan@example.com",
        password: "password123",
      }),
    );
    expect(success.status).toBe(200);

    const failure = await login(
      jsonRequest("/api/auth/login", {
        email: "lan@example.com",
        password: "bad-password",
      }),
    );
    expect(failure.status).toBe(401);
  });
});
