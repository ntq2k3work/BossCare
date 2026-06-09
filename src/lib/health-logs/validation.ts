import { z } from "zod";

const optionalNote = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .transform((value) => (value ? value : null));

export const healthLogInputSchema = z.object({
  type: z.string().trim().min(1).max(50),
  occurredAt: z.string().trim().datetime({ offset: true }),
  title: z.string().trim().min(1).max(120),
  note: optionalNote,
  metadataJson: z.record(z.string(), z.unknown()).nullable().optional().default(null),
});

export function parseHealthLogInput(input: unknown) {
  return healthLogInputSchema.parse(input);
}
