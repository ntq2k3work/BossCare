# AI Care Guide

## Status

implemented

## Lane

high-risk

## Product Contract

Signed-in households can ask an educational AI Care Guide only for pet-related topics such as health, food, clothing, clinics, spa, grooming, training, and accessories. A client/server scope gate blocks out-of-scope prompts before any model call, allowed questions are rewritten with Gemini 3.1 Flash-Lite when configured, emergency warnings are available without quota consumption, medication-dosage questions are refused with veterinarian guidance, and matching affiliate suggestions can be attached when relevant.

## Relevant Product Docs

- `SPEC.md#6.7-ai-care-guide`
- `SPEC.md#7-pricing-and-ai-cost-guardrails`
- `SPEC.md#10-ai-response-contract`
- `SPEC.md#11-data-model`

## Acceptance Criteria

- General pet-care questions return educational guidance with trusted source ids and localized copy.
- Out-of-scope prompts are blocked before generation and do not consume quota.
- Emergency questions return urgent veterinary guidance and do not consume quota.
- Medication dosage questions are refused with vet guidance.
- Matching affiliate suggestions are attached for relevant topics.
- Monthly quota is enforced for non-emergency pet-care requests.
- Browser smoke covers the dashboard widget, out-of-scope blocking, and a relevant affiliate suggestion flow.
