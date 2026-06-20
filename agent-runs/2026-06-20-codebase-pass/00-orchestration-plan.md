# Orchestration Plan

## Mode Selection

- Repo: /Users/stephenbrown/Code/OPENSOURCE/grademeapp
- Branch: dev
- Work mode: full
- Run folder: agent-runs/2026-06-20-codebase-pass
- Verifiable gates: git remote read, dry-run push, npm run lint, npm test, npm run build, targeted source searches, git diff --check
- Human-decision blockers: product roadmap changes, new environment variables/services, Firestore rule changes outside the repo, broad architecture choices without local verification
- Resume policy: resume from run-state.md plus current Git state; push any validated local phase commit before new edits

## Loop Plan

| Phase | Loop | Verify Gate | Stop Condition |
| --- | --- | --- | --- |
| Preflight and Repo Docs | Orchestration Planning Loop, Docs Sweep Loop | Docs match current repo and checks pass | Plan, state, queue, docs, and report pushed |
| Baseline Validation | Baseline Validation Loop, Quality Gate Selection Loop | Lint, tests, build, and dependency baseline are recorded | Baseline is clean or failures are classified with reproductions |
| Findings Backlog | Findings Queue Loop, Architecture Fitness Loop, Lean Code Loop | Evidence-backed backlog and scorecard | Backlog, scorecard, and queue are pushed |
| Execute Fixes and Improvements | Task Queue Loop, Fix Validation Loop, Architecture Fitness Loop, Lean Code Loop | Targeted checks plus lint/test/build as practical pass | Highest-priority focused fix is pushed or blocked with evidence |
| Package and Dead-Code Cleanup | Package Cleanup Loop, Dead Code Loop | Safe dependency/dead-code findings are verified | Safe cleanup is pushed or risky cleanup is deferred |
| Review | Judge Loop | Diff, reports, and gates pass reviewer rubric | PASS or bounded follow-up tasks are queued |
| Stabilization Loop | Stabilization Loop, Judge Loop, Reflect-or-Kill Loop if needed | No P0/P1, confirmed race, introduced regression, or high-confidence architecture Fail remains | Completion criteria pass or real blocker is recorded |
| Integrator | Final Completion Gate | Remote read, dry-run push, clean tree, branch sync, recorded gates | Final report is pushed and local dev matches origin/dev |

## File Ownership

| Task | Owned Files | Notes |
| --- | --- | --- |
| T-001 | AGENTS.md, spec.md, agent-runs/2026-06-20-codebase-pass/00-orchestration-plan.md, run-state.md, task-queue.md, 01-preflight-and-repo-docs.md, skill-improvement-log.md | Startup planning, docs sweep, and resume state |
| T-002 | agent-runs/2026-06-20-codebase-pass/02-baseline-validation.md, run-state.md, task-queue.md | Baseline validation only; no source edits |
| T-003 | agent-runs/2026-06-20-codebase-pass/03-findings-backlog.md, run-state.md, task-queue.md | Evidence-backed backlog and architecture scorecard |
| T-004 | Source files selected from findings, matching tests, 04-execute-fixes-and-improvements.md, run-state.md, task-queue.md | One focused code fix batch after backlog approval by evidence |
| T-005 | package.json, package-lock.json if needed, dead-code candidates with proof, 05-package-and-dead-code-cleanup.md | Safe cleanup only; defer broad/risky package changes |
| T-006 | 06-review.md, run-state.md, task-queue.md | Review report and bounded follow-up tasks |
| T-007 | 07-stabilization-loop.md, run-state.md, task-queue.md, files owned by open P0/P1 tasks | Stabilization fixes only |
| T-008 | 08-integrator.md, final-report.md, run-state.md, task-queue.md | Final completion gate and report |
