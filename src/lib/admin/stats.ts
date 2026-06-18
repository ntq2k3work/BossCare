import type { AuthContext, AuthStore } from "@/lib/auth/types";
import type { PetStore } from "@/lib/pets/types";
import type { PaymentStore } from "@/lib/payments/types";

export type AdminOverviewStats = {
  users: number;
  households: number;
  members: number;
  pets: {
    total: number;
    active: number;
    archived: number;
  };
  payments: {
    total: number;
    paid: number;
    pending: number;
    reviewRequired: number;
    paidRevenueVnd: number;
    openReviews: number;
  };
};

export class AdminStatsError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export function requireAdminOwner(context: AuthContext) {
  if (context.activeHousehold?.role !== "OWNER") {
    throw new AdminStatsError("forbidden", "Only household owners can view admin overview in this MVP.", 403);
  }
}

export function adminStatsErrorBody(error: unknown) {
  if (error instanceof AdminStatsError) {
    return { status: error.status, body: { error: { code: error.code, message: error.message } } };
  }
  throw error;
}

export async function getAdminOverviewStats(
  context: AuthContext,
  stores: { authStore: AuthStore; petStore: PetStore; paymentStore: PaymentStore },
): Promise<AdminOverviewStats> {
  requireAdminOwner(context);

  const [auth, pets, payments] = await Promise.all([
    stores.authStore.getAdminAuthStats(),
    stores.petStore.getAdminPetStats(),
    stores.paymentStore.getAdminPaymentStats(),
  ]);

  return {
    users: auth.users,
    households: auth.households,
    members: auth.members,
    pets: {
      total: pets.totalPets,
      active: pets.activePets,
      archived: pets.archivedPets,
    },
    payments: {
      total: payments.totalPayments,
      paid: payments.paidPayments,
      pending: payments.pendingPayments,
      reviewRequired: payments.reviewRequiredPayments,
      paidRevenueVnd: payments.paidRevenueVnd,
      openReviews: payments.openReviews,
    },
  };
}
