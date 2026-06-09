# Auth Account Exec Plan

## Steps

1. Scaffold Next.js App Router application in the repository root.
2. Add Prisma schema and database/session/auth helpers.
3. Implement auth route handlers.
4. Implement register, login, and app pages.
5. Add unit and integration tests for validation, auth flow, and `/api/me`.
6. Run validation commands and update Harness durable proof.

## Rollback

Revert app scaffold and story packet changes. No production data migration exists in this first implementation slice.

## Open Risk

PostgreSQL is the target database, but automated local validation may use Prisma's generated client and mocked persistence if no local database URL is available.
