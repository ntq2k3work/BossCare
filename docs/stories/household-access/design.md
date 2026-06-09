# Household Access Design

## Architecture

Extend the existing auth store because household membership is already part of session context. Add member listing and existing-user invite operations.

## API Contract

- `GET /api/household/members`: list members of the signed-in active household.
- `POST /api/household/members`: owner invites an existing user by email.

## UI

Add `/app/household` with member list and invite form. The form is only useful for owners; API enforces the role.

## Error Handling

Return 401 for anonymous access, 403 for non-owner invite attempts, 404 when invited email has no account, and 409 when user is already a member.
