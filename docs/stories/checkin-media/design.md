# Check-In Media Design

## Architecture

Keep check-in rules in `src/lib/checkins`. API handlers authenticate through the session cookie, resolve the active household, validate the target pet, and create check-in plus optional media metadata atomically.

## Data Model

Add `CheckIn` and `MediaAsset`. This MVP slice stores media metadata only: storage key, MIME type, and byte size. Actual binary upload/provider integration remains out of scope.

## API Contract

- `GET /api/pets/:id/checkins`: list check-ins for one household pet.
- `POST /api/pets/:id/checkins`: create check-in and optional media metadata.

## UI

Add `/dashboard/pets/:id/checkins` with a compact create form and browsable check-in list.

## Error Handling

Return 401 for anonymous access, 404 for missing/cross-household pets, 400 for invalid check-in/media input, and 409 when media storage limit is exceeded.
