# Vaccination Reminder

## Status

implemented

## Lane

high-risk

## Product Contract

Signed-in users can record pet vaccinations and see in-app upcoming or overdue vaccine reminders.

## Relevant Product Docs

- `SPEC.md#6.5-vaccination-records-and-reminders`
- `SPEC.md#6.3-pet-profiles`
- `SPEC.md#11.1-core-tables`
- `SPEC.md#12-api-routes`
- `SPEC.md#13-ui-routes`

## Acceptance Criteria

- User can add vaccine name, given date, next due date, clinic, and note.
- User can edit vaccination records.
- User can view vaccination records for a household pet.
- User can see upcoming and overdue vaccine status.
- Reminder view works in-app without email, push, or background jobs.
- Anonymous users cannot access vaccination APIs or pages.
- Cross-household pet access returns not found.

## Harness Delta

This story adds the first reminder-oriented care record without adding background notification infrastructure.
