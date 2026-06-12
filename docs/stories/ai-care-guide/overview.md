# AI Care Guide

## Status

implemented

## Lane

high-risk

## Product Contract

Signed-in households can ask an educational AI Care Guide within their monthly quota. Emergency warnings are available without quota consumption, and medication-dosage questions are refused with veterinarian guidance.

## Relevant Product Docs

- `SPEC.md#6.7-ai-care-guide`
- `SPEC.md#7-pricing-and-ai-cost-guardrails`
- `SPEC.md#9-ai-knowledge-sources`

## Acceptance Criteria

- General care questions return educational guidance with trusted source ids.
- Emergency questions return urgent veterinary guidance and do not consume quota.
- Medication dosage questions are refused.
- Monthly quota is enforced for non-emergency requests.
- Browser smoke covers general and emergency questions.
