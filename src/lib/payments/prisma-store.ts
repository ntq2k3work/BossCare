import { PLAN_LIMITS, type PlanCode } from "@/lib/entitlements/plans";
import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import type { PaymentOrder, PaymentReviewItem, PaymentStore, PaymentTransaction, SepayTransactionInput, TransactionStatus } from "./types";

function toPayment(payment: {
  id: string;
  householdId: string;
  plan: { code: string };
  provider: string;
  providerOrderCode: string;
  expectedAmountVnd: number;
  paidAmountVnd: number | null;
  status: string;
  expiresAt: Date;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): PaymentOrder {
  return {
    id: payment.id,
    householdId: payment.householdId,
    plan: payment.plan.code as PlanCode,
    provider: "sepay",
    providerOrderCode: payment.providerOrderCode,
    expectedAmountVnd: payment.expectedAmountVnd,
    paidAmountVnd: payment.paidAmountVnd,
    status: payment.status as PaymentOrder["status"],
    expiresAt: payment.expiresAt.toISOString(),
    paidAt: payment.paidAt?.toISOString() ?? null,
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString(),
  };
}

function toTransaction(transaction: {
  id: string;
  paymentId: string | null;
  provider: string;
  providerTransactionId: string;
  bankReference: string | null;
  bankBrandName: string | null;
  accountNumber: string | null;
  transactionDate: Date;
  transferAmountVnd: number;
  transferDirection: string;
  paymentCode: string | null;
  transactionContent: string | null;
  rawPayloadJson: unknown;
  processingStatus: string;
  createdAt: Date;
}): PaymentTransaction {
  return {
    id: transaction.id,
    paymentId: transaction.paymentId,
    provider: "sepay",
    providerTransactionId: transaction.providerTransactionId,
    bankReference: transaction.bankReference,
    bankBrandName: transaction.bankBrandName,
    accountNumber: transaction.accountNumber,
    transactionDate: transaction.transactionDate.toISOString(),
    transferAmountVnd: transaction.transferAmountVnd,
    transferDirection: transaction.transferDirection as "in" | "out",
    paymentCode: transaction.paymentCode,
    transactionContent: transaction.transactionContent,
    rawPayload: transaction.rawPayloadJson as Record<string, unknown>,
    processingStatus: transaction.processingStatus as TransactionStatus,
    createdAt: transaction.createdAt.toISOString(),
  };
}

export class PrismaPaymentStore implements PaymentStore {
  private async ensurePlan(plan: PlanCode) {
    const limits = PLAN_LIMITS[plan];
    return getPrisma().subscriptionPlan.upsert({
      where: { code: plan },
      create: {
        code: plan,
        name: plan[0].toUpperCase() + plan.slice(1),
        priceVnd: plan === "free" ? 0 : plan === "plus" ? 99000 : 199000,
        durationDays: 30,
        petLimit: limits.petLimit,
        memberLimit: limits.memberLimit,
        mediaLimitMb: limits.mediaLimitMb,
        aiSessionQuota: limits.aiSessionsPerMonth,
      },
      update: {},
    });
  }

  async createPayment(householdId: string, plan: PlanCode, amountVnd: number, code: string, expiresAt: Date) {
    const planRow = await this.ensurePlan(plan);
    const payment = await getPrisma().payment.create({
      data: {
        householdId,
        planId: planRow.id,
        provider: "sepay",
        providerOrderCode: code,
        expectedAmountVnd: amountVnd,
        status: "pending",
        expiresAt,
      },
      include: { plan: true },
    });
    return toPayment(payment);
  }

  async findPayment(householdId: string, paymentId: string) {
    const payment = await getPrisma().payment.findFirst({
      where: { id: paymentId, householdId },
      include: { plan: true },
    });
    return payment ? toPayment(payment) : null;
  }

  async findPaymentByCode(code: string) {
    const payment = await getPrisma().payment.findUnique({
      where: { providerOrderCode: code },
      include: { plan: true },
    });
    return payment ? toPayment(payment) : null;
  }

  async transactionExists(providerTransactionId: string, bankReference?: string | null) {
    const existing = await getPrisma().paymentTransaction.findFirst({
      where: {
        OR: [
          { provider: "sepay", providerTransactionId },
          ...(bankReference ? [{ bankReference }] : []),
        ],
      },
    });
    return Boolean(existing);
  }

  async saveTransaction(input: SepayTransactionInput, paymentId: string | null, status: TransactionStatus) {
    const transaction = await getPrisma().paymentTransaction.create({
      data: {
        paymentId,
        provider: "sepay",
        providerTransactionId: input.providerTransactionId,
        bankReference: input.bankReference ?? null,
        bankBrandName: input.bankBrandName ?? null,
        accountNumber: input.accountNumber ?? null,
        transactionDate: new Date(input.transactionDate),
        transferAmountVnd: input.transferAmountVnd,
        transferDirection: input.transferDirection,
        paymentCode: input.paymentCode ?? null,
        transactionContent: input.transactionContent ?? null,
        rawPayloadJson: input.rawPayload as Prisma.InputJsonValue,
        processingStatus: status,
      },
    });
    return {
      ...toTransaction(transaction),
      rawPayload: input.rawPayload,
    };
  }

  async markPaid(paymentId: string, amountVnd: number, paidAt: Date) {
    const payment = await getPrisma().payment.update({
      where: { id: paymentId },
      data: { status: "paid", paidAmountVnd: amountVnd, paidAt },
      include: { plan: true },
    });
    return toPayment(payment);
  }

  async markReviewRequired(paymentId: string) {
    const payment = await getPrisma().payment.update({
      where: { id: paymentId },
      data: { status: "review_required" },
      include: { plan: true },
    });
    return toPayment(payment);
  }

  async activateEntitlement(householdId: string, plan: PlanCode, paymentId: string, startsAt: Date, expiresAt: Date) {
    const planRow = await this.ensurePlan(plan);
    await getPrisma().userEntitlement.create({
      data: {
        householdId,
        planId: planRow.id,
        startsAt,
        expiresAt,
        status: "active",
        sourcePaymentId: paymentId,
      },
    });
  }

  async listReviewTransactions() {
    const transactions = await getPrisma().paymentTransaction.findMany({
      where: {
        processingStatus: { in: ["unmatched", "review_required"] },
      },
      include: {
        payment: { include: { plan: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return transactions.map((transaction): PaymentReviewItem => {
      const item = toTransaction(transaction);
      return {
        ...item,
        mismatchReason: mismatchReason(item),
        payment: transaction.payment ? toPayment(transaction.payment) : null,
      };
    });
  }

  async findTransaction(transactionId: string) {
    const transaction = await getPrisma().paymentTransaction.findUnique({ where: { id: transactionId } });
    return transaction ? toTransaction(transaction) : null;
  }

  async updateTransactionReview(transactionId: string, paymentId: string, status: TransactionStatus) {
    const transaction = await getPrisma().paymentTransaction.update({
      where: { id: transactionId },
      data: { paymentId, processingStatus: status },
    });
    return toTransaction(transaction);
  }
}

function mismatchReason(transaction: PaymentTransaction) {
  if (!transaction.paymentId) return "missing_payment_code";
  if (transaction.transferDirection !== "in") return "non_inbound_transfer";
  return "amount_or_payable_mismatch";
}
