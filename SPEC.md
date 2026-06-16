# BossCare MVP Specification

Last updated: 2026-06-14

## 1. Product Goal

BossCare is a cost-conscious pet care web/web-app for Vietnamese households. The MVP supports both a browser web surface and authenticated web-app workflows that help owners keep reliable pet records, track health events, remember vaccinations, preserve daily moments, and ask a guarded AI care guide for non-emergency guidance.

The product must feel useful before payment. A free user can create a basic account, maintain core pet records, and receive emergency warnings. Paid plans expand household capacity, media storage, and AI session quota.

## 2. MVP Principles

- Build a web/web-app product that works well on desktop and mobile browsers.
- Keep user workflows browser-based: public web pages, authentication pages, private `/dashboard` screens, admin screens, and server API/webhook routes.
- Keep operating cost low enough for affordable Vietnamese pricing.
- Prefer simple, auditable workflows over automation that is hard to support.
- Do not hide emergency safety guidance behind payment.
- Treat AI as a guide, not a veterinarian.
- Use SePay for MVP payment confirmation through bank-transfer/VietQR webhook events.
- Avoid subscription auto-renewal in MVP.

## 3. Target Users

### 3.1. Primary User

An individual pet owner who wants one place to store pet profile data, health notes, vaccines, reminders, photos, and basic care guidance.

### 3.2. Secondary User

A household or family that shares pet responsibilities across multiple people.

### 3.3. Admin User

The product operator who reviews payments, resolves payment matching issues, monitors AI cost, and maintains trusted knowledge sources.

## 4. Final MVP Stack

- Product surfaces: public web, authenticated web app, admin web screens, API routes, webhook routes, and scheduled reconciliation jobs.
- Frontend: Next.js App Router.
- Backend: Next.js route handlers or server actions for MVP speed.
- Database: PostgreSQL.
- Auth: email/password or magic-link auth through the app stack.
- Storage: object storage for media assets.
- AI: low-cost RAG-backed guide with strict token budgets.
- Payments: SePay bank transaction webhooks plus reconciliation polling.

## 5. Explicit Non-Goals

- No native iOS or Android app in MVP.
- No separate desktop app, mobile shell, or native deep-link workflow in MVP.
- No live web search by default for AI answers.
- No diagnosis, prescription, or emergency triage replacement.
- No automatic recurring billing in MVP.
- No marketplace, veterinarian booking, pharmacy, or insurance workflow.
- No complex social feed.
- No Clerk requirement in the cost-optimized MVP.

## 6. MVP Feature Scope

### 6.1. Authentication And Account

Users can register, sign in, sign out, and manage a basic profile.

Acceptance criteria:

- User can create an account with a unique email.
- User can sign in and sign out reliably.
- User can view current plan and entitlement limits.
- User cannot access another household's private pet data.

### 6.2. Household

A household groups pets, members, plan entitlements, and shared records.

Acceptance criteria:

- Each user belongs to at least one household.
- Family plan users can invite household members.
- Non-family plans can keep household support minimal but data model still uses households.
- Role checks prevent non-members from reading or modifying household data.

### 6.3. Pet Profiles

Users can create and maintain pet profiles.

Fields:

- Name.
- Species.
- Breed.
- Sex.
- Birthdate or estimated age.
- Weight history.
- Allergies.
- Medical notes.
- Avatar.

Acceptance criteria:

- User can create, edit, archive, and view pets.
- Plan limits control maximum active pets.
- Archived pets remain readable but do not count as active pets.
- Required fields are validated before save.

### 6.4. Health Logs

Users can record health events such as weight, symptoms, medication notes, appetite, stool, behavior, and vet visits.

Acceptance criteria:

- User can add a dated health log for a pet.
- User can filter logs by pet and type.
- User can attach notes and optional media.
- User can edit or delete own household logs.
- Logs are preserved in chronological order.

### 6.5. Vaccination Records And Reminders

Users can record vaccinations and expected next due dates.

Acceptance criteria:

- User can add vaccine name, date given, next due date, clinic, and note.
- User can see upcoming and overdue vaccines.
- Reminder view works without a background notification system.
- MVP may use in-app reminders before email or push reminders.

### 6.6. Check-Ins And Moments

Users can store quick pet moments and optional photos.

Acceptance criteria:

- User can create a short check-in with date, mood, note, and optional media.
- User can browse check-ins by pet.
- Media upload respects plan storage limits.
- Failed uploads do not create broken records.

### 6.7. AI Care Guide

UI module name: Care Guide.

The AI guide answers pet-related care questions using trusted knowledge chunks and app context. It must not present itself as a veterinarian and must block out-of-scope prompts before any model or answer generation path. When configured, allowed answers may be rewritten with Gemini 3.1 Flash-Lite, but the grounded draft, safety gate, and refusal paths remain authoritative.

