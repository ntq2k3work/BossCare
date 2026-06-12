import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { registerUser } from "@/lib/auth/service";
import type { AuthContext } from "@/lib/auth/types";
import { createPaymentOrder, listPaymentReviewItems, processSepayWebhook, reconcileSepayTransactions, resolvePaymentReview } from "./service";
import { MemoryPaymentStore } from "./memory-store";
import { verifySepaySignature } from "./security";

let context: AuthContext;
let store: MemoryPaymentStore;

beforeEach(async () => {
  store = new MemoryPaymentStore();
  context = (await registerUser(new MemoryAuthStore(), {
    email: "lan@example.com",
    displayName: "Lan Nguyen",
    password: "password123",
    householdName: "Lan household",
  })).context;
});

describe("SePay payment service", () => {
  it("creates a paid plan order and matches an exact inbound webhook", async () => {
    const now = new Date("2026-06-09T00:00:00.000Z");
    const payment = await createPaymentOrder(context, store, { plan: "plus" }, now);
    expect(payment.providerOrderCode).toMatch(/^PH-20260609-[A-F0-9]{6}$/);
    expect(payment.expectedAmountVnd).toBe(99000);

    const result = await processSepayWebhook(store, {
      providerTransactionId: "txn_1",
      bankReference: "ref_1",
      transactionDate: "2026-06-09T01:00:00.000Z",
      transferAmountVnd: 99000,
      transferDirection: "in",
      transactionContent: `Payment ${payment.providerOrderCode}`,
    }, now);

    expect(result).toMatchObject({ status: "matched", payment: { status: "paid" } });
  });

  it("treats duplicate transactions as idempotent and mismatches as unmatched", async () => {
    const payment = await createPaymentOrder(context, store, { plan: "family" });
    const payload = {
      providerTransactionId: "txn_2",
      bankReference: "ref_2",
      transactionDate: "2026-06-09T01:00:00.000Z",
      transferAmountVnd: 199000,
      transferDirection: "in" as const,
      paymentCode: payment.providerOrderCode,
    };

    await expect(processSepayWebhook(store, payload)).resolves.toMatchObject({ status: "matched" });
    await expect(processSepayWebhook(store, payload)).resolves.toMatchObject({ status: "duplicate" });
    await expect(
      processSepayWebhook(store, {
        ...payload,
        providerTransactionId: "txn_3",
        bankReference: "ref_3",
        transferAmountVnd: 1000,
      }),
    ).resolves.toMatchObject({ status: "review_required", reason: "underpayment" });
  });

  it("does not store duplicate transaction rows", async () => {
    let savedTransactions = 0;
    const originalSaveTransaction = store.saveTransaction.bind(store);
    store.saveTransaction = async (...args) => {
      savedTransactions += 1;
      return originalSaveTransaction(...args);
    };
    const payment = await createPaymentOrder(context, store, { plan: "plus" });
    const payload = {
      providerTransactionId: "txn_duplicate",
      bankReference: "ref_duplicate",
      transactionDate: "2026-06-09T01:00:00.000Z",
      transferAmountVnd: payment.expectedAmountVnd,
      transferDirection: "in" as const,
      paymentCode: payment.providerOrderCode,
    };

    await expect(processSepayWebhook(store, payload)).resolves.toMatchObject({ status: "matched" });
    await expect(processSepayWebhook(store, payload)).resolves.toMatchObject({ status: "duplicate" });

    expect(savedTransactions).toBe(1);
  });

  it("verifies HMAC signatures when a secret is configured", () => {
    const payload = JSON.stringify({ ok: true });
    const signature = createHmac("sha256", "secret").update(payload).digest("hex");
    expect(verifySepaySignature(payload, signature, "secret")).toBe(true);
    expect(verifySepaySignature(payload, "00", "secret")).toBe(false);
  });

  it("imports missed SePay transactions through reconciliation", async () => {
    const now = new Date("2026-06-09T00:00:00.000Z");
    const payment = await createPaymentOrder(context, store, { plan: "plus" }, now);
    const report = await reconcileSepayTransactions(store, {
      transactions: [
        {
          providerTransactionId: "txn_reconcile_1",
          bankReference: "ref_reconcile_1",
          transactionDate: "2026-06-09T01:00:00.000Z",
          transferAmountVnd: payment.expectedAmountVnd,
          transferDirection: "in",
          transactionContent: `Missed webhook ${payment.providerOrderCode}`,
        },
      ],
    }, now);

    expect(report).toMatchObject({ imported: 1, matched: 1, duplicate: 0 });
  });

  it("creates review items and resolves an exact manual payment match", async () => {
    const now = new Date("2026-06-09T00:00:00.000Z");
    const payment = await createPaymentOrder(context, store, { plan: "plus" }, now);
    await processSepayWebhook(store, {
      providerTransactionId: "txn_review_1",
      bankReference: "ref_review_1",
      transactionDate: "2026-06-09T01:00:00.000Z",
      transferAmountVnd: payment.expectedAmountVnd,
      transferDirection: "in",
      transactionContent: "No code in transfer content",
    }, now);
    const [item] = await listPaymentReviewItems(context, store);
    expect(item).toMatchObject({ processingStatus: "unmatched", mismatchReason: "missing_payment_code" });

    const resolved = await resolvePaymentReview(context, store, {
      transactionId: item.id,
      paymentCode: payment.providerOrderCode,
      note: "Bank reference confirmed by admin.",
    }, now);

    expect(resolved).toMatchObject({ status: "resolved", payment: { status: "paid" }, transaction: { processingStatus: "matched" } });
  });
});
