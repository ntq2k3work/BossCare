import { randomInt, scryptSync, timingSafeEqual } from "node:crypto";
import { AuthError } from "./errors";
import type { AuthStore } from "./types";
import { sendEmail } from "./email";
import { parseRegisterOtpInput, parseVerifyRegisterOtpInput } from "./validation";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_SALT = "pet-healthy-register-otp";

type PendingRegistration = {
  input: {
    email: string;
    displayName: string;
    password: string;
    householdName?: string;
  };
  otpHash: string;
  expiresAt: number;
};

declare global {
  var petHealthyPendingRegistrations: Map<string, PendingRegistration> | undefined;
}

function pendingRegistrations() {
  globalThis.petHealthyPendingRegistrations ??= new Map<string, PendingRegistration>();
  return globalThis.petHealthyPendingRegistrations;
}

function otpHash(otp: string) {
  return scryptSync(otp, OTP_SALT, 32).toString("hex");
}

function verifyOtpHash(otp: string, hash: string) {
  const expected = Buffer.from(hash, "hex");
  const actual = Buffer.from(otpHash(otp), "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function createOtp() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export async function requestRegistrationOtp(store: AuthStore, input: unknown, now = new Date()) {
  const parsed = parseRegisterOtpInput(input);
  const existing = await store.findUserByEmail(parsed.email);
  if (existing) {
    throw new AuthError("email_taken", "An account with this email already exists.", 409);
  }

  const otp = createOtp();
  pendingRegistrations().set(parsed.email, {
    input: {
      email: parsed.email,
      displayName: parsed.displayName,
      password: parsed.password,
      householdName: parsed.householdName,
    },
    otpHash: otpHash(otp),
    expiresAt: now.getTime() + OTP_TTL_MS,
  });

  const email = await sendEmail({
    to: parsed.email,
    subject: "Pet Healthy verification code",
    text: `Your Pet Healthy verification code is ${otp}. It expires in 10 minutes.`,
  });

  return {
    email: parsed.email,
    expiresAt: new Date(now.getTime() + OTP_TTL_MS).toISOString(),
    devOtp: email.devOnly ? otp : undefined,
  };
}

export function consumeRegistrationOtp(input: unknown, now = new Date()) {
  const parsed = parseVerifyRegisterOtpInput(input);
  const pending = pendingRegistrations().get(parsed.email);
  if (!pending) {
    throw new AuthError("otp_not_found", "Request a new verification code.", 404);
  }

  if (pending.expiresAt < now.getTime()) {
    pendingRegistrations().delete(parsed.email);
    throw new AuthError("otp_expired", "Verification code expired. Request a new code.", 410);
  }

  if (!verifyOtpHash(parsed.otp, pending.otpHash)) {
    throw new AuthError("invalid_otp", "Verification code is incorrect.", 401);
  }

  pendingRegistrations().delete(parsed.email);
  return pending.input;
}

export function resetRegistrationOtpForTests() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("resetRegistrationOtpForTests can only be used in tests.");
  }
  pendingRegistrations().clear();
}
