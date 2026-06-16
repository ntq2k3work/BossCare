# AI Care Guide Design

## Architecture

Keep the AI guard, response formatting, and affiliate selection in `src/lib/ai-care` and `src/lib/affiliate-links`. The guard must run on both the client widget and the API route before any model or answer generation path. The server remains the source of truth for safety, quota enforcement, and affiliate lookup.

## Data Model

Add an `affiliate_links` table for curated suggestion targets. Use a small default fallback list in code so local/test runs still return useful suggestions when the database table is empty or unavailable.

## API Contract

- `POST /api/ai-care-guide` accepts `question` and locale context.
- Responses include `scope`, `affiliateSuggestions`, `citations`, and quota info.
- Out-of-scope prompts return a refusal-style response without quota consumption.
- Emergency prompts return safety guidance without quota consumption.

## UI

Render a floating launcher in the dashboard shell with the generated puppy image. The widget should show plan context, quick prompts, a pet-only gate, and affiliate cards when the response includes suggestions.

## Error Handling

Use stable JSON errors for invalid input, missing household, and quota exhaustion. Safety blocks that happen before generation should still return a normal AI response envelope so the client can display the refusal without a broken UI state.
