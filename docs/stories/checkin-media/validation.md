# Check-In Media Validation

## Expected Proof

| Layer | Expected proof |
| --- | --- |
| Unit | Check-in validation, media validation, and storage limit rules. |
| Integration | Check-in create/list route behavior with media metadata. |
| E2E | Browser smoke creates and browses a pet check-in. |
| Platform | Next.js build succeeds with check-in dynamic routes. |
| Release | Harness matrix records proof status and evidence. |

## Evidence

- `npm test`: 10 files passed, 25 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed; check-in API and app routes compiled as dynamic routes.
- `npm run test:e2e`: 1 Chromium browser smoke passed for register, pet, health log, vaccination, check-in media metadata, logout, and login.
