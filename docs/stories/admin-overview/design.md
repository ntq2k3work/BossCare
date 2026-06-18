# Admin Overview Design

## Architecture

Expose core totals through store-level read-only stats methods so the dashboard works with both memory stores and Prisma stores. Combine those methods in `src/lib/admin/stats.ts`, which also owns the MVP admin permission rule: the active household role must be `OWNER`.

## API Contract

`GET /api/admin/overview` returns aggregate counts only. It does not return emails, household names, pet names, or transaction details. Anonymous requests return `401`; non-owner active household contexts return `403`.

## UI

`/admin` is a server-rendered page using `AppShell`, `PageHeader`, `StatCard`, `Badge`, and `ButtonLink`. The page shows core totals and a payment-health panel, then links operators to `/admin/payments` for review actions.

## Error Handling

The server page redirects anonymous users to `/login`. The API route returns stable JSON error bodies for unauthorized and forbidden states.
