# Dashboard UI Design

Date: 2026-06-09

## Decision

Implement approach A: match the provided authenticated dashboard image as a real `/dashboard` UI surface, backed by the user's current household data.

## Scope

- Refresh the app shell with a fixed left navigation, top search, notification badge, and avatar.
- Redesign `/dashboard` with pet cards, current plan, upcoming reminders, quick stats, AI Care Guide prompt, important reminders, and recent activity.
- Keep business logic, auth, data model, API routes, and billing behavior unchanged.

## Data Wiring

- Pet cards, upcoming reminders, quick stats, current plan, and recent activity are read from the existing pet, vaccination, health log, check-in, entitlement, and media records.
- Empty states are shown for new accounts with no pets, reminders, or activity.
