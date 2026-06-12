import { z } from "zod";

export const registerSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase().trim()),
  displayName: z.string().trim().min(2).max(80),
  password: z.string().min(8).max(128),
  householdName: z.string().trim().min(2).max(80).optional(),
});

export const registerOtpSchema = registerSchema.extend({
  passwordConfirm: z.string().min(8).max(128),
}).refine((value) => value.password === value.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match.",
});

export const verifyRegisterOtpSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase().trim()),
  otp: z.string().trim().regex(/^\d{6}$/),
});

export const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase().trim()),
  password: z.string().min(1).max(128),
});

export function parseRegisterInput(input: unknown) {
  return registerSchema.parse(input);
}

export function parseRegisterOtpInput(input: unknown) {
  return registerOtpSchema.parse(input);
}

export function parseVerifyRegisterOtpInput(input: unknown) {
  return verifyRegisterOtpSchema.parse(input);
}

export function parseLoginInput(input: unknown) {
  return loginSchema.parse(input);
}
