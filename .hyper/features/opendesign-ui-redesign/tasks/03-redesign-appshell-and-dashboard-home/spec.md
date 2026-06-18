# Task: 03-redesign-appshell-and-dashboard-home

## Feature: opendesign-ui-redesign

## Dependencies

- **1. establish-opendesign-tokenized-visual-primitives** (01-establish-opendesign-tokenized-visual-primitives)

## Plan Section

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
