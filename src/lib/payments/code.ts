import { randomBytes } from "node:crypto";

export function createPaymentCode(now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `PH-${date}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export function contentHasPaymentCode(content: string | null | undefined, code: string) {
  return Boolean(content?.toUpperCase().includes(code.toUpperCase()));
}