Supported intents:

- Quick care questions.
- Food safety questions.
- Symptom information.
- Vet visit preparation.
- Clothing, spa, grooming, training, and accessory questions.

Acceptance criteria:

- User can ask one pet-related question inside an AI session.
- Out-of-scope prompts are blocked before generation and do not consume quota.
- System retrieves trusted knowledge chunks before answering.
- Response includes a short answer, reasoning, safety warning when relevant, suggested next action, and affiliate suggestions when relevant.
- Emergency warnings are shown even when the user has no paid AI quota.
- AI refuses diagnosis, prescription, dosage decisions, and emergency replacement.
- AI sessions are counted against the user's plan quota unless the answer is emergency-only safety guidance.

### 6.8. Payments And Entitlements

Users can upgrade by bank transfer through SePay-powered payment confirmation.

Acceptance criteria:

- User can select a plan and receive exact payment instructions.
- System generates a unique payment code for each order.
- User pays through bank transfer or VietQR-compatible banking app.
- SePay webhook confirms inbound bank transaction events.
- System verifies webhook authenticity before changing any payment state.
- System matches transaction by payment code and expected amount.
- Paid entitlement activates only after a verified match.
- Duplicate webhook deliveries are idempotent.
- Reconciliation job can recover missed webhook events from SePay transaction APIs.
- Admin can manually review unmatched or overpaid/underpaid transactions.

## 7. Pricing And AI Cost Guardrails

### 7.1. Plans

Free:

- Limited pets.
- Limited media.
- Small AI trial quota.
- Emergency safety guidance always available.

Plus:

- More pets.
- More media.
- Larger monthly AI session quota.

Family:

- Household members.
- More pets.
- More media.
- Largest monthly AI session quota.

### 7.2. AI Session Definition

An AI session is a single user topic with a bounded number of turns.

Create a new session when:

- User changes topic.
- User asks about a different pet.
- User starts a new health concern.
- Previous session expires.

Do not process one message as multiple paid sessions. If the user mixes topics, ask them to split the question.

### 7.3. Token Budget

Each plan has monthly AI session quota and per-session token limits.

AI cost target:

- AI cost must remain no more than 20% of collected plan revenue under normal usage assumptions.
- Retrieval should return only the smallest useful set of chunks.
- Prompts must be compact and deterministic.
- Long chat history should be summarized or omitted.

## 8. Payment Specification: SePay

### 8.1. Why SePay

SePay fits the MVP because it supports automated bank transaction webhooks for Vietnamese bank transfers and can confirm inbound transfers without building direct bank integrations. It also supports webhook authentication options, delivery retries, delivery logs, manual replay, and transaction APIs for reconciliation.

Primary documentation checked on 2026-06-08:

- SePay Webhooks overview: `https://developer.sepay.vn/en/sepay-webhooks`
- SePay Webhooks quick start: `https://developer.sepay.vn/en/sepay-webhooks/bat-dau-nhanh`
- SePay OAuth Webhooks API: `https://developer.sepay.vn/en/sepay-oauth2/api-webhook`
- SePay transaction API: `https://docs.sepay.vn/api-giao-dich.html`

### 8.2. Payment Flow

1. User chooses a plan inside the authenticated web app.
2. Web app creates a pending payment order through a server route.
3. Web app generates a unique payment code, for example `PH-20260608-AB12CD`.
4. Web app displays payment amount, bank account, transfer content, and VietQR if configured.
5. User pays from their banking app.
6. Bank receives the transfer.
7. SePay sends a webhook to the web app's public payment endpoint.
8. Server route verifies webhook authentication.
9. Server route stores the raw event.
10. Server route matches transaction by payment code, amount, direction, and bank reference.
11. Server route marks payment as paid.
12. Server route grants or extends entitlement.
13. Authenticated web app shows upgraded plan status to the user.

### 8.3. Webhook Endpoint

Endpoint:

- `POST /api/webhooks/sepay`

Required behavior:

- Accept only HTTPS in production.
- Verify HMAC-SHA256 signature when HMAC auth is configured.
- Reject invalid signatures before parsing business state.
- Return HTTP 200 only after event is safely stored or recognized as duplicate.
- Return non-2xx for malformed, unauthenticated, or temporarily unprocessable events.
- Keep handler fast; defer slow work to a background task if needed.

Expected SePay event fields include transaction id, gateway or bank brand, transaction date, account number, transaction content, transfer type or direction, transfer amount, reference code or reference number, and payment code when SePay extracts it.

### 8.4. Matching Rules

A transaction can activate an entitlement only when all required checks pass:

- Direction is inbound.
- Amount equals expected amount.
- Payment code appears in SePay `code` field or transaction content.
- Payment order is still payable.
- Transaction id or reference number has not already been consumed.
- Bank account is one of the configured receiving accounts.

Mismatch handling:

