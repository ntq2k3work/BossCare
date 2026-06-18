import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { setAuthStoreForTests } from "@/lib/auth/store";
import { MemoryPetStore } from "@/lib/pets/memory-store";
import { setPetStoreForTests } from "@/lib/pets/store";
import { MemoryPaymentStore } from "@/lib/payments/memory-store";
import { setPaymentStoreForTests } from "@/lib/payments/store";
import { registerUser } from "@/lib/auth/service";
import { createPaymentOrder, processSepayWebhook } from "@/lib/payments/service";
import { POST as register } from "../../auth/register/route";
import { GET as getAdminOverview } from "./route";

function request(path: string, method: string, body?: unknown, cookie?: string) {
  return new NextRequest(`http://localhost${path}`, {
    method,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...(cookie ? { cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function authCookie(input = {
  email: "lan@example.com",
  displayName: "Lan Nguyen",
  password: "password123",
  householdName: "Lan household",
}) {
  const response = await register(request("/api/auth/register", "POST", input));
  return response.headers.get("set-cookie")?.split(";")[0] ?? "";
}

let authStore: MemoryAuthStore;
let petStore: MemoryPetStore;
let paymentStore: MemoryPaymentStore;

beforeEach(() => {
  authStore = new MemoryAuthStore();
  petStore = new MemoryPetStore();
  paymentStore = new MemoryPaymentStore();
  setAuthStoreForTests(authStore);
  setPetStoreForTests(petStore);
  setPaymentStoreForTests(paymentStore);
});

describe("admin overview route", () => {
  it("returns 401 for anonymous requests", async () => {
    const response = await getAdminOverview(request("/api/admin/overview", "GET"));
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ error: { code: "unauthorized" } });
  });

  it("returns 403 for non-owner active household members", async () => {
    setAuthStoreForTests({
      ...authStore,
      findContextBySession: async () => ({
        user: { id: "member_1", email: "member@example.com", displayName: "Member" },
        households: [{ id: "household_1", name: "Shared household", role: "MEMBER" as const }],
        activeHousehold: { id: "household_1", name: "Shared household", role: "MEMBER" as const },
        entitlements: { plan: "free", petLimit: 1, memberLimit: 1, mediaLimitMb: 50, aiSessionsPerMonth: 5 },
      }),
    });

    const response = await getAdminOverview(request("/api/admin/overview", "GET", undefined, "ph_session=member-token"));
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ error: { code: "forbidden" } });
  });

  it("returns core totals for owner requests", async () => {
    const cookie = await authCookie();
    const ownerContext = (await authStore.findContextBySession(
      // The route owns token hashing, so use register-created cookie for auth and service context from store below.
      "unused",
      new Date(),
    ));
    const owner = await registerUser(authStore, {
      email: "minh@example.com",
      displayName: "Minh Tran",
      password: "password123",
      householdName: "Minh household",
    });
    const householdId = owner.context.activeHousehold!.id;
    const archived = await petStore.createPet(householdId, { name: "Milo", species: "dog" });
    await petStore.createPet(householdId, { name: "Miu", species: "cat" });
    await petStore.archivePet(householdId, archived.id, new Date("2026-06-18T00:00:00.000Z"));
    const payment = await createPaymentOrder(owner.context, paymentStore, { plan: "plus" }, new Date("2026-06-18T00:00:00.000Z"));
    await processSepayWebhook(paymentStore, {
      providerTransactionId: "txn_admin_paid",
      bankReference: "ref_admin_paid",
      transactionDate: "2026-06-18T01:00:00.000Z",
      transferAmountVnd: payment.expectedAmountVnd,
      transferDirection: "in",
      paymentCode: payment.providerOrderCode,
    }, new Date("2026-06-18T00:00:00.000Z"));

    const response = await getAdminOverview(request("/api/admin/overview", "GET", undefined, cookie));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      users: 2,
      households: 2,
      members: 2,
      pets: { total: 2, active: 1, archived: 1 },
      payments: { total: 1, paid: 1, pending: 0, reviewRequired: 0, paidRevenueVnd: 99000, openReviews: 0 },
    });
    expect(ownerContext).toBeNull();
  });
});
