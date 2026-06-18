# Task: 03-build-admin-overview-page

## Feature: admin-overview-dashboard

## Dependencies

- **2. add-admin-stats-service-and-api-route** (02-add-admin-stats-service-and-api-route)

## Plan Section

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

## Task Type

modification

## Context

## discovery

Original request: "Bo sung man admin". Clarification: user selected "Dashboard tổng quan". Data source: user selected "Live từ stores hiện có". Metrics scope: user selected "Core totals" = user, household, pet, payment total, paid revenue, open reviews. Research findings: existing admin payment page at src/app/admin/payments/page.tsx uses getCurrentAuthContext(), redirects /login if missing, listPaymentReviewItems(context, getPaymentStore()), AppShell, PageHeader, Card, Badge. listPaymentReviewItems requires activeHousehold role OWNER in src/lib/payments/service.ts. AuthStore currently has user/session/member methods only, no global stats. PetStore has household-scoped list/count only. PaymentStore has payment/review transaction methods only, no stats. Prisma stores can query global models; memory stores keep private maps and need explicit stats methods for tests/memory mode. UI components StatCard, Card, PageHeader, Badge, ButtonLink exist in src/components/ui/pet-ui.tsx. AppShell nav has no admin link yet.

## Completed Tasks

- 01-add-store-level-admin-stats-contracts-and-tests: Implemented store-level admin stats contracts across auth, pets, and payments. Added memory and Prisma implementations and covered core totals with src/lib/admin/admin-stats.test.ts. Verification passed: npm test -- src/lib/admin/admin-stats.test.ts.
- 02-add-admin-stats-service-and-api-route: Added admin overview stats service with owner-only guard, stable error body, and combined core totals. Added GET /api/admin/overview and route coverage for anonymous, non-owner, and owner success. Verification passed: npm test -- src/app/api/admin/overview/admin-overview-route.test.ts.