- Underpayment: keep order pending, create admin review item.
- Overpayment: mark payment as review required, do not automatically grant extra entitlement.
- Missing code: store unmatched transaction and show admin review.
- Duplicate event: return success without applying entitlement twice.
- Expired order with exact payment: create admin review item.

### 8.5. Reconciliation

Webhook delivery is primary. Polling is backup.

Reconciliation job:

- Runs on a schedule.
- Calls SePay transaction list API for recent transactions or transactions after last known id.
- Imports missing inbound transactions.
- Applies the same matching rules as webhook processing.
- Produces an admin-visible report for unmatched transactions.

### 8.6. Security Requirements

- Store SePay webhook secret in environment variables.
- Rotate webhook secret without downtime.
- Verify timestamp freshness when using HMAC timestamp headers.
- Persist raw webhook payload, normalized transaction, and processing result.
- Make payment processing idempotent by SePay transaction id and bank reference number.
- Never trust client-provided payment status.
- Never grant entitlement from a frontend callback alone.

## 9. AI Knowledge Sources

The knowledge base should use reputable, stable sources and cite internal source records.

Preferred source categories:

- Veterinary association public guidance.
- Poison and food safety references.
- Vaccination schedule guidance.
- Local Vietnamese clinic guidance reviewed manually.
- Product-owned emergency warning copy.

Source ingestion requirements:

- Store source title, URL, publisher, last reviewed date, language, and trust category.
- Chunk content into small, retrievable units.
- Keep emergency warning copy as controlled internal content.
- Mark stale sources for review.

## 10. AI Response Contract

Each AI answer should follow this shape:

- Short answer.
- Why it matters.
- What to watch.
- What to do next.
- When to contact a vet.
- Sources or source categories when available.
- Affiliate suggestions when they match the pet-care topic.

Hard safety rules:

- Do not diagnose.
- Do not prescribe.
- Do not provide drug dosages.
- Do not delay emergency care.
- Do not answer non-pet questions.
- For severe symptoms, advise immediate veterinary care.

Emergency examples:

- Difficulty breathing.
- Seizure.
- Collapse.
- Severe bleeding.
- Suspected poisoning.
- Repeated vomiting with weakness.
- Bloated abdomen.
- Heatstroke signs.

## 11. Data Model

### 11.1. Core Tables

`users`

- id.
- email.
- display_name.
- created_at.
- updated_at.

`households`

- id.
- name.
- owner_user_id.
- created_at.
- updated_at.

`household_members`

- id.
- household_id.
- user_id.
- role.
- created_at.

`pets`

- id.
- household_id.
- name.
- species.
- breed.
- sex.
- birthdate.
- estimated_age.
- avatar_asset_id.
- archived_at.
- created_at.
- updated_at.

`health_logs`

- id.
- pet_id.
- household_id.
- type.
- occurred_at.
- title.
- note.
- metadata_json.
- created_by_user_id.
- created_at.
- updated_at.

`vaccination_records`

- id.
- pet_id.
- household_id.
- vaccine_name.
- given_at.
- next_due_at.
- clinic_name.
- note.
- created_at.
- updated_at.

`checkins`

- id.
- pet_id.
- household_id.
- occurred_at.
- mood.
- note.
- created_by_user_id.
- created_at.
- updated_at.

`media_assets`

- id.
- household_id.
- pet_id.
- storage_key.
- mime_type.
- byte_size.
- created_by_user_id.
- created_at.

### 11.2. Subscription And Payment Tables

`subscription_plans`

- id.
- code.
- name.
- price_vnd.
- duration_days.
- pet_limit.
- member_limit.
- media_limit_mb.
- ai_session_quota.
- active.

`affiliate_links`

- id.
- slug.
- title.
- description.
- affiliate_url.
- category.
- keywords.
- active.
- priority.
- created_at.
- updated_at.

`user_entitlements`

- id.
- household_id.
- plan_id.
- starts_at.
- expires_at.
- status.
- source_payment_id.
- created_at.
- updated_at.

`payments`

- id.
- household_id.
- plan_id.
- provider.
- provider_order_code.
- expected_amount_vnd.
- paid_amount_vnd.
- status.
- expires_at.
- paid_at.
- created_at.
- updated_at.

`payment_transactions`

- id.
- payment_id.
- provider.
- provider_transaction_id.
- bank_reference.
- bank_brand_name.
- account_number.
- transaction_date.
- transfer_amount_vnd.
- transfer_direction.
- payment_code.
- transaction_content.
- raw_payload_json.
- processing_status.
- created_at.

`payment_reviews`

- id.
- payment_id.
- payment_transaction_id.
- reason.
- status.
- admin_note.
- created_at.
- resolved_at.

### 11.3. AI Tables

`ai_sessions`

