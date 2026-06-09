import { z } from "zod";

export const registerSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase().trim()),
  displayName: z.string().trim().min(2).max(80),
  password: z.string().min(8).max(128),
  householdName: z.string().trim().min(2).max(80).optional(),
});

export const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase().trim()),
  password: z.string().min(1).max(128),
});

export function parseRegisterInput(input: unknown) {
  return registerSchema.parse(input);
}

export function parseLoginInput(input: unknown) {
  return loginSchema.parse(input);
}
