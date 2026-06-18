# Hyper Worker Assignment

You are a worker agent executing a task directly in the project root.

## Assignment Details

| Field | Value |
|-------|-------|
| Feature | admin-overview-dashboard |
| Task | 03-build-admin-overview-page |
| Task # | 3 |

**CRITICAL**: All file operations MUST be within this project root.

Do NOT modify files outside this project.
Do not run git commit automatically; leave commit/push decisions to the orchestrator or user.

---

## Your Mission

# Task: 03-build-admin-overview-page

## Feature: admin-overview-dashboard

## Dependencies

- **2. add-admin-stats-service-and-api-route** (02-add-admin-stats-service-and-api-route)

## Plan Section

### 3. Build `/admin` overview page

**Depends on**: 2

**Files:**
- Create: `src/app/admin/page.tsx`
- Modify: `src/components/ui/app-shell.tsx`
- Modify: `src/lib/i18n.ts`
- Test: existing E2E or new `tests/e2e/admin-overview.spec.ts`

**What to do**:
- Step 1: Write failing E2E smoke that signs in, opens `/admin`, and expects:
  - page title for admin overview
  - stat labels for users, households, pets, payments, revenue, open reviews
  - link to `/admin/payments`
- Step 2: Run: `npm run test:e2e -- tests/e2e/admin-overview.spec.ts --project=chromium`
  - Expected before implementation: FAIL because `/admin` does not exist.
- Step 3: Create `src/app/admin/page.tsx` as a server page:
  - redirect anonymous to `/login`.
  - require owner using admin stats service.
  - render `AppShell` with `activeKey="admin"`.
  - render `PageHeader`, `StatCard`s, and a `ButtonLink` to `/admin/payments`.
- Step 4: Add admin nav key/link to `AppShell` so owner users can reach `/admin`.
- Step 5: Add Vietnamese/English copy in `src/lib/i18n.ts` for admin overview title, description, labels, and actions.
- Step 6: Run E2E smoke.
  - Expected: PASS.

**Must NOT do**:
- Do not add client-side fetching for stats unless server page cannot access stores.
- Do not expose admin nav to anonymous users; AppShell already renders only after auth in admin pages.
- Do not add charts or tables.

**References**:
- `src/app/admin/payments/page.tsx:12-37` — Existing admin page structure.
- `src/components/ui/pet-ui.tsx:110-143` — PageHeader, StatCard, and reusable UI.
- `src/components/ui/app-shell.tsx:10-21` — Nav keys to extend.

**Verify**:
- [ ] Run: `npm run test:e2e -- tests/e2e/admin-overview.spec.ts --project=chromium` → PASS.

## Task Type

modification

## Context

## discovery

Original request: "Bo sung man admin". Clarification: user selected "Dashboard tổng quan". Data source: user selected "Live từ stores hiện có". Metrics scope: user selected "Core totals" = user, household, pet, payment total, paid revenue, open reviews. Research findings: existing admin payment page at src/app/admin/payments/page.tsx uses getCurrentAuthContext(), redirects /login if missing, listPaymentReviewItems(context, getPaymentStore()), AppShell, PageHeader, Card, Badge. listPaymentReviewItems requires activeHousehold role OWNER in src/lib/payments/service.ts. AuthStore currently has user/session/member methods only, no global stats. PetStore has household-scoped list/count only. PaymentStore has payment/review transaction methods only, no stats. Prisma stores can query global models; memory stores keep private maps and need explicit stats methods for tests/memory mode. UI components StatCard, Card, PageHeader, Badge, ButtonLink exist in src/components/ui/pet-ui.tsx. AppShell nav has no admin link yet.

## Completed Tasks

- 01-add-store-level-admin-stats-contracts-and-tests: Implemented store-level admin stats contracts across auth, pets, and payments. Added memory and Prisma implementations and covered core totals with src/lib/admin/admin-stats.test.ts. Verification passed: npm test -- src/lib/admin/admin-stats.test.ts.
- 02-add-admin-stats-service-and-api-route: Added admin overview stats service with owner-only guard, stable error body, and combined core totals. Added GET /api/admin/overview and route coverage for anonymous, non-owner, and owner success. Verification passed: npm test -- src/app/api/admin/overview/admin-overview-route.test.ts.


