import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((value) => (value ? value : null));

export const vaccinationInputSchema = z.object({
  vaccineName: z.string().trim().min(1).max(120),
  givenAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  nextDueAt: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  clinicName: optionalText,
  note: optionalText,
});

export function parseVaccinationInput(input: unknown) {
  return vaccinationInputSchema.parse(input);
}
