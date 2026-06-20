# Agent Report

## Agent

Name: Codex

## Scope

Inspected validation output, high-risk auth/billing/plagiarism flows, package
diagnostics, route protection, WebView branches, dormant tours, TODOs, eslint
suppressions, and architecture/dead-code signals. No source changes in this phase.

## Inputs

02-baseline-validation.md, AGENTS.md, spec.md, package.json, npm audit,
npm outdated, Next build output, source searches, and line-level reads of
Copyleaks routes, grading actions, profile/auth stores, Grader, Document,
plagiarism UI, proxy, and Firebase admin/client wrappers.

## Branch and Push

- Branch: dev
- Upstream: origin/dev
- Commit: Pending
- Pushed to: Pending
- Sync status: dev matched origin/dev before report edits

## Loop

- Name: Findings Queue Loop, Architecture Fitness Loop, Lean Code Loop
- Goal: Build an evidence-backed backlog and pick the first executable fix
- Verify gate: Every finding has severity, evidence, owned files, proposed fix, and verification
- Stop condition: Highest-priority executable task is clear
- Attempt: 1/1
- Result: Passed; F-001/F-002 selected for the execution phase

## Run State

- Current phase: Findings Backlog
- Current task: T-003
- Last pushed commit: 07939d4 test: document baseline validation
- Next action: Commit/push backlog, then execute Copyleaks hardening batch
- Blockers: None

## Commands Run

```text
rg -n "TODO|FIXME|eslint-disable|\bany\b|@ts-expect-error|@ts-ignore" src
rg -n "minusCredits|creditsUsed|useCredits|createNewProfile|verifyIdToken|webhook|ReactNativeWebView|setInterval|setTimeout|onSnapshot|pending|plagiarism" src/actions src/app/api src/components src/zustand src/lib src/firebase src/proxy.ts
rg -n "from \"@/firebase/firebaseAdmin\"|from '@/firebase/firebaseAdmin'|from \"@/firebase/firebaseClient\"|from '@/firebase/firebaseClient'" src
npm outdated
du -sh .next node_modules agent-runs src
nl -ba src/actions/generateResponse.ts
nl -ba src/actions/correctGrammarSpelling.ts
nl -ba src/zustand/useProfileStore.ts
nl -ba src/components/Grader.tsx
nl -ba src/components/Document.tsx
nl -ba src/components/plagiarism/PlagiarismChecker.tsx
nl -ba src/app/api/copyleaks/submit/route.ts
nl -ba 'src/app/api/copyleaks/webhook/[status]/route.ts'
nl -ba src/zustand/useAuthStore.ts
nl -ba src/lib/hooks/useAuthToken.ts
nl -ba 'src/app/api/copyleaks/reports/[uid]/route.ts'
nl -ba 'src/app/api/copyleaks/reports/[uid]/[docId]/route.ts'
nl -ba src/lib/utils/saveHistory.ts
nl -ba src/components/plagiarism/PlagiarismCheckDashboard.tsx
nl -ba src/components/plagiarism/PlagiarismReport.tsx
nl -ba src/proxy.ts
nl -ba src/firebase/firebaseAdmin.ts
rg -n "verifyIdToken|adminAuth|cookies\(|request.cookies|COOKIE_NAME|NEXT_PUBLIC_COOKIE_NAME" src
```

## Findings

