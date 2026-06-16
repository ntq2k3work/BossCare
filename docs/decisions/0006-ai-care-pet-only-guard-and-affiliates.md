# 0006 AI Care Pet-Only Guard And Affiliates

Date: 2026-06-14

## Status

Accepted

## Context

The AI Care Guide needed to stay locked to pet-related questions only, reject out-of-scope prompts before any generation path, and surface curated affiliate suggestions when the question matches a pet-care topic. The implementation also needed to work in test and memory modes even when the affiliate table is empty or the database is unavailable.

## Decision

Use a shared pet-care scope guard on both the client widget and the API route. Treat out-of-scope prompts as refused AI responses instead of raw errors so the UI can explain the boundary cleanly. Store curated affiliate targets in an `affiliate_links` table, but fall back to a baked-in default list when the table is empty, missing, or unavailable in local/test execution.

## Alternatives Considered

1. Let the server reject off-topic prompts only after the client submits them.
2. Store affiliate targets only in code with no database table.
3. Throw raw errors for out-of-scope prompts instead of returning a refusal-style response envelope.

## Consequences

Positive:

- The user gets a strict pet-only boundary before any expensive generation path.
- The dashboard widget and API share the same safety logic.
- Affiliate suggestions can evolve in the database without losing local/test behavior.

Tradeoffs:

- Response envelopes now include `scope` and `affiliateSuggestions`, so UI and tests must stay in sync.
- The default fallback list can diverge from production affiliate content if the table is not populated.

## Follow-Up

- Keep the test matrix updated for the widget flow and out-of-scope blocking.
- Populate the affiliate table with real curated targets before relying on live production suggestions.
