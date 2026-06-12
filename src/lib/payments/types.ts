import type { PlanCode } from "@/lib/entitlements/plans";

export type PaymentStatus = "pending" | "paid" | "review_required" | "expired";
export type TransactionStatus = "matched" | "duplicate" | "unmatched" | "review_required" | "invalid";

export type PaymentOrder = {
  id: string;
  householdId: string;
  plan: PlanCode;
  provider: "sepay";
  providerOrderCode: string;
  expectedAmountVnd: number;
  paidAmountVnd: number | null;
  status: PaymentStatus;
  expiresAt: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SepayTransactionInput = {
  providerTransactionId: string;
  bankReference?: string | null;
  bankBrandName?: string | null;
  accountNumber?: string | null;
  transactionDate: string;
  transferAmountVnd: number;
  transferDirection: "in" | "out";
  paymentCode?: string | null;
  transactionContent?: string | null;
  rawPayload: Record<string, unknown>;
};

export type PaymentTransaction = SepayTransactionInput & {
  id: string;
  paymentId: string | null;
  provider: "sepay";
  processingStatus: TransactionStatus;
  createdAt: string;
};

export type PaymentReviewItem = PaymentTransaction & {
  mismatchReason: string;
  payment?: PaymentOrder | null;
};

export type ReconciliationReport = {
  imported: number;
  matched: number;
  duplicate: number;
  reviewRequired: number;
  unmatched: number;
};

export interface PaymentStore {
  createPayment(householdId: string, plan: PlanCode, amountVnd: number, code: string, expiresAt: Date): Promise<PaymentOrder>;
  findPayment(householdId: string, paymentId: string): Promise<PaymentOrder | null>;
  findPaymentByCode(code: string): Promise<PaymentOrder | null>;
  transactionExists(providerTransactionId: string, bankReference?: string | null): Promise<boolean>;
  saveTransaction(input: SepayTransactionInput, paymentId: string | null, status: TransactionStatus): Promise<PaymentTransaction>;
  markPaid(paymentId: string, amountVnd: number, paidAt: Date): Promise<PaymentOrder>;
  markReviewRequired(paymentId: string): Promise<PaymentOrder>;
  activateEntitlement(householdId: string, plan: PlanCode, paymentId: string, startsAt: Date, expiresAt: Date): Promise<void>;
  listReviewTransactions(): Promise<PaymentReviewItem[]>;
  findTransaction(transactionId: string): Promise<PaymentTransaction | null>;
  updateTransactionReview(transactionId: string, paymentId: string, status: TransactionStatus): Promise<PaymentTransaction>;
}
