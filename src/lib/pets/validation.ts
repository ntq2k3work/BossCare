import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((value) => (value ? value : null));

export const petInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  species: z.string().trim().min(1).max(50),
  breed: optionalText,
  sex: optionalText,
  birthdate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  estimatedAge: optionalText,
  allergies: optionalText,
  medicalNotes: optionalText,
  avatarAssetId: optionalText,
});

export function parsePetInput(input: unknown) {
  return petInputSchema.parse(input);
}