- id.
- household_id.
- pet_id.
- user_id.
- topic.
- status.
- token_budget.
- created_at.
- expires_at.

`ai_messages`

- id.
- session_id.
- role.
- content.
- token_count.
- safety_classification.
- created_at.

`knowledge_sources`

- id.
- title.
- url.
- publisher.
- language.
- trust_category.
- last_reviewed_at.
- status.
- created_at.

`knowledge_chunks`

- id.
- source_id.
- content.
- embedding.
- metadata_json.
- created_at.

## 12. API Routes

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`

Pets:

- `GET /api/pets`
- `POST /api/pets`
- `GET /api/pets/:id`
- `PATCH /api/pets/:id`
- `POST /api/pets/:id/archive`

Health:

- `GET /api/pets/:id/health-logs`
- `POST /api/pets/:id/health-logs`
- `PATCH /api/health-logs/:id`
- `DELETE /api/health-logs/:id`

Vaccinations:

- `GET /api/pets/:id/vaccinations`
- `POST /api/pets/:id/vaccinations`
- `PATCH /api/vaccinations/:id`

Check-ins:

- `GET /api/pets/:id/checkins`
- `POST /api/pets/:id/checkins`

AI:

- `POST /api/ai/sessions`
- `POST /api/ai/sessions/:id/messages`

Payments:

- `POST /api/payments`
- `GET /api/payments/:id`
- `POST /api/webhooks/sepay`
- `POST /api/admin/payments/:id/resolve`

## 13. UI Routes

Public web:

- `/`
- `/login`
- `/register`

Authenticated web app:

- `/dashboard`
- `/dashboard/pets`
- `/dashboard/pets/:id`
- `/dashboard/pets/:id/health`
- `/dashboard/pets/:id/vaccinations`
- `/dashboard/pets/:id/checkins`
- `/dashboard/care-guide`
- `/dashboard/billing`
- `/dashboard/billing/:paymentId`

Admin web:

- `/admin/payments`
- `/admin/knowledge`

## 14. Observability

Required logs:

- Auth failures.
- Payment order created.
- SePay webhook received.
- SePay webhook rejected.
- Payment matched.
- Payment mismatch review created.
- Entitlement activated.
- AI session created.
- AI safety refusal.
- AI quota exceeded.

Required metrics:

- Payment match rate.
- Payment mismatch count.
- Webhook duplicate count.
- Webhook rejection count.
- AI sessions per plan.
- AI token cost per plan.
- Emergency warning count.

## 15. Risk Register

Payment matching risk:

- Bank transfers can arrive with missing or changed transfer content.
- Mitigation: unique code, exact amount, admin review, reconciliation polling.

Webhook security risk:

- Forged webhook could grant paid access.
- Mitigation: HMAC verification, idempotency, server-only entitlement changes.

AI safety risk:

- User may treat AI as medical diagnosis.
- Mitigation: strict prompt rules, emergency warnings, refusal policy, source-backed answers.

Cost risk:

- AI usage can exceed plan economics.
- Mitigation: quotas, token budgets, compact RAG, monitoring.

Privacy risk:

- Pet health records are personal household data.
- Mitigation: household authorization, least-privilege access, private media storage.

## 16. Open Questions

- Which bank account will receive SePay payments in production?
- Will SePay use HMAC-SHA256 or API Key authentication for MVP launch?
- Will VietQR image generation be handled by SePay, VietQR-compatible account data, or an internal QR generator?
- What exact VND prices should Free, Plus, and Family use?
- Should paid entitlement start immediately on payment match or at end of current entitlement?
- Which email provider, if any, will send reminder emails after MVP?

## 17. Done Definition

MVP is done when:

- User can create account and pet profile.
- User can add health logs, vaccination records, and check-ins.
- User can ask AI Care Guide within quota.
- Emergency AI safety guidance is never paywalled.
- User can create a SePay payment order.
- Verified SePay transaction activates entitlement.
- Duplicate and mismatched payment events are handled safely.
- Admin can review unmatched payments.
- Core flows have unit, integration, and one browser-level smoke test.
- Browser-level smoke tests cover the web/web-app workflows instead of native mobile or desktop app flows.
- Harness story matrix links features to verification evidence.

## 18. Harness Trace Candidates

Initial story candidates:

- `auth-account`: account registration, login, logout, current user.
- `pet-profile`: create, edit, archive, and view pets.
- `health-log`: create and browse health records.
- `vaccination-reminder`: record vaccines and show upcoming/overdue reminders.
- `checkin-media`: create check-ins and attach media.
- `ai-care-guide`: RAG-backed care questions with safety rules and quota.
- `sepay-payment`: create payment order and match SePay webhook.
- `payment-reconciliation`: recover missed SePay events through transaction polling.
- `entitlement-gating`: enforce plan limits and paid access.
- `admin-payment-review`: resolve unmatched or mismatched bank transfers.
