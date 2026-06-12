import { PLAN_LIMITS, type PlanCode } from "@/lib/entitlements/plans";
import type { PaymentOrder, PaymentReviewItem, PaymentStore, PaymentTransaction, SepayTransactionInput, TransactionStatus } from "./types";

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function now() {
  return new Date().toISOString();
}

export class MemoryPaymentStore implements PaymentStore {
  private payments = new Map<string, PaymentOrder>();
  private transactions = new Map<string, PaymentTransaction>();
  private activeEntitlements = new Map<string, { plan: PlanCode; paymentId: string }>();

  async createPayment(householdId: string, plan: PlanCode, amountVnd: number, code: string, expiresAt: Date) {
    const timestamp = now();
    const payment: PaymentOrder = {
      id: id("payment"),
      householdId,
      plan,
      provider: "sepay",
      providerOrderCode: code,
      expectedAmountVnd: amountVnd,
      paidAmountVnd: null,
      status: "pending",
      expiresAt: expiresAt.toISOString(),
      paidAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.payments.set(payment.id, payment);
    return payment;
  }

  async findPayment(householdId: string, paymentId: string) {
    const payment = this.payments.get(paymentId);
    return payment?.householdId === householdId ? payment : null;
  }

  async findPaymentByCode(code: string) {
    return [...this.payments.values()].find((payment) => payment.providerOrderCode === code) ?? null;
  }

  async transactionExists(providerTransactionId: string, bankReference?: string | null) {
    return [...this.transactions.values()].some(
      (transaction) =>
        transaction.providerTransactionId === providerTransactionId ||
        Boolean(bankReference && transaction.bankReference === bankReference),
    );
  }

  async saveTransaction(input: SepayTransactionInput, paymentId: string | null, status: TransactionStatus) {
    const transaction: PaymentTransaction = {
      ...input,
      id: id("txn"),
      paymentId,
      provider: "sepay",
      processingStatus: status,
      createdAt: now(),
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async markPaid(paymentId: string, amountVnd: number, paidAt: Date) {
    const payment = this.payments.get(paymentId);
    if (!payment) throw new Error("payment missing");
    const updated = {
      ...payment,
      paidAmountVnd: amountVnd,
      status: "paid" as const,
      paidAt: paidAt.toISOString(),
      updatedAt: now(),
    };
    this.payments.set(paymentId, updated);
    return updated;
  }

  async markReviewRequired(paymentId: string) {
    const payment = this.payments.get(paymentId);
    if (!payment) throw new Error("payment missing");
    const updated = {
      ...payment,
      status: "review_required" as const,
      updatedAt: now(),
    };
    this.payments.set(paymentId, updated);
    return updated;
  }

  async activateEntitlement(householdId: string, plan: PlanCode, paymentId: string) {
    if (!PLAN_LIMITS[plan]) throw new Error("invalid plan");
    this.activeEntitlements.set(householdId, { plan, paymentId });
  }

  async listReviewTransactions() {
    return [...this.transactions.values()]
      .filter((transaction) => transaction.processingStatus === "unmatched" || transaction.processingStatus === "review_required")
      .map((transaction): PaymentReviewItem => ({
        ...transaction,
        mismatchReason: mismatchReason(transaction),
        payment: transaction.paymentId ? this.payments.get(transaction.paymentId) ?? null : null,
      }));
  }

  async findTransaction(transactionId: string) {
    return this.transactions.get(transactionId) ?? null;
  }

  async updateTransactionReview(transactionId: string, paymentId: string, status: TransactionStatus) {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error("transaction missing");
    const updated = { ...transaction, paymentId, processingStatus: status };
    this.transactions.set(transactionId, updated);
    return updated;
  }
}

function mismatchReason(transaction: PaymentTransaction) {
  if (!transaction.paymentId) return "missing_payment_code";
  if (transaction.transferDirection !== "in") return "non_inbound_transfer";
  return "amount_or_payable_mismatch";
}
