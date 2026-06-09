import { beforeEach, describe, expect, it } from "vitest";
import { MemoryAuthStore } from "./memory-store";
import { hashPassword, verifyPassword } from "./password";
import { getContextFromToken, loginUser, logoutUser, registerUser } from "./service";

let store: MemoryAuthStore;

beforeEach(() => {
  store = new MemoryAuthStore();
});

describe("password hashing", () => {
  it("verifies only the original password", () => {
    const hash = hashPassword("correct-password");

    expect(verifyPassword("correct-password", hash)).toBe(true);
    expect(verifyPassword("wrong-password", hash)).toBe(false);
  });
});

describe("auth service", () => {
  it("registers a user with a default household and starter entitlements", async () => {
    const result = await registerUser(store, {
      email: "User@Example.com",
      displayName: "Lan Nguyen",
      password: "password123",
      householdName: "Lan household",
    });

    expect(result.context.user.email).toBe("user@example.com");
    expect(result.context.activeHousehold).toMatchObject({
      name: "Lan household",
      role: "OWNER",
    });
    expect(result.context.entitlements).toEqual({
      plan: "free",
      petLimit: 1,
      memberLimit: 1,
      mediaLimitMb: 10,
      aiSessionsPerMonth: 5,
    });
  });

  it("rejects duplicate email registration", async () => {
    const input = {
      email: "lan@example.com",
      displayName: "Lan Nguyen",
      password: "password123",
    };

    await registerUser(store, input);
    await expect(registerUser(store, input)).rejects.toMatchObject({
      code: "email_taken",
      status: 409,
    });
  });

  it("logs in, reads context from the session token, and logs out", async () => {
    await registerUser(store, {
      email: "lan@example.com",
      displayName: "Lan Nguyen",
      password: "password123",
    });

    const login = await loginUser(store, {
      email: "lan@example.com",
      password: "password123",
    });

    await expect(getContextFromToken(store, login.session.token)).resolves.toMatchObject({
      user: { email: "lan@example.com" },
    });

    await logoutUser(store, login.session.token);
    await expect(getContextFromToken(store, login.session.token)).resolves.toBeNull();
  });
});
