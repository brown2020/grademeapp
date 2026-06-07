# AGENTS.md

Authoritative operating guide for AI agents (Codex, Claude, etc.) working in this
repository. Read this file fully before making any change. For product scope,
current-state inventory, and the roadmap, see [`spec.md`](./spec.md).

---

## Project overview

**Grade.me** (`grademeapp`) is an AI-powered writing-feedback web app. Students,
educators, and writers submit an essay (typed, pasted, or uploaded), choose or
build a grading rubric, and receive a streamed letter grade plus detailed,
rubric-aligned feedback from a large language model. The app also offers grammar/
spelling correction, a Copyleaks-backed plagiarism/AI-detection check, grading
history, and a credit-based billing model powered by Stripe.

It is a single Next.js App Router application. It is also embedded inside a React
Native WebView wrapper (the code branches on `window.ReactNativeWebView`), so
changes to layout, scrolling, and auth must stay WebView-safe.

## Product purpose

Give writers fast, actionable, rubric-based feedback so they can improve a draft
before submitting it. The grade is a means to the feedback, not the end. See
[`spec.md`](./spec.md) for the full product promise and roadmap.

## Current tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 6 (strict).
- **Bundler:** Webpack (scripts pass `--webpack`; the project is **not** on
  Turbopack — do not switch it).
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`), `tailwind.config.ts`,
  `tailwindcss-animate`. Some shadcn/Radix primitives in `src/components/ui`.
- **State:** Zustand stores in `src/zustand`.
- **Auth & data:** Firebase (client SDK in the browser, `firebase-admin` on the
  server). Firestore is the database; Firebase Storage holds uploaded documents.
- **AI:** Vercel AI SDK (`ai`, `@ai-sdk/*`) via a provider registry
  (`src/lib/utils/registry.ts`). Grading streams through `@ai-sdk/rsc`
  (`createStreamableValue` / `readStreamableValue`).
- **Payments:** Stripe (`stripe` server SDK + `@stripe/react-stripe-js`).
- **Plagiarism / AI detection:** Copyleaks REST API via Next.js route handlers.
- **Editor:** TipTap 3; spellcheck via `nspell` + bundled `en_US` dictionaries.
- **Doc parsing:** `mammoth` (DOCX), `pdf2json` (PDF), `officeparser` (ODT/OOXML),
  `@iarna/rtf-to-html` (RTF).

Package manager is **npm** (the lockfile is `package-lock.json`). Do not switch
package managers. `.npmrc` sets `legacy-peer-deps=true`; keep it.

## Repository structure

```
src/
  proxy.ts                 # Next 16 proxy (middleware): server-side route protection
  app/                     # App Router routes (pages, layouts, API route handlers)
    api/copyleaks/         # Plagiarism: submit, webhook/[status], reports/[uid]/[docId]
    grader/ rubrics/ assignments/ dashboard/ profile/ plagiarism-check/
    payment-attempt/ payment-success/ loginfinish/ support/ terms/ privacy/
    layout.tsx page.tsx globals.css
  actions/                 # "use server" server actions
    generateResponse.ts        # generateGrade(): streamed rubric grading
    correctGrammarSpelling.ts  # grammar/spelling correction
    parseDocumentFromUrl.ts    # fetch + parse uploaded docs (SSRF-guarded)
    paymentActions.ts          # Stripe PaymentIntent create/validate
    htmlToDocx.ts              # editor HTML -> .docx (base64)
  components/              # UI. Big ones: Grader, Rubrics, Assignments, Summary,
    rubrics/ plagiarism/ tiptap/ tours/ menus/ ui/
  zustand/                 # useAuthStore, useProfileStore, useRubricStore,
                           # usePaymentsStore, useMobileMenuStore, useInitializeStores
  firebase/                # firebaseClient.ts (browser), firebaseAdmin.ts (server)
  lib/
    utils/                 # registry.ts (AI providers), user.ts (getApiKeys),
                           # saveHistory.ts, responseParser.ts, textUtils.ts, etc.
    types/ constants/ hooks/ dictionaries/
```

## Core architecture overview

- **Rendering model:** Despite the React Server Components default, this app is
  **client-heavy**. Most feature components start with `"use client"` because they
  depend on Firebase client auth and Zustand. Server work lives in **server
  actions** (`src/actions/*`, `"use server"`) and **route handlers**
  (`src/app/api/*`), not in server components doing data fetching.
- **Auth flow:** `useAuthToken` (`src/lib/hooks/useAuthToken.ts`) subscribes to
  Firebase auth via `react-firebase-hooks`, writes an ID-token cookie
  (`NEXT_PUBLIC_COOKIE_NAME`), refreshes it on a 50-minute timer, and mirrors the
  user into `useAuthStore`. `useInitializeStores` then loads the Firestore profile
  into `useProfileStore`.
- **Grading flow:** `Grader.tsx` calls the `generateGrade` server action, which
  resolves a model from the registry, estimates token cost, streams text back via
  `createStreamableValue`, and returns `creditsUsed`. The client consumes the
  stream with `readStreamableValue`, deducts credits with
  `useProfileStore.minusCredits`, then persists a record with `saveDocument`.
- **AI providers:** `registry.ts` registers `openai`, `fireworks`, `xai`,
  `anthropic`, `google`, `groq`, `azure`, and `openai-compatible`. Model IDs are
  `"provider:model"`. Users may supply their own OpenAI/Fireworks keys
  (`profile.useCredits === false`); otherwise platform keys + credits are used.
- **Plagiarism flow:** client → `POST /api/copyleaks/submit` (admin SDK checks
  credits, writes a `pending` report, submits to Copyleaks with a webhook URL) →
  Copyleaks calls `POST /api/copyleaks/webhook/[status]` → handler writes results
  to Firestore → report pages read them.
- **Data model (Firestore):**
  - `users/{uid}` — auth mirror (set by `useAuthStore.setAuthDetails`).
  - `users/{uid}/profile/userData` — profile: `credits`, `useCredits`, BYO API
    keys, `favoriteRubrics`, identity/level.
  - `users/{uid}/summaries/{id}` — grading history (`userInput`, `submissions`,
    `fileUrl`).
  - `users/{uid}/custom_rubrics/{id}` — user-built rubrics.
  - `users/{uid}/plagiarism_reports/{id}` — Copyleaks scan status + results.

## Key app features that exist today

- AI essay grading with streamed, rubric-aligned feedback and a percentage grade.
- Rubric system: ~13 default rubric types (`src/lib/constants/rubrics.json`) plus a
  custom rubric builder with per-type criteria builders; favorites; relevance
  sorting against the user's identity/level and text type.
- Grammar & spelling correction (chunked for long inputs) in a TipTap editor.
- Document upload + parsing (DOCX, PDF, ODT, RTF, TXT) via a server action.
- Plagiarism / AI-content detection via Copyleaks with async webhook results.
- Grading history ("assignments") and per-submission detail views.
- Credit-based billing with Stripe PaymentIntents; BYO-API-key mode.
- Multi-method auth: Google popup, email/password, and passwordless email link.
- Export feedback/document to `.docx`.
- Embeds in a React Native WebView (mobile wrapper).

> Inferred / partially implemented: the in-app guided **tours** (`src/components/
> tours/*`) are currently **disabled** — every tour component returns `null`
> because `react-joyride` is not React 19 compatible. Treat tours as dormant.

## Important commands

```bash
npm install            # install deps (respects .npmrc legacy-peer-deps)
npm run dev            # local dev server (Next + webpack)
npm run build          # production build — the primary correctness gate
npm run start          # serve a production build
npm run lint           # ESLint (flat config, eslint.config.mjs)
npm test               # Vitest unit tests, run-once (vitest run) — CI-safe
npx tsc --noEmit       # standalone typecheck (see caveat below)
```

### Canonical validation/check command

Run this before considering any change done:

```bash
npm run lint && npm test && npm run build
```

`npm run build` runs the TypeScript compiler as part of the build and regenerates
`.next/types`, so it is the authoritative typecheck + correctness gate. `npm test`
runs the Vitest unit suite once (no watch mode), which is CI-safe.

> Caveat: a bare `npx tsc --noEmit` can report false errors from **stale**
> `.next/types/*` files (e.g. missing `PrefetchForTypeCheckInternal`) when `.next`
> was produced by a different Next.js version. If you see only `.next/...` errors,
> run `rm -rf .next && npm run build` and trust the build. Real source errors from
> `tsc` still matter.

## Non-interactive testing rules

- Everything must run non-interactively and CI-safe. Never use watch mode, never
  start a headed browser, never rely on manual login or a running dev server.
- Unit tests run via **Vitest** with `npm test` (`vitest run`, run-once). Coverage
  is currently limited to pure utility logic under `src/lib/utils`
  (`responseParser`, `textUtils`, model-id helpers). Add unit tests alongside the
  code you change when the logic is pure and bug-prone.
- There is **no component/e2e test setup** (no jsdom, React Testing Library, or
  Playwright). Don't assume one exists. If a change needs browser/runtime
  verification you cannot do with a Vitest unit test, document the manual steps in
  your report instead of attempting them.

## Development conventions

- TypeScript + functional React components only; no class components.
- Import alias `@/*` maps to `src/*` (see `tsconfig.json`). Use it.
- Directory names are lowercase-with-dashes where applicable; existing component
  files are PascalCase `.tsx` — match the directory you are editing.
- Keep server-only code (`"use server"`, `firebase-admin`, Stripe secret, Copyleaks
  keys) out of client bundles. Secrets must never be imported into `"use client"`
  files.
- Use `react-hot-toast` for user-facing errors; `console.error` for diagnostics.
- Prefer small, focused Zustand stores; follow the existing store patterns.
- Do not add narration comments. Comments should explain non-obvious intent only.

## TypeScript and lint expectations

- `strict` is on; `next.config.mjs` sets `typescript.ignoreBuildErrors: false`, so
  **type errors fail the build**. Do not weaken this.
- ESLint uses the flat config in `eslint.config.mjs` (extends
  `eslint-config-next` core-web-vitals + typescript) and enforces
  `react-hooks/set-state-in-effect: "error"`. Do **not** reintroduce
  set-state-in-effect patterns — use derived/adjusting-state-during-render
  approaches, consistent with the prior cleanup.
- Avoid `any`; the few existing `any`s in `firebaseClient.ts`/`firebaseAdmin.ts`
  are deliberate build-time guards with eslint-disable lines. Don't spread the
  pattern.

## Server/client boundary guidance

- Browser Firebase access uses `@/firebase/firebaseClient` (`auth`, `db`,
  `storage`). Server/admin access uses `@/firebase/firebaseAdmin` (`adminDb`,
  `adminAuth`, `adminBucket`). Never import `firebaseAdmin` into client code.
- New backend logic belongs in a `"use server"` action under `src/actions` or a
  route handler under `src/app/api`. Route handlers are the right place for
  third-party webhooks and anything needing the admin SDK.
- Both Firebase modules wrap init in try/catch and export empty objects on failure
  (so `next build` doesn't crash without env vars). Don't assume they throw on
  misconfiguration at runtime.

## Route-protection guidance

- Protection is **server-side** via the Next.js proxy convention in `src/proxy.ts`
  (Next 16's renamed `middleware`; the file must `export function proxy`). Its
  `config.matcher` covers the authenticated areas — `/grader`, `/rubrics`,
  `/assignments`, `/dashboard`, `/profile` (and subpaths). Unauthenticated
  requests are redirected to `/` (where sign-in lives) and the stale cookie is
  cleared.
- Auth state is read from the Firebase **ID-token session cookie**
  (`NEXT_PUBLIC_COOKIE_NAME`, default `grademeAuthToken`), which `useAuthToken`
  sets on sign-in and refreshes on a timer. The proxy validates the token's
  structure and `exp` via `isSessionTokenActive` (`src/lib/utils/authToken.ts`) —
  an Edge-safe, signature-less check. Keep that helper pure and Edge-safe (no Node
  APIs, no network); it is unit-tested.
- The proxy does **not** cryptographically verify the token signature (that would
  need Google's public keys / a Node runtime). It is a server-side gate, not full
  authorization. There is still **no Firestore security rules file in this repo**;
  authoritative authorization must come from Firestore rules (Firebase console)
  plus server-side token verification in route handlers/actions. When adding any
  data path or sensitive operation, verify the user server-side
  (`adminAuth.verifyIdToken`) rather than trusting a client-supplied `uid`.
- To change which routes are protected, edit the `matcher` in `src/proxy.ts`. Keep
  API routes, Next internals, static assets, and public pages out of the matcher.

## State-management guidance

- Global state is Zustand (`src/zustand`). Stores call Firestore directly and keep
  a local mirror; follow that pattern (optimistic local `set` + awaited Firestore
  write, with `handleProfileError`-style logging).
- `useAuthStore` holds the session mirror; `useProfileStore` owns `credits`,
  `useCredits`, BYO keys, and favorites; `useRubricStore` owns rubric options,
  the active/selected rubric, grading data, and custom-rubric CRUD.
- Read other stores via `useXStore.getState()` inside actions to avoid render
  coupling, as the existing code does.
- Note: default-credit values are inconsistent across `useAuthStore` (1000),
  `useProfileStore` default (0), and `createNewProfile` (1000). Don't "fix" one in
  isolation without checking the others.

## Testing expectations

- Vitest is the unit-test runner (`npm test` → `vitest run`). Keep tests pure and
  fast; the config uses the `node` environment and the `@/*` alias
  (`vitest.config.ts`). Co-locate tests as `*.test.ts` next to the code.
- Add/extend unit tests for pure, bug-prone logic you touch (parsing, credit math,
  id/string helpers). Avoid importing modules with heavy import-time side effects
  (e.g. `registry.ts` instantiates AI providers from env at module load).
- The expected verification for every change is the canonical command:
  `npm run lint && npm test && npm run build` passes, plus a clear
  manual-verification note in the report when relevant.
- Introducing a component/e2e harness (jsdom/RTL/Playwright) is a larger,
  separate focused change — don't bolt it onto an unrelated fix.

## Files and systems requiring extra caution

- `src/actions/parseDocumentFromUrl.ts` — has an SSRF guard (`isAllowedUrl`:
  HTTPS-only, blocks localhost/private ranges). Preserve and strengthen it; never
  remove the guard. `officeparser` is on v7 here (`parseOffice` + `ast.toText()`),
  not the old `parseOfficeAsync` API.
- `src/lib/utils/registry.ts` — provider/credentials wiring. Changing model IDs or
  provider names affects every grading call.
- `src/actions/generateResponse.ts` / `correctGrammarSpelling.ts` — credit
  estimation and deduction math; user-facing billing impact.
- `src/app/api/copyleaks/*` — external webhooks and admin-SDK writes; filename
  encodes `{uid}-{docId}` for webhook correlation. Keep that contract.
- `src/firebase/firebaseAdmin.ts` / `firebaseClient.ts` — env-driven init with
  swallowed errors.
- `package.json` / `package-lock.json` — `eslint`, `eslint-config-next`, and
  `eslint-plugin-react` are intentionally pinned; `officeparser` and `lucide-react`
  have had pin history. Don't bump these casually.
- Secrets: `.env`, `.env.local`, `service_key.json` exist locally and are
  gitignored. Never commit them, never print their contents.
- React Native WebView branches (`window.ReactNativeWebView`) — don't break the
  mobile wrapper when changing layout/scroll/auth.

## Git workflow expectations (main and dev)

- `main` is the **stable production branch**. `dev` is the **working branch**.
- Default workflow for agents: work on `dev`, commit to `dev`, push `origin/dev`.
- **Never push to `main`** unless a human explicitly directs it. `main` is a
  protected branch (requires PR review + verified signatures); do not attempt to
  bypass protection.
- Do not change git config, do not force-push, do not rewrite published history.
- Use Conventional Commit messages (e.g. `feat:`, `fix:`, `chore(deps):`,
  `docs:`), matching the existing history.

## Definition of done

A change is done when all of the following hold:

1. The stated task is fully implemented (no half-built feature left active).
2. `npm run lint && npm run build` passes with no new errors or warnings.
3. No secrets, generated artifacts, or unrelated files are committed.
4. Server/client boundaries and the route-protection model are respected.
5. Docs are updated when behavior changes: [`spec.md`](./spec.md) for product/
   architecture, this file for agent workflow, `README.md` for setup.
6. The change is committed to `dev` with a Conventional Commit message and pushed
   to `origin/dev`.

## Rules for autonomous Codex runs

- **One focused, PR-sized change per run.** Even though you commit directly to
  `dev` (no feature branch, no PR), scope each run to a single coherent change that
  *could* be one reviewable PR. Do not batch unrelated changes.
- Before editing: `git fetch`, ensure you are on `dev`, pull latest `origin/dev`,
  and inspect the working tree. If there are pre-existing uncommitted changes you
  did not create, do not overwrite them — document them and stop unless they are
  clearly safe to preserve.
- Prefer completing/repairing existing product capability over speculative new
  systems. Follow [`spec.md`](./spec.md)'s roadmap ordering.
- Make the smallest change that fully achieves the goal. Reuse existing patterns
  (stores, server actions, registry, rubric types) rather than introducing new
  abstractions.
- Validate with the canonical command, then commit to `dev` and push `origin/dev`
  with a Conventional Commit message. Report what you did and what you verified.
- Keep generated files (`package-lock.json`, `.next/`, build output) out of commits
  unless the change legitimately requires a lockfile update.

## Stop conditions

Stop and report instead of guessing when any of these occur:

- Pre-existing uncommitted changes in the working tree that are not clearly safe to
  preserve.
- A task would require pushing to `main`, bypassing branch protection, editing git
  config, or committing secrets.
- A change needs new environment variables, new third-party services, or new
  Firestore security rules you cannot configure from the repo.
- `npm run build` fails for reasons you cannot resolve within the change's scope,
  or a dependency major-bump breaks the build (see the `officeparser`/`lucide`
  history).
- The work is growing beyond one focused, PR-sized change.
- A request conflicts with this file or [`spec.md`](./spec.md), or is ambiguous
  enough that proceeding risks the wrong outcome.

When you stop, state the current branch, what you changed (if anything), what
blocked you, and the recommended next step.
