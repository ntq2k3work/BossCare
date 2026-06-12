import { createHmac, timingSafeEqual } from "node:crypto";

export function verifySepaySignature(payload: string, signature: string | null, secret = process.env.SEPAY_WEBHOOK_SECRET) {
  if (!secret) return true;
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const expectedBytes = Buffer.from(expected, "hex");
  const actualBytes = Buffer.from(signature.replace(/^sha256=/, ""), "hex");
  return expectedBytes.length === actualBytes.length && timingSafeEqual(expectedBytes, actualBytes);
}
