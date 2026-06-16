# AI Care Guide Validation

## Expected Proof

| Layer | Expected proof |
| --- | --- |
| Unit | Scope gate, refusal behavior, emergency no-quota path, Gemini rewrite path, affiliate selection, and quota accounting. |
| Integration | `/api/ai-care-guide` answers authenticated pet-care requests and blocks out-of-scope prompts before generation. |
| E2E | Browser smoke opens the dashboard widget, blocks an out-of-scope prompt, and shows affiliate suggestions for a valid pet question. |
| Platform | Next.js build includes AI Care Guide routes. |

## Evidence

Verified on 2026-06-14 with `npm test`, `npm run lint`, `npm run build`, and `npm run test:e2e -- tests/e2e/auth.spec.ts tests/e2e/ai-care-widget.spec.ts`.
