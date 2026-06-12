import { z, ZodError } from "zod";
import type { AuthContext } from "@/lib/auth/types";
import type { PlanCode } from "@/lib/entitlements/plans";
import { contentHasPaymentCode, createPaymentCode } from "./code";
import { PaymentError } from "./errors";
import { paidPlanAmount } from "./plans";
import type { PaymentOrder, PaymentStore, ReconciliationReport, SepayTransactionInput } from "./types";

const createPaymentSchema = z.object({
  plan: z.enum(["plus", "family"]),
});

const webhookSchema = z.object({
  providerTransactionId: z.string().min(1),
  bankReference: z.string().nullish(),
  bankBrandName: z.string().nullish(),
  accountNumber: z.string().nullish(),
  transactionDate: z.string().datetime({ offset: true }),
  transferAmountVnd: z.number().int().positive(),
  transferDirection: z.enum(["in", "out"]),
  paymentCode: z.string().nullish(),
  transactionContent: z.string().nullish(),
}).passthrough();

const reconcileSchema = z.object({
  transactions: z.array(webhookSchema).min(1),
});

const resolveReviewSchema = z.object({
  transactionId: z.string().min(1),
  paymentCode: z.string().min(1),
  note: z.string().max(500).optional(),
});

function householdId(context: AuthContext) {
  if (!context.activeHousehold) throw new PaymentError("no_household", "No active household is available.", 403);
  return context.activeHousehold.id;
}

export async function createPaymentOrder(context: AuthContext, store: PaymentStore, input: unknown, now = new Date()) {
  let plan: Exclude<PlanCode, "free">;
  try {
    plan = createPaymentSchema.parse(input).plan;
  } catch (error) {
    if (error instanceof ZodError) throw new PaymentError("invalid_payment", "Choose a valid paid plan.", 400);
    throw error;
  }
  const amount = paidPlanAmount(plan);
  if (!amount) throw new PaymentError("invalid_payment", "Choose a valid paid plan.", 400);
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24);
  return store.createPayment(householdId(context), plan, amount, createPaymentCode(now), expiresAt);
}

export async function getPaymentOrder(context: AuthContext, store: PaymentStore, paymentId: string) {
  const payment = await store.findPayment(householdId(context), paymentId);
  if (!payment) throw new PaymentError("payment_not_found", "Payment order was not found.", 404);
  return payment;
}

export async function processSepayWebhook(store: PaymentStore, input: unknown, now = new Date()) {
  let parsed: SepayTransactionInput;
  try {
    const body = webhookSchema.parse(input);
    parsed = { ...body, rawPayload: input as Record<string, unknown> };
  } catch (error) {
    if (error instanceof ZodError) throw new PaymentError("invalid_webhook", "Webhook payload is invalid.", 400);
    throw error;
  }
  if (await store.transactionExists(parsed.providerTransactionId, parsed.bankReference)) {
    return { status: "duplicate" as const };
  }
  const candidateCode = parsed.paymentCode ?? extractPaymentCode(parsed.transactionContent);
  const payment = candidateCode ? await store.findPaymentByCode(candidateCode) : null;
  if (!payment) {
    await store.saveTransaction(parsed, null, "unmatched");
    return { status: "unmatched" as const };
  }
  const match = evaluatePaymentMatch(parsed, payment, now);
  if (!match.ok) {
    await store.saveTransaction(parsed, payment.id, "review_required");
    if (match.reason === "overpayment" || match.reason === "expired_payment") {
      await store.markReviewRequired(payment.id);
    }
    return { status: "review_required" as const, reason: match.reason };
  }
  await store.saveTransaction(parsed, payment.id, "matched");
  const paid = await store.markPaid(payment.id, parsed.transferAmountVnd, new Date(parsed.transactionDate));
  await store.activateEntitlement(payment.householdId, payment.plan, payment.id, now, new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30));
  return { status: "matched" as const, payment: paid };
}

