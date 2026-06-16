# Auth Account Design

## Architecture

Use Next.js App Router for UI routes and route handlers for MVP API speed. Keep auth domain logic in `src/lib/auth` and database access behind a lazy Prisma client in `src/lib/db` so build-time module evaluation does not require live environment values.

## Data Model

Use Prisma models for `User`, `Household`, `HouseholdMember`, and `Session`. Store password hashes on `User` for the MVP email/password path. Store opaque session tokens hashed in the database and set the raw token in an HTTP-only cookie.

## API Contract

- `POST /api/auth/register`: validate email/password/display name, reject duplicate email, create user/default household/owner membership/session.
- `POST /api/auth/login`: validate credentials, create session.
- `POST /api/auth/logout`: delete current session and clear cookie.
- `GET /api/me`: return current user, memberships, active household, and starter entitlement limits.

## UI

Provide `/register`, `/login`, and `/dashboard` screens. The app page is server-rendered and redirects anonymous users to `/login`.

## Error Handling

Return stable JSON errors with `error.code` and `error.message`. Avoid leaking whether a login failure was email or password specific.
