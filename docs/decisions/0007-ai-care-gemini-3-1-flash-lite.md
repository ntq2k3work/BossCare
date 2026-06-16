# 0007 AI Care Gemini 3.1 Flash-Lite

## Status

Accepted

## Context

The AI Care Guide needed a real model-backed rewrite step after the pet-only scope gate, while staying safe and low-cost. The product already had a deterministic grounded draft answer and affiliate suggestion pipeline, so the model only needed to refine allowed pet-care answers rather than decide safety or scope.

## Decision

Use Gemini 3.1 Flash-Lite as the model-backed rewrite layer for allowed AI Care Guide questions whenever `GEMINI_API_KEY` is configured. Keep the existing deterministic grounded draft as a fallback when the API key is missing or the provider call fails. Preserve the pre-LLM scope gate, emergency refusal path, and medication-dosage refusal path.

## Consequences

- Update setup docs and example env files to use `GEMINI_API_KEY` and `GEMINI_MODEL`.
- Keep local tests deterministic by relying on the grounded fallback when Gemini is unavailable.
- Maintain the current affiliate suggestion and quota accounting pipeline unchanged.
