# OpenDesign UI Redesign

## Discovery

### Original Request
- "https://github.com/nexu-io/open-design.git sử dụng opendesign design lại toàn bộ UI"

### Interview Summary
- Model preference: user said "dùng cx/gpt-5.5"; this session is using `cx/gpt-5.5`.
- Scope: MVP core screens.
- Visual direction: OpenDesign `Apple clean` base with light `glassmorphism` accents.
- Change level: keep existing routes, flows, core copy, form labels, and test-visible text where possible; redesign visual system/components/layout.

### Research Findings
- `/tmp/open-design/design-systems/apple/tokens.css`: Apple system uses pure white and pale gray surfaces, restrained blue accent, SF Pro/Helvetica fallback stack, radius tiers `8/12/18`, subtle elevation, generous section rhythm. Good base for pet-care SaaS because it is readable and low-risk.
- `/tmp/open-design/design-systems/glassmorphism/tokens.css`: Glass system uses translucent surfaces, airy white borders, cyan-blue accent, larger radii, and soft blue shadow. Use sparingly for hero panels, floating AI widget, and premium dashboard surfaces.
- `src/app/page.tsx`: public home screen is small and can be redesigned as the visual entry point without touching data flows.
- `src/app/login/page.tsx`, `src/app/register/page.tsx`: auth forms have test-visible labels and OTP flow; keep labels/controls stable.
- `src/components/ui/pet-ui.tsx`: central UI primitives (`Card`, `Panel`, `Badge`, `Button`, `ButtonLink`, `PageHeader`, `StatCard`) are the safest place to establish OpenDesign tokens/classes.
- `src/components/ui/app-shell.tsx`: dashboard/admin shell controls navigation, side rail, top bar, account area, and AI widget placement.
- `src/app/dashboard/page.tsx`: largest core screen; contains inline dashboard layout and uses shared UI primitives.
- `src/app/dashboard/pets/page.tsx`, `src/app/dashboard/billing/page.tsx`, `src/app/admin/page.tsx`, `src/app/admin/payments/page.tsx`: core MVP surfaces to align after primitives/shell are updated.
- `tests/e2e/auth.spec.ts`, `tests/e2e/ai-care-widget.spec.ts`, `tests/e2e/admin-overview.spec.ts`: verification must preserve headings, form labels, and user flows.

---

## Non-Goals

- Do not change backend behavior, API contracts, auth/payment/pet data flows, Prisma schema, or store logic.
- Do not add new third-party animation/icon libraries unless package.json already contains them. Current redesign should use Tailwind/CSS only.
- Do not redesign every deep pet detail subpage in this batch; focus on MVP core screens.
- Do not change form labels used by E2E tests unless tests are intentionally updated for equivalent accessible labels.
- Do not introduce dark mode, charts, or heavy continuous animations.
- Do not keep OpenDesign repo inside this project; it is a reference only.

---

## Ghost Diffs

- Rejected full app rewrite: user chose MVP core screens.
- Rejected dark Perplexity style: user chose Apple + glass, and pet-care needs a friendly light UI.
- Rejected heavy glassmorphism: use glass as accent, not every surface, to avoid generic/slow UI.
- Rejected copy rewrite: user chose keep flow and visual redesign.

---

## Tasks

### 1. Establish OpenDesign tokenized visual primitives

**Depends on**: none

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/ui/pet-ui.tsx`
- Test: `tests/e2e/auth.spec.ts`

**What to do**:
- Step 1: Add OpenDesign-inspired CSS variables to `src/app/globals.css` under `:root`:
  - Apple base: `--bc-bg`, `--bc-surface`, `--bc-surface-soft`, `--bc-ink`, `--bc-muted`, `--bc-border`, `--bc-accent`, `--bc-accent-hover`.
  - Glass accent: `--bc-glass`, `--bc-glass-border`, `--bc-glass-shadow`.
  - Motion/radius: `--bc-radius-sm`, `--bc-radius-md`, `--bc-radius-lg`, `--bc-ease`, `--bc-motion`.
- Step 2: Refactor `Card`, `Panel`, `Badge`, `Button`, `ButtonLink`, `PageHeader`, `StatCard`, `EmptyState` in `pet-ui.tsx` to use the new tokens/classes.
- Step 3: Keep existing exports and props unchanged.
- Step 4: Remove heavy purple/violet default styling as the primary brand; use restrained Apple blue/cyan as single accent.
- Step 5: Run: `npm run lint`
  - Expected: no ESLint errors.
- Step 6: Run: `npm run test:e2e -- tests/e2e/auth.spec.ts --project=chromium`
  - Expected: register/login/payment flow still works.

**Must NOT do**:
- Do not rename exported UI components.
- Do not add emoji or icon dependencies.
- Do not break accessible button/link semantics.

**References**:
- `/tmp/open-design/design-systems/apple/tokens.css` — base surface/type/radius/elevation direction.
- `/tmp/open-design/design-systems/glassmorphism/tokens.css` — glass accent values.
- `src/components/ui/pet-ui.tsx` — shared primitive layer.

**Verify**:
- [ ] Run: `npm run lint` → exit 0.
- [ ] Run: `npm run test:e2e -- tests/e2e/auth.spec.ts --project=chromium` → pass.

### 2. Redesign public home and auth screens

**Depends on**: 1

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/register/page.tsx`
- Test: `tests/e2e/auth.spec.ts`

