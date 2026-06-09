# Household Access Validation

## Expected Proof

| Layer | Expected proof |
| --- | --- |
| Unit | Owner/member role checks and duplicate invite behavior. |
| Integration | Household member list and invite API behavior. |
| E2E | Browser smoke shows household members page. |
| Platform | Next.js build succeeds with household route. |
| Release | Harness matrix records proof status and evidence. |

## Evidence

- `npm test`: 12 files passed, 29 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed; household API and app route compiled as dynamic routes.
- `npm run test:e2e`: 1 Chromium browser smoke passed through household member view.
