import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .transform((value) => (value ? value : null));

export const mediaInputSchema = z.object({
  storageKey: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().regex(/^image\/(jpeg|png|webp)$/),
  byteSize: z.number().int().positive().max(10 * 1024 * 1024),
});

export const checkInInputSchema = z.object({
  occurredAt: z.string().trim().datetime({ offset: true }),
  mood: optionalText,
  note: optionalText,
  media: mediaInputSchema.nullable().optional().default(null),
});

export function parseCheckInInput(input: unknown) {
  return checkInInputSchema.parse(input);
}
