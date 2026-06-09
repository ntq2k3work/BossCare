# Pet Profile Design

## Architecture

Keep pet profile rules in `src/lib/pets`, with a store interface backed by Prisma for production and the explicit in-memory test store for local proof. API route handlers authenticate first through the existing session cookie and pass the active household id into pet commands and queries.

## Data Model

Add `Pet` with household ownership, profile fields, and `archivedAt`. Keep weight history, media assets, and detailed medical records for later health/check-in stories; this slice stores allergies and medical notes as profile text fields.

## API Contract

- `GET /api/pets`: list active and archived pets for the signed-in household.
- `POST /api/pets`: create a pet, enforcing required fields and active pet limit.
- `GET /api/pets/:id`: read one pet scoped to the signed-in household.
- `PATCH /api/pets/:id`: update editable profile fields.
- `POST /api/pets/:id/archive`: set `archivedAt`.

## UI

Add `/app/pets` for list/create and `/app/pets/:id` for profile edit/archive. Keep the UI compact and operational because this is an app surface, not a landing page.

## Error Handling

Use stable JSON errors. Return 401 for anonymous access, 404 for pets outside the household or missing pets, 409 for active pet limit violations, and 400 for invalid input.
