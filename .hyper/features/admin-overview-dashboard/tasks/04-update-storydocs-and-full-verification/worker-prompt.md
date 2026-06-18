# Hyper Worker Assignment

You are a worker agent executing a task directly in the project root.

## Assignment Details

| Field | Value |
|-------|-------|
| Feature | admin-overview-dashboard |
| Task | 04-update-storydocs-and-full-verification |
| Task # | 4 |

**CRITICAL**: All file operations MUST be within this project root.

Do NOT modify files outside this project.
Do not run git commit automatically; leave commit/push decisions to the orchestrator or user.

---

## Your Mission

# Task: 04-update-storydocs-and-full-verification

## Feature: admin-overview-dashboard

## Dependencies

- **3. build-admin-overview-page** (03-build-admin-overview-page)

## Plan Section

### 4. Update story/docs and full verification

**Depends on**: 3

**Files:**
- Create: `docs/stories/admin-overview/overview.md`
- Create: `docs/stories/admin-overview/design.md`
- Create: `docs/stories/admin-overview/validation.md`
- Create: `docs/stories/admin-overview/execplan.md`
- Modify: `docs/stories/backlog.md`
- Modify: `docs/TEST_MATRIX.md`
- Modify: `package.json`

**What to do**:
- Step 1: Add `verify:admin-overview` script:
  - `npm test && npm run lint && npm run build && npm run test:e2e -- tests/e2e/admin-overview.spec.ts --project=chromium`
- Step 2: Create story packet documenting scope and evidence.
- Step 3: Add matrix row with status `implemented` only after verification passes.
- Step 4: Run: `npm run verify:admin-overview`
  - Expected: Vitest PASS, ESLint PASS, Next build PASS, Playwright admin overview PASS.

**Must NOT do**:
- Do not mark implemented before verification passes.
- Do not remove existing story rows.

**References**:
- `docs/stories/admin-payment-review/overview.md` — Existing admin story format.
- `docs/TEST_MATRIX.md` — Matrix format and evidence rules.
- `package.json` — Existing verify script style.

**Verify**:
- [ ] Run: `npm run verify:admin-overview` → PASS.

## Task Type

modification

## Context

## discovery

Original request: "Bo sung man admin". Clarification: user selected "Dashboard tổng quan". Data source: user selected "Live từ stores hiện có". Metrics scope: user selected "Core totals" = user, household, pet, payment total, paid revenue, open reviews. Research findings: existing admin payment page at src/app/admin/payments/page.tsx uses getCurrentAuthContext(), redirects /login if missing, listPaymentReviewItems(context, getPaymentStore()), AppShell, PageHeader, Card, Badge. listPaymentReviewItems requires activeHousehold role OWNER in src/lib/payments/service.ts. AuthStore currently has user/session/member methods only, no global stats. PetStore has household-scoped list/count only. PaymentStore has payment/review transaction methods only, no stats. Prisma stores can query global models; memory stores keep private maps and need explicit stats methods for tests/memory mode. UI components StatCard, Card, PageHeader, Badge, ButtonLink exist in src/components/ui/pet-ui.tsx. AppShell nav has no admin link yet.

## Completed Tasks

- 01-add-store-level-admin-stats-contracts-and-tests: Implemented store-level admin stats contracts across auth, pets, and payments. Added memory and Prisma implementations and covered core totals with src/lib/admin/admin-stats.test.ts. Verification passed: npm test -- src/lib/admin/admin-stats.test.ts.
- 02-add-admin-stats-service-and-api-route: Added admin overview stats service with owner-only guard, stable error body, and combined core totals. Added GET /api/admin/overview and route coverage for anonymous, non-owner, and owner success. Verification passed: npm test -- src/app/api/admin/overview/admin-overview-route.test.ts.
- 03-build-admin-overview-page: Built /admin server dashboard with AppShell, core total stat cards, payment health panel, admin nav entry, i18n copy, and Playwright smoke coverage. Verification passed: npm test admin stats/routes, npm run lint, npm run build, npm run test:e2e -- tests/e2e/admin-overview.spec.ts --project=chromium.


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
  task: "04-update-storydocs-and-full-verification",
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
  task: "04-update-storydocs-and-full-verification",
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
  task: "04-update-storydocs-and-full-verification",
  feature: "admin-overview-dashboard",
  status: "failed",
  summary: "What went wrong and what was attempted"
})
```

If you made **partial progress** but can't continue:

```
hyper_task_done({
  task: "04-update-storydocs-and-full-verification",
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
