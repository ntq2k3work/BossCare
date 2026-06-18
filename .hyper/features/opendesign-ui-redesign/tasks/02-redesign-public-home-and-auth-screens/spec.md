# Task: 02-redesign-public-home-and-auth-screens

## Feature: opendesign-ui-redesign

## Dependencies

- **1. establish-opendesign-tokenized-visual-primitives** (01-establish-opendesign-tokenized-visual-primitives)

## Plan Section

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
