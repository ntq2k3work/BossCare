import { describe, expect, it } from "vitest";
import { PLAN_LIMITS, freeEntitlements } from "./plans";

describe("entitlement plans", () => {
  it("defines increasing limits across plans", () => {
    expect(freeEntitlements()).toEqual(PLAN_LIMITS.free);
    expect(PLAN_LIMITS.plus.petLimit).toBeGreaterThan(PLAN_LIMITS.free.petLimit);
    expect(PLAN_LIMITS.family.memberLimit).toBeGreaterThan(PLAN_LIMITS.plus.memberLimit);
    expect(PLAN_LIMITS.family.aiSessionsPerMonth).toBeGreaterThan(PLAN_LIMITS.plus.aiSessionsPerMonth);
  });
});
