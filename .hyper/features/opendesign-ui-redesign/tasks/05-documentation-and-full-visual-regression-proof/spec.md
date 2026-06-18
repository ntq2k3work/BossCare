# Task: 05-documentation-and-full-visual-regression-proof

## Feature: opendesign-ui-redesign

## Dependencies

- **2. redesign-public-home-and-auth-screens** (02-redesign-public-home-and-auth-screens)
- **3. redesign-appshell-and-dashboard-home** (03-redesign-appshell-and-dashboard-home)
- **4. redesign-mvp-core-productadmin-screens** (04-redesign-mvp-core-productadmin-screens)

## Plan Section

### 5. Documentation and full visual regression proof

**Depends on**: 2, 3, 4

**Files:**
- Create: `docs/plans/2026-06-18-opendesign-ui-redesign.md`
- Modify: `docs/TEST_MATRIX.md`
- Modify: `package.json`

**What to do**:
- Step 1: Add `verify:opendesign-ui` script:
  - `npm test && npm run lint && npm run build && npm run test:e2e -- tests/e2e/auth.spec.ts tests/e2e/ai-care-widget.spec.ts tests/e2e/admin-overview.spec.ts --project=chromium`
- Step 2: Create design note documenting:
  - OpenDesign references used;
  - Apple + glass token strategy;
  - screens changed;
  - non-goals.
- Step 3: Update `docs/TEST_MATRIX.md` evidence notes only if a relevant row’s proof changes.
- Step 4: Run full verification:
  - `npm run verify:opendesign-ui`
  - Expected: Vitest pass, ESLint pass, Next build pass, Playwright core UI flows pass.

**Must NOT do**:
- Do not mark visual redesign complete without the full verify script passing.
- Do not commit automatically unless user asks.

**References**:
- `package.json` — existing verify scripts.
- `docs/TEST_MATRIX.md` — validation evidence style.
- `docs/plans/2026-06-09-dashboard-ui-design.md` — existing design note convention.

**Verify**:
- [ ] Run: `npm run verify:opendesign-ui` → pass.

## Task Type

modification

## Context

## execution-decisions

User chose sequential execution for runnable tasks 02 and 03 to reduce shared UI conflicts. Execute order: 02 public/auth screens, then 03 AppShell/dashboard.

---

## discovery

Original request: "https://github.com/nexu-io/open-design.git sử dụng opendesign design lại toàn bộ UI". User confirmed current model request: "dùng cx/gpt-5.5"; current session model is cx/gpt-5.5. Scope clarified: MVP core screens. Style clarified: Mix Apple clean + light glass. Change level clarified: keep existing routes/flows/copy labels where possible, redesign visual style/layout/components. OpenDesign research: cloned https://github.com/nexu-io/open-design.git into /tmp/open-design. Relevant token references: /tmp/open-design/design-systems/apple/tokens.css uses white/pale-gray surfaces, restrained Apple blue accent, SF Pro/Helvetica stack, radius 8/12/18, section rhythm 100/64/40, subtle elevation; /tmp/open-design/design-systems/glassmorphism/tokens.css uses translucent surfaces rgba(255,255,255,.74), airy borders, cyan-blue accent, large radii and soft elevated shadow. BossCare UI map: core pages include src/app/page.tsx, src/app/login/page.tsx, src/app/register/page.tsx, src/components/ui/app-shell.tsx, src/app/dashboard/page.tsx, src/app/dashboard/pets/page.tsx, src/app/dashboard/billing/page.tsx, src/app/admin/page.tsx, src/app/admin/payments/page.tsx. Shared UI components: src/components/ui/pet-ui.tsx, app-shell.tsx, ai-care-widget.tsx, affiliate-suggestions.tsx, language-switcher.tsx. Tests likely affected: tests/e2e/auth.spec.ts, tests/e2e/ai-care-widget.spec.ts, tests/e2e/admin-overview.spec.ts.

## Completed Tasks

- 01-establish-opendesign-tokenized-visual-primitives: Added OpenDesign Apple + light glass CSS tokens in globals and restyled shared primitives in pet-ui.tsx while preserving component APIs. Verification passed: npm run lint, npm run build, npm run test:e2e -- tests/e2e/auth.spec.ts --project=chromium.
- 02-redesign-public-home-and-auth-screens: Redesigned public home and rethemed auth screens with OpenDesign Apple + light glass visuals while preserving auth labels, OTP flow, and route behavior. Verification passed: npm run lint, npm run build, npm run test:e2e -- tests/e2e/auth.spec.ts --project=chromium.
- 03-redesign-appshell-and-dashboard-home: Restyled AppShell, dashboard home, and AI widget toward OpenDesign Apple + light glass surfaces while preserving nav hrefs, active keys, headings, and AI widget test ids. Verification passed: npm run lint, npm run build, npm run test:e2e -- tests/e2e/auth.spec.ts tests/e2e/ai-care-widget.spec.ts --project=chromium.
- 04-redesign-mvp-core-productadmin-screens: Restyled MVP core pets, billing, payment detail, admin overview, and admin payment review screens with the OpenDesign token system while preserving flows and test-visible labels. Verification passed: npm run lint, npm run build, npm run test:e2e -- tests/e2e/auth.spec.ts tests/e2e/admin-overview.spec.ts --project=chromium.
