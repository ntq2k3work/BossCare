# OpenDesign UI Redesign

## Scope

Redesign BossCare MVP core screens using OpenDesign as the visual reference while keeping existing routes, flows, copy, and accessible labels stable.

## OpenDesign References

- `/tmp/open-design/design-systems/apple/tokens.css`: base language for pale surfaces, restrained accent, radius tiers, subtle elevation, and generous spacing.
- `/tmp/open-design/design-systems/glassmorphism/tokens.css`: light glass accents for panels, floating AI widget, and premium dashboard surfaces.

## Design Direction

BossCare now uses an Apple-clean base with light glass surfaces:

- pale gray app background and pure white content canvas;
- single restrained blue/cyan accent;
- larger rounded panels and pill controls;
- translucent shell/sidebar/header surfaces;
- no new third-party UI or motion dependencies;
- no backend or product-flow changes.

## Screens Touched

- Public home: `src/app/page.tsx`
- Auth: `src/app/login/page.tsx`, `src/app/register/page.tsx`
- Shared primitives: `src/components/ui/pet-ui.tsx`
- Shell and widget: `src/components/ui/app-shell.tsx`, `src/components/ui/ai-care-widget.tsx`
- Dashboard: `src/app/dashboard/page.tsx`
- Core product/admin surfaces: pets, billing, payment detail, admin overview, admin payment review.

## Non-Goals

- No API, auth, payment, Prisma, or store behavior changes.
- No dark mode.
- No new icon/animation libraries.
- No full deep-page redesign beyond MVP core screens.

## Verification

Use:

```bash
npm run verify:opendesign-ui
```

This runs Vitest, ESLint, Next.js build, and Playwright coverage for auth, AI widget, and admin overview flows.
