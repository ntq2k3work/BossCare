import type { PlanCode } from "@/lib/entitlements/plans";

export const PAID_PLAN_PRICES: Record<Exclude<PlanCode, "free">, number> = {
  plus: 99000,
  family: 199000,
};

export function paidPlanAmount(plan: PlanCode) {
  if (plan === "free") return null;
  return PAID_PLAN_PRICES[plan];
}
