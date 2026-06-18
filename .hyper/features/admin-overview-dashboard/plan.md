# Admin Overview Dashboard

## Discovery

### Original Request
- "Bo sung man admin"

### Interview Summary
- Admin surface: Dashboard tổng quan.
- Data source: Live từ stores hiện có.
- Metrics scope: Core totals — user total, household total, pet total, payment total, paid revenue, open payment reviews.

### Research Findings
- `src/app/admin/payments/page.tsx:12-18`: Existing admin page gets auth context, redirects anonymous users to `/login`, loads review items through `listPaymentReviewItems(context, getPaymentStore())`.
- `src/lib/payments/service.ts:105-128`: Admin payment review operations call `requireOwner(context)`.
- `src/lib/payments/service.ts:164-169`: Current MVP admin permission is active household `OWNER`.
- `src/lib/auth/types.ts:36-46`: `AuthStore` has account/session/member methods only; no global admin stats method.
- `src/lib/auth/memory-store.ts:17-21`: Memory auth store holds users, households, members, sessions in maps, suitable for stats if exposed through an explicit method.
- `src/lib/auth/prisma-store.ts:1-141`: Prisma auth store can count `user`, `household`, and `householdMember` globally through Prisma.
- `src/lib/pets/types.ts:28-35`: `PetStore` has household-scoped pet methods only; no global count method.
- `src/lib/pets/memory-store.ts:14-16`: Memory pet store holds all pets in a map, suitable for global stats if exposed.
- `src/lib/pets/prisma-store.ts:53-107`: Prisma pet store can count total and active pets globally through Prisma.
- `src/lib/payments/types.ts:51-68`: `PaymentStore` has payment and review methods only; no total/revenue stats.
- `src/lib/payments/memory-store.ts:13-15`: Memory payment store holds payments and transactions in maps, suitable for global stats if exposed.
- `src/lib/payments/prisma-store.ts:1-231`: Prisma payment store can aggregate payment count, paid revenue, pending count, review count through Prisma.
- `src/components/ui/pet-ui.tsx:110-128`: Existing `PageHeader` and `StatCard` match dashboard summary UI.
- `src/components/ui/app-shell.tsx:10-21`: Current sidebar nav has dashboard and billing links but no admin overview link.

---

## Non-Goals

- Do not build user management, pet management, payment filters, charts, CSV export, role model, or super-admin permissions.
- Do not add direct frontend mutation actions to the overview dashboard.
- Do not replace the existing `/admin/payments` review flow.
- Do not add AI/care-record metrics in this task.
- Do not run `npm audit fix` or dependency upgrades.

---

## Ghost Diffs

- Rejected static mock dashboard: user requested live data.
- Rejected Prisma-only stats service: user requested live stores; store-level methods keep memory-mode tests working.
- Rejected all-metrics dashboard: user chose Core totals only.

---

## Tasks

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

### 3. Build `/admin` overview page

**Depends on**: 2

**Files:**
- Create: `src/app/admin/page.tsx`
- Modify: `src/components/ui/app-shell.tsx`
- Modify: `src/lib/i18n.ts`
- Test: existing E2E or new `tests/e2e/admin-overview.spec.ts`

**What to do**:
- Step 1: Write failing E2E smoke that signs in, opens `/admin`, and expects:
  - page title for admin overview
  - stat labels for users, households, pets, payments, revenue, open reviews
  - link to `/admin/payments`
- Step 2: Run: `npm run test:e2e -- tests/e2e/admin-overview.spec.ts --project=chromium`
  - Expected before implementation: FAIL because `/admin` does not exist.
- Step 3: Create `src/app/admin/page.tsx` as a server page:
  - redirect anonymous to `/login`.
  - require owner using admin stats service.
  - render `AppShell` with `activeKey="admin"`.
  - render `PageHeader`, `StatCard`s, and a `ButtonLink` to `/admin/payments`.
- Step 4: Add admin nav key/link to `AppShell` so owner users can reach `/admin`.
- Step 5: Add Vietnamese/English copy in `src/lib/i18n.ts` for admin overview title, description, labels, and actions.
- Step 6: Run E2E smoke.
  - Expected: PASS.

**Must NOT do**:
- Do not add client-side fetching for stats unless server page cannot access stores.
- Do not expose admin nav to anonymous users; AppShell already renders only after auth in admin pages.
- Do not add charts or tables.

**References**:
- `src/app/admin/payments/page.tsx:12-37` — Existing admin page structure.
- `src/components/ui/pet-ui.tsx:110-143` — PageHeader, StatCard, and reusable UI.
- `src/components/ui/app-shell.tsx:10-21` — Nav keys to extend.

**Verify**:
- [ ] Run: `npm run test:e2e -- tests/e2e/admin-overview.spec.ts --project=chromium` → PASS.

### 4. Update story/docs and full verification

**Depends on**: 3

**Files:**
- Create: `docs/stories/admin-overview/overview.md`
- Create: `docs/stories/admin-overview/design.md`
- Create: `docs/stories/admin-overview/validation.md`
- Create: `docs/stories/admin-overview/execplan.md`
- Modify: `docs/stories/backlog.md`
- Modify: `docs/TEST_MATRIX.md`
- Modify: `package.json`

**What to do**:
- Step 1: Add `verify:admin-overview` script:
  - `npm test && npm run lint && npm run build && npm run test:e2e -- tests/e2e/admin-overview.spec.ts --project=chromium`
- Step 2: Create story packet documenting scope and evidence.
- Step 3: Add matrix row with status `implemented` only after verification passes.
- Step 4: Run: `npm run verify:admin-overview`
  - Expected: Vitest PASS, ESLint PASS, Next build PASS, Playwright admin overview PASS.

**Must NOT do**:
- Do not mark implemented before verification passes.
- Do not remove existing story rows.

**References**:
- `docs/stories/admin-payment-review/overview.md` — Existing admin story format.
- `docs/TEST_MATRIX.md` — Matrix format and evidence rules.
- `package.json` — Existing verify script style.

**Verify**:
- [ ] Run: `npm run verify:admin-overview` → PASS.
