# AI Care Guide Exec Plan

## Steps

1. Extend Prisma schema with `affiliate_links` and regenerate the client.
2. Add the shared pet-only guard and response catalog for localized answers.
3. Add affiliate suggestion lookup with database-backed rows plus a default fallback.
4. Wire the API route, dashboard page, and floating widget to the shared guard and response envelope.
5. Add unit, route, and browser coverage for out-of-scope blocking, emergency handling, and affiliate suggestions.
6. Run lint, test, build, and browser smoke, then update the story matrix evidence.

## Rollback

Revert the guard, widget, affiliate service, schema, and response envelope changes together so the previous AI Care Guide behavior returns intact.

## Open Risk

The response envelope now exposes `scope` and `affiliateSuggestions`, so downstream UI and tests must stay in sync with the server shape.