export async function reconcileSepayTransactions(store: PaymentStore, input: unknown, now = new Date()): Promise<ReconciliationReport> {
  let parsed: z.infer<typeof reconcileSchema>;
  try {
    parsed = reconcileSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) throw new PaymentError("invalid_reconciliation", "Reconciliation payload is invalid.", 400);
    throw error;
  }
  const report: ReconciliationReport = { imported: 0, matched: 0, duplicate: 0, reviewRequired: 0, unmatched: 0 };
  for (const transaction of parsed.transactions) {
    const result = await processSepayWebhook(store, transaction, now);
    if (result.status !== "duplicate") report.imported += 1;
    if (result.status === "matched") report.matched += 1;
    if (result.status === "duplicate") report.duplicate += 1;
    if (result.status === "review_required") report.reviewRequired += 1;
    if (result.status === "unmatched") report.unmatched += 1;
  }
  return report;
}

export async function listPaymentReviewItems(context: AuthContext, store: PaymentStore) {
  requireOwner(context);
  return store.listReviewTransactions();
}

export async function resolvePaymentReview(context: AuthContext, store: PaymentStore, input: unknown, now = new Date()) {
  requireOwner(context);
  let parsed: z.infer<typeof resolveReviewSchema>;
  try {
    parsed = resolveReviewSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) throw new PaymentError("invalid_review_resolution", "Review resolution is invalid.", 400);
    throw error;
  }
  const transaction = await store.findTransaction(parsed.transactionId);
  if (!transaction) throw new PaymentError("transaction_not_found", "Payment transaction was not found.", 404);
  if (transaction.processingStatus === "matched") {
    throw new PaymentError("already_resolved", "Payment transaction was already resolved.", 409);
  }
  const payment = await store.findPaymentByCode(parsed.paymentCode.toUpperCase());
  if (!payment) throw new PaymentError("payment_not_found", "Payment order was not found.", 404);
  const match = evaluatePaymentMatch({ ...transaction, paymentCode: parsed.paymentCode.toUpperCase() }, payment, now, { allowReviewRequiredPayment: true });
  if (!match.ok) {
    throw new PaymentError("unsafe_review_resolution", `Cannot resolve transaction automatically: ${match.reason}.`, 409);
  }
  const updatedTransaction = await store.updateTransactionReview(transaction.id, payment.id, "matched");
  const paid = await store.markPaid(payment.id, transaction.transferAmountVnd, new Date(transaction.transactionDate));
  await store.activateEntitlement(payment.householdId, payment.plan, payment.id, now, new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30));
  return { status: "resolved" as const, transaction: updatedTransaction, payment: paid, note: parsed.note ?? null };
}

function extractPaymentCode(content?: string | null) {
  const match = content?.match(/PH-\d{8}-[A-F0-9]{6}/i);
  return match?.[0]?.toUpperCase() ?? null;
}

function requireOwner(context: AuthContext) {
  if (context.activeHousehold?.role !== "OWNER") {
    throw new PaymentError("forbidden", "Only household owners can review payments in this MVP.", 403);
  }
}

function evaluatePaymentMatch(
  transaction: SepayTransactionInput,
  payment: PaymentOrder,
  now: Date,
  options: { allowReviewRequiredPayment?: boolean } = {},
) {
  const codeMatches =
    transaction.paymentCode === payment.providerOrderCode ||
    contentHasPaymentCode(transaction.transactionContent, payment.providerOrderCode);
  if (transaction.transferDirection !== "in") return { ok: false as const, reason: "non_inbound_transfer" };
  if (!codeMatches) return { ok: false as const, reason: "missing_or_wrong_payment_code" };
  if (transaction.transferAmountVnd < payment.expectedAmountVnd) return { ok: false as const, reason: "underpayment" };
  if (transaction.transferAmountVnd > payment.expectedAmountVnd) return { ok: false as const, reason: "overpayment" };
  const payable = (payment.status === "pending" || (options.allowReviewRequiredPayment && payment.status === "review_required")) && new Date(payment.expiresAt) >= now;
  if (!payable) return { ok: false as const, reason: "expired_payment" };
  return { ok: true as const };
}
