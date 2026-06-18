# Task: 01-add-store-level-admin-stats-contracts-and-tests

## Feature: admin-overview-dashboard

## Dependencies

_None_

## Plan Section

### 1. Add store-level admin stats contracts and tests

**Depends on**: none

**Files:**
- Modify: `src/lib/auth/types.ts`
- Modify: `src/lib/auth/memory-store.ts`
- Modify: `src/lib/auth/prisma-store.ts`
- Modify: `src/lib/pets/types.ts`
- Modify: `src/lib/pets/memory-store.ts`
- Modify: `src/lib/pets/prisma-store.ts`
- Modify: `src/lib/payments/types.ts`
- Modify: `src/lib/payments/memory-store.ts`
- Modify: `src/lib/payments/prisma-store.ts`
- Test: `src/lib/admin/admin-stats.test.ts`

**What to do**:
- Step 1: Create a failing unit test that seeds memory auth, pet, and payment stores and expects core totals:
  - users: 2
  - households: 2
  - pets: total 2, active 1
  - payments: total 2, paid 1, pending 1, paidRevenueVnd equals the paid amount
  - openReviews: 1
- Step 2: Run: `npm test -- src/lib/admin/admin-stats.test.ts`
  - Expected before implementation: FAIL because stats helpers/methods do not exist.
- Step 3: Extend store interfaces with small read-only stats methods:
  - `AuthStore.getAdminAuthStats(): Promise<{ users: number; households: number; members: number }>`
  - `PetStore.getAdminPetStats(): Promise<{ totalPets: number; activePets: number; archivedPets: number }>`
  - `PaymentStore.getAdminPaymentStats(): Promise<{ totalPayments: number; paidPayments: number; pendingPayments: number; reviewRequiredPayments: number; paidRevenueVnd: number; openReviews: number }>`
- Step 4: Implement memory versions by counting existing maps.
- Step 5: Implement Prisma versions using count/aggregate queries.
- Step 6: Run: `npm test -- src/lib/admin/admin-stats.test.ts`
  - Expected: PASS.

**Must NOT do**:
- Do not expose private maps directly.
- Do not add write operations or new database models.
- Do not count archived pets as active.

**References**:
- `src/lib/auth/types.ts:36-46` — AuthStore contract to extend.
- `src/lib/pets/types.ts:28-35` — PetStore contract to extend.
- `src/lib/payments/types.ts:51-68` — PaymentStore contract to extend.
- `src/lib/payments/memory-store.ts:13-15` — Existing payment maps for stats.

**Verify**:
- [ ] Run: `npm test -- src/lib/admin/admin-stats.test.ts` → PASS.

## Task Type

modification

## Context

## discovery

Original request: "Bo sung man admin". Clarification: user selected "Dashboard tổng quan". Data source: user selected "Live từ stores hiện có". Metrics scope: user selected "Core totals" = user, household, pet, payment total, paid revenue, open reviews. Research findings: existing admin payment page at src/app/admin/payments/page.tsx uses getCurrentAuthContext(), redirects /login if missing, listPaymentReviewItems(context, getPaymentStore()), AppShell, PageHeader, Card, Badge. listPaymentReviewItems requires activeHousehold role OWNER in src/lib/payments/service.ts. AuthStore currently has user/session/member methods only, no global stats. PetStore has household-scoped list/count only. PaymentStore has payment/review transaction methods only, no stats. Prisma stores can query global models; memory stores keep private maps and need explicit stats methods for tests/memory mode. UI components StatCard, Card, PageHeader, Badge, ButtonLink exist in src/components/ui/pet-ui.tsx. AppShell nav has no admin link yet.
