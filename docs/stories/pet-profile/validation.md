# Pet Profile Validation

## Expected Proof

| Layer | Expected proof |
| --- | --- |
| Unit | Pet validation and active pet limit rules. |
| Integration | Pet CRUD/archive route behavior with household scoping. |
| E2E | Browser smoke creates, edits, views, and archives a pet. |
| Platform | Next.js build succeeds with pet dynamic routes. |
| Release | Harness matrix records proof status and evidence. |

## Evidence

- `npm test`: 4 files passed, 11 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed; pet API and app routes compiled as dynamic routes.
- `npm run test:e2e`: 1 Chromium browser smoke passed for register, pet create/edit/archive, logout, and login.