| ID | Severity | Type | Status | Area | Summary | Evidence | Risk | Effort | Verification | Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F-001 | P1 | Security | Open | Copyleaks report APIs | Report list/detail routes trust the path uid and use the admin SDK without verifying the requester owns that uid. | src/app/api/copyleaks/reports/[uid]/route.ts:9-23, src/app/api/copyleaks/reports/[uid]/[docId]/route.ts:9-25, src/components/plagiarism/PlagiarismReport.tsx:23-34 | Cross-user report/text/result disclosure if a uid/docId is guessed or leaked. | Small/medium | Route handlers verify the Firebase ID-token cookie with adminAuth and reject missing/mismatched uid; lint/test/build pass. | Fix in T-004. |
| F-002 | P1 | Bug/Billing | Open | Copyleaks submit credits | Submit checks credits on users/{uid}, but active credits are stored and debited at users/{uid}/profile/userData. | src/app/api/copyleaks/submit/route.ts:73-86, src/zustand/useProfileStore.ts:143-153, src/zustand/useAuthStore.ts:49-53 and 78-81 | Server-side sufficiency check can use stale root credits, causing incorrect acceptance/rejection and credit leakage. | Small | Submit reads profile/userData credits after verifying uid; canonical gates pass. | Fix in T-004. |
| F-003 | P1 | Security | Open | Route protection | plagiarism-check pages are not matched by proxy even though they display user report data. | src/proxy.ts:27-42, src/app/plagiarism-check/[uid]/[docId]/page.tsx:1-6 | Direct page routes are public; API hardening mitigates data reads but protected UX should align with other authenticated areas. | Small | proxy matcher includes /plagiarism-check and subpaths; AGENTS/spec notes updated. | Fix in T-004 with F-001. |
| F-004 | P2 | Billing | Deferred | Grading/grammar credits | Grading and grammar actions return usage, then the browser calls minusCredits after generation. | src/components/Grader.tsx:110-143, src/components/Document.tsx:155-190 and 248-260, src/actions/generateResponse.ts:73-101 | Determined clients can avoid authoritative debits; larger M1 roadmap item. | Medium/large | Server-authoritative debit design and transaction tests/manual verification. | Defer to product-approved M1/PIP-sized work. |
| F-005 | P2 | Security | Deferred | Copyleaks webhook | Webhook trusts inbound POSTs and filename-derived uid/docId, and does not verify report is pending. | src/app/api/copyleaks/webhook/[status]/route.ts:10-27 and 50-67 | Forged callbacks could corrupt report status/results. | Medium | Shared-secret/signature validation and pending-report ownership checks. | Defer to M2 unless handled in a focused follow-up. |
| F-006 | P2 | Bug/UX | Open | Grader credits | Grader initializes localCount from default profile credits but does not resync after profile load; Document does. | src/components/Grader.tsx:45-46, src/components/Document.tsx:126-129, src/zustand/useProfileStore.ts:24-38 | Grade button can remain disabled after profile credits load. | Small | Add profile credit sync or derive active from profile; lint/build pass. | Queue after P1 Copyleaks batch. |
| F-007 | P2 | Package update | Pending | Dependencies | npm audit reports 14 advisories: 3 high and 11 moderate; npm outdated shows safe patch/minor drift plus risky majors. | 02-baseline-validation.md; npm outdated output for ai, Next, TipTap, Firebase, officeparser, etc. | Vulnerable transitive dependency surfaces; package churn risk. | Medium | Safe patch/minor updates, npm audit, lint/test/build. | Evaluate in T-005 after primary fix. |
| F-008 | P3 | Build warning | Deferred | Build config/deps | Build warns about tailwind.config.ts module type and officeparser dynamic loader. | npm run build output; src/actions/parseDocumentFromUrl.ts import trace. | Noise in baseline can hide future warnings; officeparser warning may be unavoidable. | Small/medium | Warning removed or documented after safe config/dependency change. | Defer unless package update fixes it. |
| F-009 | P3 | Dead code/Product | Deferred | Tours | Tour components are wired but return null due react-joyride incompatibility. | src/components/tours/* search; spec.md M5. | Dormant UI path and dead import weight; product replacement needed. | Medium | Product-approved onboarding replacement/removal. | Defer to M5/PIP. |

## Changes Made

- Updated findings backlog, task queue, and run-state only.

## Verification

Findings are backed by source line reads, successful baseline lint/test/build,
npm audit/outdated diagnostics, and route/build output. Source fixes are deferred
to the execution phase.

## Architecture and Lean Code Scorecard

| Area | Status | Evidence | Action |
| --- | --- | --- | --- |
| Dependency direction | Watch | Client components use Firebase client/Zustand; route handlers use firebaseAdmin. New server auth helper must stay route-only. | Fix F-001 without client imports. |
| Module cohesion | Watch | Copyleaks behavior is split across UI, submit route, report routes, webhook, and profile store. | Keep T-004 focused to auth/credit boundary. |
| Public surface area | Fail | /api/copyleaks/reports/* accepts uid/docId path params and admin-reads without session ownership. | Fix F-001. |
| Data and side-effect flow | Fail | Submit route reads stale users/{uid}.credits while profile store debits users/{uid}/profile/userData. | Fix F-002. |
| Async/cache/resource lifecycle | Watch | Streams, token refresh, Copyleaks async webhooks, and save effects have multiple lifecycle paths. | Defer non-P1 findings after focused fix. |
| Duplication and dead code | Watch | Dormant tour components and duplicated grading submit paths exist, but product direction is needed before removal. | Defer F-009 and inspect later. |
| Dependency lean-ness | Fail | npm audit found high advisories; npm outdated shows patch/minor drift. | Evaluate in T-005. |
| Testability | Watch | Utility tests pass; no route/component harness for API/UI auth paths. | Use lint/test/build and document manual route checks. |

## Quality Gate

- Command: npm run lint
- Result: Passed
- Notes: Report-only phase; lint selected before push.

## Commit-Push Checkpoint

- Status inspected: Pending
- Diff checked: Pending
- Files staged: Pending
- Dry-run push: Pending
- Push: Pending
- Post-push sync: Pending

## Stabilization

- Cycle: Not started
- Completion criteria status: Not applicable in findings
- Remaining blockers: None

## Risks

- F-001/F-002 can be fixed locally, but full end-to-end Copyleaks validation still needs real service credentials and a logged-in browser session.
- Server-authoritative credit debit and webhook authentication are intentionally deferred because they are broader product/security changes already represented in spec.md roadmap items.

## Open Questions

- None.

## Recommended Next Step

Run lint, commit/push this backlog, then execute the focused Copyleaks auth/profile-credit fix batch.
