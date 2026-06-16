# Auth Account Validation

## Expected Proof

| Layer | Expected proof |
| --- | --- |
| Unit | Auth input validation and password/session helpers. |
| Integration | Register, login, logout, and `/api/me` route behavior. |
| E2E | Browser smoke for register, login, app view, and logout. |
| Platform | Next.js build succeeds with lazy database initialization. |
| Release | Harness matrix records proof status and evidence. |

## Evidence

- `npm test`: 2 files passed, 6 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed; `/api/auth/login`, `/api/auth/logout`, `/api/auth/register`, `/api/me`, and `/dashboard` compiled as dynamic routes.
- `npm run test:e2e`: 1 Chromium browser smoke passed for register, app context, logout, and login.
