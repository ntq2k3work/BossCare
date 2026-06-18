# Task: 02-add-admin-stats-service-and-api-route

## Feature: admin-overview-dashboard

## Dependencies

- **1. add-store-level-admin-stats-contracts-and-tests** (01-add-store-level-admin-stats-contracts-and-tests)

## Plan Section

### 2. Add admin stats service and API route

**Depends on**: 1

**Files:**
- Create: `src/lib/admin/stats.ts`
- Create: `src/app/api/admin/overview/route.ts`
- Test: `src/app/api/admin/overview/admin-overview-route.test.ts`

**What to do**:
- Step 1: Write failing route tests:
  - anonymous request returns 401 JSON error.
  - signed-in non-owner context returns 403 or stable forbidden JSON.
  - owner context returns combined stats from auth, pet, and payment stores.
- Step 2: Run: `npm test -- src/app/api/admin/overview/admin-overview-route.test.ts`
  - Expected before implementation: FAIL because route does not exist.
- Step 3: Implement `requireAdminOwner(context)` in `src/lib/admin/stats.ts` matching existing owner-only MVP rule.
- Step 4: Implement `getAdminOverviewStats({ authStore, petStore, paymentStore })` that combines the three store stats and returns a stable object:
  ```ts
  type AdminOverviewStats = {
    users: number;
    households: number;
    members: number;
    pets: { total: number; active: number; archived: number };
    payments: { total: number; paid: number; pending: number; reviewRequired: number; paidRevenueVnd: number; openReviews: number };
  };
  ```
- Step 5: Implement `GET /api/admin/overview` using `getCurrentAuthContext`, `getAuthStore`, `getPetStore`, and `getPaymentStore`.
- Step 6: Run route test.
  - Expected: PASS.

**Must NOT do**:
- Do not make the route public.
- Do not introduce a separate admin role system in this task.
- Do not include emails, names, or other PII in overview stats.

**References**:
- `src/app/api/admin/payments/route.ts` — Existing admin API route pattern.
- `src/lib/payments/service.ts:164-169` — Owner-only MVP permission rule.
- `src/lib/auth/current.ts:1-11` — Current auth context lookup.

**Verify**:
- [ ] Run: `npm test -- src/app/api/admin/overview/admin-overview-route.test.ts` → PASS.

## Context

## discovery

Original request: "Bo sung man admin". Clarification: user selected "Dashboard tổng quan". Data source: user selected "Live từ stores hiện có". Metrics scope: user selected "Core totals" = user, household, pet, payment total, paid revenue, open reviews. Research findings: existing admin payment page at src/app/admin/payments/page.tsx uses getCurrentAuthContext(), redirects /login if missing, listPaymentReviewItems(context, getPaymentStore()), AppShell, PageHeader, Card, Badge. listPaymentReviewItems requires activeHousehold role OWNER in src/lib/payments/service.ts. AuthStore currently has user/session/member methods only, no global stats. PetStore has household-scoped list/count only. PaymentStore has payment/review transaction methods only, no stats. Prisma stores can query global models; memory stores keep private maps and need explicit stats methods for tests/memory mode. UI components StatCard, Card, PageHeader, Badge, ButtonLink exist in src/components/ui/pet-ui.tsx. AppShell nav has no admin link yet.

## Completed Tasks

- 01-add-store-level-admin-stats-contracts-and-tests: Implemented store-level admin stats contracts across auth, pets, and payments. Added memory and Prisma implementations and covered core totals with src/lib/admin/admin-stats.test.ts. Verification passed: npm test -- src/lib/admin/admin-stats.test.ts.