**What to do**:
- Step 1: Redesign `src/app/page.tsx` as an asymmetric Apple-clean hero:
  - left content with BossCare proposition and CTAs;
  - right glass panel showing product-preview cards for pet profile, reminders, AI guide;
  - no centered generic hero.
- Step 2: Redesign login/register pages with split layout:
  - form in clean white/glass panel;
  - side panel with calm pet-care product proof points;
  - preserve labels: Email, Display name, Household name, Password, Confirm password, OTP.
- Step 3: Keep submit button text needed by tests: Send OTP, Verify and create account, Sign in.
- Step 4: Run: `npm run test:e2e -- tests/e2e/auth.spec.ts --project=chromium`
  - Expected: pass.

**Must NOT do**:
- Do not change auth route behavior.
- Do not remove Dev OTP visibility used by tests.
- Do not use pure black, neon gradients, or generic three-card rows.

**References**:
- `src/app/page.tsx` — current home entry point.
- `src/app/login/page.tsx` — login form labels and flow.
- `src/app/register/page.tsx` — OTP flow and labels.
- `tests/e2e/auth.spec.ts` — protected expected text/labels.

**Verify**:
- [ ] Run: `npm run test:e2e -- tests/e2e/auth.spec.ts --project=chromium` → pass.

### 3. Redesign AppShell and dashboard home

**Depends on**: 1

**Files:**
- Modify: `src/components/ui/app-shell.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/components/ui/ai-care-widget.tsx`
- Test: `tests/e2e/auth.spec.ts`
- Test: `tests/e2e/ai-care-widget.spec.ts`

**What to do**:
- Step 1: Redesign `AppShell` into an Apple/glass app frame:
  - matte pale-gray background;
  - translucent side rail/top bar;
  - compact navigation with clear active state;
  - preserve all route links and `activeKey` support.
- Step 2: Redesign dashboard home with asymmetric sections:
  - prominent welcome/product status area;
  - pet overview horizontal/offset cards;
  - plan status and reminders as glass panels;
  - preserve headings used by tests, especially `Hi, {name}!`.
- Step 3: Restyle AI Care widget as light glass floating surface while preserving test ids.
- Step 4: Run: `npm run test:e2e -- tests/e2e/auth.spec.ts tests/e2e/ai-care-widget.spec.ts --project=chromium`
  - Expected: pass.

**Must NOT do**:
- Do not remove `data-testid` values in AI widget.
- Do not alter navigation hrefs.
- Do not use `h-screen`; use `min-h-[100dvh]` if full-height is needed.

**References**:
- `src/components/ui/app-shell.tsx` — global authenticated shell.
- `src/app/dashboard/page.tsx` — main dashboard composition.
- `src/components/ui/ai-care-widget.tsx` — floating widget tests depend on test ids.
- `tests/e2e/ai-care-widget.spec.ts` — widget behavior expectations.

**Verify**:
- [ ] Run: `npm run test:e2e -- tests/e2e/auth.spec.ts tests/e2e/ai-care-widget.spec.ts --project=chromium` → pass.

### 4. Redesign MVP core product/admin screens

**Depends on**: 1, 3

**Files:**
- Modify: `src/app/dashboard/pets/page.tsx`
- Modify: `src/app/dashboard/billing/page.tsx`
- Modify: `src/app/dashboard/billing/[id]/page.tsx`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/payments/page.tsx`
- Modify: `src/app/admin/payments/payment-review-controls.tsx`
- Test: `tests/e2e/auth.spec.ts`
- Test: `tests/e2e/admin-overview.spec.ts`

**What to do**:
- Step 1: Redesign pets list into premium care-record workspace:
  - keep heading `Pets` and route `/dashboard/pets`.
  - use asymmetric list/detail preview composition instead of equal card grid.
- Step 2: Redesign billing and payment detail pages:
  - keep plan choice and payment-code flows.
  - make payment instructions a clean command/payment panel.
- Step 3: Redesign `/admin` and `/admin/payments`:
  - align with same Apple/glass stat system.
  - preserve `Admin overview`, `Admin payment review`, `Payment code`, `Resolve`, and empty-state text expected by tests.
- Step 4: Run: `npm run test:e2e -- tests/e2e/auth.spec.ts tests/e2e/admin-overview.spec.ts --project=chromium`
  - Expected: pass.

**Must NOT do**:
- Do not change payment review API calls or form behavior.
- Do not remove payment code display patterns matched by tests (`PH-`).
- Do not redesign deep pet detail pages in this batch unless a shared primitive change naturally affects them.

**References**:
- `src/app/dashboard/pets/page.tsx` — pets core MVP screen.
- `src/app/dashboard/billing/page.tsx` and `[id]/page.tsx` — billing/payment flow.
- `src/app/admin/page.tsx` and `src/app/admin/payments/page.tsx` — admin core screens.
- `tests/e2e/auth.spec.ts` — payment/admin flow expectations.

**Verify**:
- [ ] Run: `npm run test:e2e -- tests/e2e/auth.spec.ts tests/e2e/admin-overview.spec.ts --project=chromium` → pass.

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
