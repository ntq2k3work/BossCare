export type PlanCode = "free" | "plus" | "family";

export type EntitlementLimits = {
  plan: PlanCode;
  petLimit: number;
  memberLimit: number;
  mediaLimitMb: number;
  aiSessionsPerMonth: number;
};

export const PLAN_LIMITS: Record<PlanCode, EntitlementLimits> = {
  free: {
    plan: "free",
    petLimit: 1,
    memberLimit: 1,
    mediaLimitMb: 10,
    aiSessionsPerMonth: 5,
  },
  plus: {
    plan: "plus",
    petLimit: 5,
    memberLimit: 1,
    mediaLimitMb: 250,
    aiSessionsPerMonth: 50,
  },
  family: {
    plan: "family",
    petLimit: 10,
    memberLimit: 5,
    mediaLimitMb: 1000,
    aiSessionsPerMonth: 150,
  },
};

export function freeEntitlements() {
  return PLAN_LIMITS.free;
}