---

## Pre-implementation Checklist

Before writing code, confirm:
1. Dependencies are satisfied and required context is present.
2. The exact files/sections to touch (from references) are identified.
3. The implementation and verification strategy for this task is clear.

---

## Blocker Protocol

If you hit a blocker requiring human decision, **DO NOT** use the question tool directly.
Instead, escalate via the blocker protocol:

1. **Save your progress** by ensuring your in-progress changes and findings are reflected in files.
2. **Call hyper_task_done** with blocker info:

```
hyper_task_done({
  task: "03-build-admin-overview-page",
  feature: "admin-overview-dashboard",
  status: "blocked",
  summary: "What you accomplished so far",
  blocker: {
    reason: "Why you're blocked - be specific",
    options: ["Option A", "Option B", "Option C"],
    recommendation: "Your suggested choice with reasoning",
    context: "Relevant background the user needs to decide"
  }
})
```

**After calling hyper_task_done with blocked status, STOP IMMEDIATELY.**

The Hyper Master will:
1. Receive your blocker info
2. Ask the user for a decision
3. Spawn a NEW worker to continue with the decision

This keeps the user focused on ONE conversation (Hyper Master) instead of multiple worker panes.

---

## Completion Protocol

When your task is **fully complete**:

```
hyper_task_done({
  task: "03-build-admin-overview-page",
  feature: "admin-overview-dashboard",
  status: "completed",
  summary: "Concise summary of what you accomplished"
})
```

Then inspect the tool response fields:
- If `ok=true` and `terminal=true`: stop the session
- Otherwise: **DO NOT STOP**. Follow `nextAction`, remediate, and retry `hyper_task_done`

**CRITICAL: Stop only on terminal tool result (ok=true and terminal=true).**
If the result is non-terminal (for example verification_required), DO NOT STOP.
Follow result.nextAction, fix the issue, and call hyper_task_done again.

Only when the tool result is terminal should you stop.
Do NOT continue working after a terminal result. Do NOT respond further. Your session is DONE.
The Hyper Master will take over from here.

**Summary Guidance** (used verbatim for downstream task context):
1. Start with **what changed** (files/areas touched).
2. Mention **why** if it affects future tasks.
3. Note **verification evidence** (tests/build/lint) or explicitly say "Not run".
4. Keep it **2-4 sentences** max.

If you encounter an **unrecoverable error**:

```
hyper_task_done({
  task: "03-build-admin-overview-page",
  feature: "admin-overview-dashboard",
  status: "failed",
  summary: "What went wrong and what was attempted"
})
```

If you made **partial progress** but can't continue:

```
hyper_task_done({
  task: "03-build-admin-overview-page",
  feature: "admin-overview-dashboard",
  status: "partial",
  summary: "What was completed and what remains"
})
```

---

## Debugging Protocol (When stuck)

1. **Reproduce**: Get consistent failure
2. **Isolate**: Binary search to find cause
3. **Hypothesize**: Form theory, test it
4. **Fix**: Minimal change that resolves

After 3 failed attempts at same fix: STOP and report blocker.

---

## Tool Access

**You have access to:**
- All standard tools (read, write, edit, bash, glob, grep)
- `hyper_task_done` - Signal task done/blocked/failed
- `hyper_plan_read` - Re-read plan if needed
- `hyper_context_write` - Save learnings for future tasks

**You do NOT have access to (or should not use):**
- `question` - Escalate via blocker protocol instead
- `task` - No recursive delegation

---

## Guidelines

1. **Work methodically** - Break down the mission into steps
2. **Stay in scope** - Only do what the spec asks
3. **Escalate blockers** - Don't guess on important decisions
4. **Save context** - Use hyper_context_write for discoveries
5. **Complete cleanly** - Always call hyper_task_done when done

---

**User Input:** Do not ask the user questions directly. If blocked, call `hyper_task_done(status: 'blocked', blocker: ...)` and stop.

---

Begin your task now.
