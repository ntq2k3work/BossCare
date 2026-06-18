# Task: 04-update-storydocs-and-full-verification

## Feature: admin-overview-dashboard

## Dependencies

- **3. build-admin-overview-page** (03-build-admin-overview-page)

## Plan Section

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

## Task Type

modification

## Context

## discovery

Original request: "Bo sung man admin". Clarification: user selected "Dashboard tổng quan". Data source: user selected "Live từ stores hiện có". Metrics scope: user selected "Core totals" = user, household, pet, payment total, paid revenue, open reviews. Research findings: existing admin payment page at src/app/admin/payments/page.tsx uses getCurrentAuthContext(), redirects /login if missing, listPaymentReviewItems(context, getPaymentStore()), AppShell, PageHeader, Card, Badge. listPaymentReviewItems requires activeHousehold role OWNER in src/lib/payments/service.ts. AuthStore currently has user/session/member methods only, no global stats. PetStore has household-scoped list/count only. PaymentStore has payment/review transaction methods only, no stats. Prisma stores can query global models; memory stores keep private maps and need explicit stats methods for tests/memory mode. UI components StatCard, Card, PageHeader, Badge, ButtonLink exist in src/components/ui/pet-ui.tsx. AppShell nav has no admin link yet.

## Completed Tasks

- 01-add-store-level-admin-stats-contracts-and-tests: Implemented store-level admin stats contracts across auth, pets, and payments. Added memory and Prisma implementations and covered core totals with src/lib/admin/admin-stats.test.ts. Verification passed: npm test -- src/lib/admin/admin-stats.test.ts.
- 02-add-admin-stats-service-and-api-route: Added admin overview stats service with owner-only guard, stable error body, and combined core totals. Added GET /api/admin/overview and route coverage for anonymous, non-owner, and owner success. Verification passed: npm test -- src/app/api/admin/overview/admin-overview-route.test.ts.
- 03-build-admin-overview-page: Built /admin server dashboard with AppShell, core total stat cards, payment health panel, admin nav entry, i18n copy, and Playwright smoke coverage. Verification passed: npm test admin stats/routes, npm run lint, npm run build, npm run test:e2e -- tests/e2e/admin-overview.spec.ts --project=chromium.
