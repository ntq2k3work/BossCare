# Health Log Design

## Architecture

Keep health-log commands and queries in `src/lib/health-logs`. Route handlers authenticate through the existing session cookie, resolve the active household, and scope every query by both pet and household.

## Data Model

Add `HealthLog` with `petId`, `householdId`, `type`, `occurredAt`, `title`, `note`, `metadataJson`, and `createdByUserId`. Media attachments remain out of this slice because `checkin-media` owns storage/media behavior.

## API Contract

- `GET /api/pets/:id/health-logs?type=...`: list logs for one household pet, optionally filtered by type.
- `POST /api/pets/:id/health-logs`: create a dated log.
- `PATCH /api/health-logs/:id`: update editable log fields.
- `DELETE /api/health-logs/:id`: delete one household log.

## UI

Add `/dashboard/pets/:id/health` with compact log creation, type filtering, chronological browsing, edit, and delete controls.

## Error Handling

Use stable JSON errors. Return 401 for anonymous access, 404 for missing or cross-household pets/logs, and 400 for invalid log input.
