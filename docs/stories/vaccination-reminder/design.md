# Vaccination Reminder Design

## Architecture

Keep vaccination rules in `src/lib/vaccinations`. Route handlers authenticate through the existing session cookie, resolve the active household, and scope every record by household and pet.

## Data Model

Add `VaccinationRecord` with `petId`, `householdId`, `vaccineName`, `givenAt`, `nextDueAt`, `clinicName`, `note`, `createdAt`, and `updatedAt`.

## Status Rule

Status is derived at read time:

- `overdue`: `nextDueAt` is before today.
- `upcoming`: `nextDueAt` is today or within the next 30 days.
- `scheduled`: `nextDueAt` is more than 30 days away.
- `complete`: `nextDueAt` is not set.

## API Contract

- `GET /api/pets/:id/vaccinations`: list records for one household pet.
- `POST /api/pets/:id/vaccinations`: create a record.
- `PATCH /api/vaccinations/:id`: update a record.

## UI

Add `/app/pets/:id/vaccinations` with a compact create/edit form and in-app status badges for upcoming and overdue vaccines.

## Error Handling

Use stable JSON errors. Return 401 for anonymous access, 404 for missing or cross-household pets/records, and 400 for invalid input.
