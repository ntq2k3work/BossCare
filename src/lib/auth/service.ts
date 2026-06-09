import { ZodError } from "zod";
import { AuthError } from "./errors";
import { hashPassword, verifyPassword } from "./password";
import {
  createSessionToken,
  hashSessionToken,
  sessionExpiresAt,
} from "./session";
import type { AuthContext, AuthStore } from "./types";
import { parseLoginInput, parseRegisterInput } from "./validation";

function validationError(error: unknown): never {
  if (error instanceof ZodError) {
    throw new AuthError("invalid_input", "Check the account details and try again.", 400);
  }

  throw error;
}

export async function registerUser(store: AuthStore, input: unknown) {
  let parsed: ReturnType<typeof parseRegisterInput>;
  try {
    parsed = parseRegisterInput(input);
  } catch (error) {
    validationError(error);
  }

  const existing = await store.findUserByEmail(parsed.email);
  if (existing) {
    throw new AuthError("email_taken", "An account with this email already exists.", 409);
  }

  const account = await store.createAccount({
    email: parsed.email,
    displayName: parsed.displayName,
    passwordHash: hashPassword(parsed.password),
    householdName: parsed.householdName ?? `${parsed.displayName}'s household`,
  });

  const session = await issueSession(store, account.user.id);
  return {
    context: await requireContext(store, session.token),
    session,
  };
}

export async function loginUser(store: AuthStore, input: unknown) {
  let parsed: ReturnType<typeof parseLoginInput>;
  try {
    parsed = parseLoginInput(input);
  } catch (error) {
    validationError(error);
  }

  const user = await store.findUserByEmail(parsed.email);
  if (!user || !verifyPassword(parsed.password, user.passwordHash)) {
    throw new AuthError("invalid_credentials", "Email or password is incorrect.", 401);
  }

  const session = await issueSession(store, user.id);
  return {
    context: await requireContext(store, session.token),
    session,
  };
}

export async function getContextFromToken(store: AuthStore, token: string | undefined) {
  if (!token) {
    return null;
  }

  return store.findContextBySession(hashSessionToken(token), new Date());
}

export async function logoutUser(store: AuthStore, token: string | undefined) {
  if (token) {
    await store.deleteSession(hashSessionToken(token));
  }
}

async function issueSession(store: AuthStore, userId: string) {
  const token = createSessionToken();
  const expiresAt = sessionExpiresAt();
  await store.createSession(userId, hashSessionToken(token), expiresAt);
  return { token, expiresAt };
}

async function requireContext(store: AuthStore, token: string): Promise<AuthContext> {
  const context = await getContextFromToken(store, token);
  if (!context) {
    throw new AuthError("session_failed", "Could not create a session.", 500);
  }

  return context;
}
