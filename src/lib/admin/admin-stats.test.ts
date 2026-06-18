import { describe, expect, it } from "vitest";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { registerUser } from "@/lib/auth/service";
import { MemoryPetStore } from "@/lib/pets/memory-store";
import { MemoryPaymentStore } from "@/lib/payments/memory-store";
import { createPaymentOrder, processSepayWebhook } from "@/lib/payments/service";

describe("admin stats store contracts", () => {
  it("returns core totals from memory stores", async () => {
    const authStore = new MemoryAuthStore();
    const petStore = new MemoryPetStore();
    const paymentStore = new MemoryPaymentStore();
    const now = new Date("2026-06-18T00:00:00.000Z");

    const lan = await registerUser(authStore, {
      email: "lan@example.com",
      displayName: "Lan Nguyen",
      password: "password123",
      householdName: "Lan household",
    });
    await registerUser(authStore, {
      email: "minh@example.com",
      displayName: "Minh Tran",
      password: "password123",
      householdName: "Minh household",
    });

    const householdId = lan.context.activeHousehold?.id;
    expect(householdId).toBeTruthy();
    const activePet = await petStore.createPet(householdId!, { name: "Milo", species: "dog" });
    await petStore.createPet(householdId!, { name: "Miu", species: "cat" });
    await petStore.archivePet(householdId!, activePet.id, now);

    const paidPayment = await createPaymentOrder(lan.context, paymentStore, { plan: "plus" }, now);
    await processSepayWebhook(paymentStore, {
      providerTransactionId: "txn_paid",
      bankReference: "ref_paid",
      transactionDate: "2026-06-18T01:00:00.000Z",
      transferAmountVnd: paidPayment.expectedAmountVnd,
      transferDirection: "in",
      paymentCode: paidPayment.providerOrderCode,
    }, now);
    await createPaymentOrder(lan.context, paymentStore, { plan: "family" }, now);
    await processSepayWebhook(paymentStore, {
      providerTransactionId: "txn_review",
      bankReference: "ref_review",
      transactionDate: "2026-06-18T02:00:00.000Z",
      transferAmountVnd: 199000,
      transferDirection: "in",
      transactionContent: "Missing payment code",
    }, now);

    await expect(authStore.getAdminAuthStats()).resolves.toEqual({ users: 2, households: 2, members: 2 });
    await expect(petStore.getAdminPetStats()).resolves.toEqual({ totalPets: 2, activePets: 1, archivedPets: 1 });
    await expect(paymentStore.getAdminPaymentStats()).resolves.toEqual({
      totalPayments: 2,
      paidPayments: 1,
      pendingPayments: 1,
      reviewRequiredPayments: 0,
      paidRevenueVnd: 99000,
      openReviews: 1,
    });
  });
});
