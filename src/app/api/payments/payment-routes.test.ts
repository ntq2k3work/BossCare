import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { setAuthStoreForTests } from "@/lib/auth/store";
import { MemoryPaymentStore } from "@/lib/payments/memory-store";
import { setPaymentStoreForTests } from "@/lib/payments/store";
import { POST as register } from "../auth/register/route";
import { GET as getPayment } from "./[id]/route";
import { POST as createPayment } from "./route";
import { POST as reconcilePayments } from "./reconcile/route";
import { POST as sepayWebhook } from "../webhooks/sepay/route";
import { GET as listReviewItems } from "../admin/payments/route";
import { POST as resolveReviewItem } from "../admin/payments/[id]/resolve/route";

function request(path: string, method: string, body?: unknown, cookie?: string, headers?: Record<string, string>) {
  return new NextRequest(`http://localhost${path}`, {
    method,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...(cookie ? { cookie } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function authCookie() {
  const response = await register(
    request("/api/auth/register", "POST", {
      email: "lan@example.com",
      displayName: "Lan Nguyen",
      password: "password123",
      householdName: "Lan household",
    }),
  );
  return response.headers.get("set-cookie")?.split(";")[0] ?? "";
}

beforeEach(() => {
  setAuthStoreForTests(new MemoryAuthStore());
  setPaymentStoreForTests(new MemoryPaymentStore());
});

describe("payment routes", () => {
  it("creates and reads payment orders", async () => {
    const cookie = await authCookie();
    const created = await createPayment(request("/api/payments", "POST", { plan: "plus" }, cookie));
    expect(created.status).toBe(201);
    const payment = await created.json();

    const read = await getPayment(request(`/api/payments/${payment.id}`, "GET", undefined, cookie), {
      params: Promise.resolve({ id: payment.id }),
    });
    await expect(read.json()).resolves.toMatchObject({ id: payment.id, status: "pending" });
  });

  it("processes signed SePay webhook", async () => {
    const cookie = await authCookie();
    const created = await createPayment(request("/api/payments", "POST", { plan: "plus" }, cookie));
    const payment = await created.json();
    const body = {
      providerTransactionId: "txn_route_1",
      bankReference: "ref_route_1",
      transactionDate: "2026-06-09T01:00:00.000Z",
      transferAmountVnd: payment.expectedAmountVnd,
      transferDirection: "in",
      paymentCode: payment.providerOrderCode,
    };
    const raw = JSON.stringify(body);
    const signature = createHmac("sha256", "secret").update(raw).digest("hex");
    const originalSecret = process.env.SEPAY_WEBHOOK_SECRET;
    process.env.SEPAY_WEBHOOK_SECRET = "secret";
    const result = await sepayWebhook(
      new NextRequest("http://localhost/api/webhooks/sepay", {
        method: "POST",
        headers: { "content-type": "application/json", "x-sepay-signature": signature },
        body: raw,
      }),
    );
    process.env.SEPAY_WEBHOOK_SECRET = originalSecret;
    expect(result.status).toBe(200);
    await expect(result.json()).resolves.toMatchObject({ status: "matched" });
  });

  it("reconciles missed transactions and resolves admin reviews", async () => {
    const cookie = await authCookie();
    const created = await createPayment(request("/api/payments", "POST", { plan: "plus" }, cookie));
    const payment = await created.json();
    const reconciled = await reconcilePayments(
      request("/api/payments/reconcile", "POST", {
        transactions: [
          {
            providerTransactionId: "txn_route_review_1",
            bankReference: "ref_route_review_1",
            transactionDate: "2026-06-09T01:00:00.000Z",
            transferAmountVnd: payment.expectedAmountVnd,
            transferDirection: "in",
            transactionContent: "Missing payment code",
          },
        ],
      }, cookie),
    );
    expect(reconciled.status).toBe(200);
    await expect(reconciled.json()).resolves.toMatchObject({ imported: 1, unmatched: 1 });

    const reviews = await listReviewItems(request("/api/admin/payments", "GET", undefined, cookie));
    const [item] = await reviews.json();
    expect(item).toMatchObject({ processingStatus: "unmatched" });

    const resolved = await resolveReviewItem(
      request(`/api/admin/payments/${item.id}/resolve`, "POST", { paymentCode: payment.providerOrderCode }, cookie),
      { params: Promise.resolve({ id: item.id }) },
    );
    expect(resolved.status).toBe(200);
    await expect(resolved.json()).resolves.toMatchObject({ status: "resolved", payment: { status: "paid" } });
  });
});
