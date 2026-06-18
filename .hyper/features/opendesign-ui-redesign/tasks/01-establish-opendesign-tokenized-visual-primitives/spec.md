# Task: 01-establish-opendesign-tokenized-visual-primitives

## Feature: opendesign-ui-redesign

## Dependencies

_None_

## Plan Section

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

## Task Type

modification

## Context

## discovery

Original request: "https://github.com/nexu-io/open-design.git sử dụng opendesign design lại toàn bộ UI". User confirmed current model request: "dùng cx/gpt-5.5"; current session model is cx/gpt-5.5. Scope clarified: MVP core screens. Style clarified: Mix Apple clean + light glass. Change level clarified: keep existing routes/flows/copy labels where possible, redesign visual style/layout/components. OpenDesign research: cloned https://github.com/nexu-io/open-design.git into /tmp/open-design. Relevant token references: /tmp/open-design/design-systems/apple/tokens.css uses white/pale-gray surfaces, restrained Apple blue accent, SF Pro/Helvetica stack, radius 8/12/18, section rhythm 100/64/40, subtle elevation; /tmp/open-design/design-systems/glassmorphism/tokens.css uses translucent surfaces rgba(255,255,255,.74), airy borders, cyan-blue accent, large radii and soft elevated shadow. BossCare UI map: core pages include src/app/page.tsx, src/app/login/page.tsx, src/app/register/page.tsx, src/components/ui/app-shell.tsx, src/app/dashboard/page.tsx, src/app/dashboard/pets/page.tsx, src/app/dashboard/billing/page.tsx, src/app/admin/page.tsx, src/app/admin/payments/page.tsx. Shared UI components: src/components/ui/pet-ui.tsx, app-shell.tsx, ai-care-widget.tsx, affiliate-suggestions.tsx, language-switcher.tsx. Tests likely affected: tests/e2e/auth.spec.ts, tests/e2e/ai-care-widget.spec.ts, tests/e2e/admin-overview.spec.ts.
