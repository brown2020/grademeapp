# AGENTS.md

Authoritative operating guide for AI agents (Codex, Claude, etc.) working in this
repository. Read this file fully before making any change. For product scope
and the current-state inventory, see [`spec.md`](./spec.md). For the punchlist
of next steps, known bugs, and open issues, see [`roadmap.md`](./roadmap.md).

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
- **Styling:** Tailwind CSS v4, CSS-first (no `tailwind.config.ts`): semantic
  design tokens (light + dark via `prefers-color-scheme`) and `@theme` live in
  `src/app/globals.css`. Fonts: Inter (UI) + Source Serif 4 (headings, essays,
  grades) via `next/font`. Shared shadcn-style primitives on Radix in
  `src/components/ui` (button, input/Field, card, badge, spinner, page,
  dialog, select/SimpleSelect, popover, switch, dropdown-menu, tabs,
  ConfirmDeleteDialog). See "UI conventions" below.
- **State:** Zustand stores in `src/zustand`.
- **Auth & data:** Firebase (client SDK in the browser, `firebase-admin` on the
  server). Firestore is the database; Firebase Storage holds uploaded documents.
- **AI:** Vercel AI SDK (`ai`, `@ai-sdk/*`) via a provider registry
  (`src/lib/utils/registry.ts`). Grading streams through `@ai-sdk/rsc`
  (`createStreamableValue` / `readStreamableValue`).
- **Payments:** Stripe (`stripe` server SDK + `@stripe/react-stripe-js`).
- **Plagiarism / AI detection:** Copyleaks REST API via Next.js route handlers.
- **Editor:** TipTap 3; spellcheck via `nspell` + `en_US` dictionaries served from `public/dictionaries`.
- **Doc parsing:** `mammoth` (DOCX), `officeparser` (PDF, ODT; content tree →
  HTML via `lib/utils/documentHtml.ts`), `@iarna/rtf-to-html` (RTF). `pdf2json`
  was removed: it rejected PDFs with cross-reference streams (most modern exports).

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
    parseDocumentFromUrl.ts    # fetch + parse the user's own uploads (allowlisted)
    paymentActions.ts          # Stripe PaymentIntent create/validate
    htmlToDocx.ts              # editor HTML -> .docx (base64)
  components/              # UI, grouped by feature area:
    shell/                 # AppShell, AppHeader, MobileTabBar, UserMenu, nav, footer, dialogs
    auth/                  # AuthDialog (all sign-in modes), authErrors
    grader/ editor/        # grading workspace; TipTap editor, toolbar, spellcheck
    rubrics/               # library, cards, builder/ (schema-driven), lib/ (pure, tested)
    history/ profile/ payments/ plagiarism/ legal/
    ui/                    # design-system primitives
  zustand/                 # useAuthStore, useProfileStore, useRubricStore,
                           # usePaymentsStore, useMobileMenuStore, useInitializeStores
  firebase/                # firebaseClient.ts (app + auth), firestore.ts, loadFirestore.ts,
                           # storage.ts (browser); firebaseAdmin.ts (server)
  lib/
    server/                # requestAuth.ts (session verification), billing.ts (credits),
                           # testing/fakeAdminDb.ts (in-memory Firestore for tests)
    utils/                 # registry.ts (AI providers), date.ts, grade.ts,
                           # saveHistory.ts, responseParser.ts, textUtils.ts, etc.
    types/ constants/ hooks/
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
  user into `useAuthStore`. It never deletes the cookie while Firebase is still
  restoring a session, and publishes the uid (and lets `ClientProvider` render the
  app) only after the fresh cookie is written, so signed-in requests never run ahead
  of the server session. `useInitializeStores` then loads the Firestore profile
  into `useProfileStore`.
- **Grading flow:** `grader/Grader.tsx` (via `grader/streamGrade.ts`) calls the
  `generateGrade` server action, which verifies the session (`requireServerUser`),
  reads the balance, billing mode and BYO keys from the server profile
  (`lib/server/billing.ts`), resolves a model from the registry, streams text via
  `createStreamableValue`, and **debits credits on the server**. It returns the new
  balance, which the client mirrors with `useProfileStore.setCredits`, then persists
  a record with `saveDocument`. `correctGrammarAndSpelling` follows the same pattern.
  Actions never accept a uid, balance or billing mode from the client.
- **AI providers:** `registry.ts` registers `openai`, `fireworks`, `xai`,
  `anthropic`, `google`, `groq`, `azure`, and `openai-compatible`. Model IDs are
  `"provider:model"`. Users may supply their own OpenAI/Fireworks keys
  (`profile.useCredits === false`); otherwise platform keys + credits are used.
  A BYO flag only skips the debit when the request is for OpenAI or Fireworks and
  that provider's saved key is non-blank. Every other request is allowlisted and
  billed to platform credits. Grading reserves the estimate before the provider
  call and reconciles to measured usage when the stream finishes.
- **Plagiarism flow:** client → `POST /api/copyleaks/submit` (verifies the session
  matches the uid, requires `COPYLEAKS_WEBHOOK_SECRET` and `BASE_URL` before any
  debit, debits credits atomically, writes a `pending` report, submits to
  Copyleaks with `x-copyleaks-secret` in `statusHeaders`, and settles the report
  to `error` with a refund if submission fails) → Copyleaks calls
  `POST /api/copyleaks/webhook/[status]` (shared-secret header, fail closed when
  unset) → handler writes results to Firestore → report pages
  read them through SWR (`plagiarism/useJsonResource.ts`).
- **Payments flow:** `createPaymentIntent` fixes the amount to `CREDIT_PACK` and tags
  the intent with the buyer's uid; after Stripe redirects back, `completePayment`
  verifies ownership, status and amount, and records the payment (keyed by intent
  id) plus the credit grant in one transaction, so reloads never double-credit.
  `POST /api/stripe/webhook` grants the same pack for `payment_intent.succeeded`
  when `STRIPE_WEBHOOK_SECRET` is set, and returns 503 without granting when it
  is not. `recordInAppPurchase` refuses every call until a store receipt can be
  verified. New profiles and their starter balance are created by `ensureProfile`.
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


## Important commands

```bash
npm install            # install deps (respects .npmrc legacy-peer-deps)
npm run dev            # local dev server (Next + webpack)
npm run build          # production build — the primary correctness gate
npm run start          # serve a production build
npm run lint           # ESLint (flat config, eslint.config.mjs)
npm test               # Vitest unit tests, run-once (vitest run) — CI-safe
npm run test:rules     # firestore.rules + storage.rules in the emulators (needs Java 21)
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
- Unit tests run via **Vitest** with `npm test` (`vitest run`, run-once). They cover
  pure utilities (`src/lib/utils`, rubric libs) **and** the server trust boundaries:
  server actions and route handlers are tested with mocked `next/headers` /
  `firebase-admin` and the in-memory `lib/server/testing/fakeAdminDb.ts`
  (unauthenticated, forged, wrong-user and insufficient-credit denials, refunds,
  idempotent payment completion).
- There is **no component/e2e test setup** in the repo (no jsdom, React Testing
  Library, or Playwright dependency). Don't assume one exists. If a change needs browser/runtime
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

## UI conventions

- Use semantic token classes only (`bg-surface`, `bg-muted`, `text-muted-foreground`,
  `border-border`, `bg-primary`, `bg-accent`, …). No raw palette colors, hex values, or
  `dark:` overrides — tokens handle dark mode.
- Build pages as `<PageContainer><PageHeader …/>…</PageContainer>` (`ui/page-layout`); use
  `EmptyState`, `Skeleton`/`Spinner`, `Card`, `Button` (`loading`, `asChild`) rather than
  hand-rolled equivalents. AI feedback markdown goes inside `feedback-prose`; long legal
  text inside `legal-prose`.
- The shell owns header, mobile tab bar, footer and the single scrolling `<main>` (the
  document never scrolls — WebView-safe). Pages must not render their own header/footer
  or use `100vh` heights. Nav items live in `components/shell/nav.ts`.
- Open the sign-in dialog with `useAuthDialogStore.getState().setOpen(true)`; sign out
  with `signOutUser()` from `src/lib/auth/signOut.ts`.

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

- Browser Firebase access: `auth` from `@/firebase/firebaseClient`; Firestore via
  `loadFirestore()` from `@/firebase/loadFirestore` (required in anything the app
  shell imports) or `db` from `@/firebase/firestore` in route-only code; Storage
  from `@/firebase/storage`, imported on demand. Server/admin access uses `@/firebase/firebaseAdmin` (`adminDb`,
  `adminAuth`, `adminBucket`). Never import `firebaseAdmin` into client code.
- New backend logic belongs in a `"use server"` action under `src/actions` or a
  route handler under `src/app/api`. Route handlers are the right place for
  third-party webhooks and anything needing the admin SDK.
- Both Firebase modules wrap init in try/catch and export empty objects on failure
  (so `next build` doesn't crash without env vars). Don't assume they throw on
  misconfiguration at runtime.

## Route-protection guidance

- Protection is **server-side** via the Next.js proxy convention in `src/proxy.ts`
  (Next 16's renamed `middleware`; the file must `export async function proxy`). Its
  `config.matcher` covers the authenticated areas — `/grader`, `/rubrics`,
  `/assignments`, `/dashboard`, `/profile`, `/plagiarism-check` (and subpaths).
  Unauthenticated requests are redirected to `/` (where sign-in lives) and the
  stale cookie is cleared.
- Auth state is read from the Firebase **ID-token session cookie**
  (`NEXT_PUBLIC_COOKIE_NAME`, default `grademeAuthToken`). `useAuthToken` posts the
  ID token to `POST /api/session`, which verifies it and sets an HttpOnly cookie.
  The proxy checks structure and `exp` via `isSessionTokenActive`
  (`src/lib/utils/authToken.ts`), then verifies the RS256 signature against
  Google's Secure Token JWKS with Web Crypto (`src/lib/server/firebaseIdToken.ts`).
  Keep the expiry helper pure and Edge-safe (no Node APIs); it is unit-tested.
  A missing project id or a bad signature fails closed.
- The proxy is a server-side gate, not the data authorization layer. Data
  authorization is `firestore.rules` / `storage.rules`
  (owner-only trees; `credits`, profile creation, payments and plagiarism reports
  are server-only), tested by `npm run test:rules` (emulators, using
  `firebase.rules-test.json`) and deployed with
  `firebase deploy --only firestore:rules,storage --project grademe-999af`
  (`firebase.json`; it names the bucket because the project has no App Engine
  default bucket). Deploy rules only after the app code that needs them is live, plus
  server-side token verification in route handlers/actions. A new client write
  path needs a matching rule and rules test. When adding any
  data path or sensitive operation, verify the user server-side
  (`adminAuth.verifyIdToken`) rather than trusting a client-supplied `uid`.
- Server actions call `requireServerUser()` and route handlers call
  `requireMatchingUid()` (`src/lib/server/requestAuth.ts`); both verify the ID-token
  cookie with `adminAuth.verifyIdToken`. Every action that spends credits, reads BYO
  keys, or grants credits derives the uid from the session — never from arguments.
- To change which routes are protected, edit the `matcher` in `src/proxy.ts`. Keep
  API routes, Next internals, static assets, and public pages out of the matcher.

## State-management guidance

- Global state is Zustand (`src/zustand`). Stores call Firestore directly and keep
  a local mirror; follow that pattern (optimistic local `set` + awaited Firestore
  write, with `handleProfileError`-style logging). **Credits are the exception:**
  the server owns every debit and grant, and the client only mirrors the returned
  balance via `setCredits`. Client profile writes must never include `credits`
  (the rules reject them).
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
  id/string helpers), and a denial test for any new server action or route handler
  that touches user data or credits. Avoid importing modules with heavy import-time side effects
  (e.g. `registry.ts` instantiates AI providers from env at module load).
- The expected verification for every change is the canonical command:
  `npm run lint && npm test && npm run build` passes, plus a clear
  manual-verification note in the report when relevant.
- Introducing a component/e2e harness (jsdom/RTL/Playwright) is a larger,
  separate focused change — don't bolt it onto an unrelated fix.

## Files and systems requiring extra caution

- `src/actions/parseDocumentFromUrl.ts` — requires a session and an SSRF
  allowlist (`isOwnUploadUrl` in `lib/server/uploadUrl.ts`: HTTPS Firebase Storage,
  the configured bucket, the caller's own `uploads/{uid}/` path, 10 MB cap, no
  redirects). Never loosen it to a denylist. Parse failures throw (never return
  error text into the editor). `officeparser` is on v8 (`parseOffice(buffer)` →
  `ast.content`); `ast.toText()` and `parseOfficeAsync` are gone.
- `src/lib/utils/registry.ts` — provider/credentials wiring. Changing model IDs or
  provider names affects every grading call.
- `src/actions/generateResponse.ts` / `correctGrammarSpelling.ts` /
  `paymentActions.ts` and `src/lib/server/billing.ts` — credit estimation, debits
  and grants; user-facing billing impact. Keep debits transactional and server-side.
- `src/app/api/copyleaks/*` — external webhooks and admin-SDK writes; filename
  encodes `{uid}-{docId}` for webhook correlation. Keep that contract.
- `src/firebase/firebaseAdmin.ts` / `firebaseClient.ts` — env-driven init with
  swallowed errors.
- `package.json` / `package-lock.json` — `eslint`, `eslint-config-next`, and
  `eslint-plugin-react` are intentionally pinned; `officeparser` and `lucide-react`
  have had pin history. Don't bump these casually. `overrides` pin patched
  transitive versions (`@grpc/grpc-js`, `postcss-selector-parser`) and replace
  `argparse` (only mammoth's CLI uses it) to drop a vulnerable `sprintf-js`.
  The shadcn CLI is not installed; run `npx shadcn@latest add …` when adding a
  primitive.
- Secrets: `.env`, `.env.local`, `service_key.json` exist locally and are
  gitignored. Never commit them, never print their contents.
- React Native WebView branches (`window.ReactNativeWebView`) — don't break the
  mobile wrapper when changing layout/scroll/auth. Inside the wrapper never offer
  Google sign-in or credit purchases; gate them with `useIsReactNativeWebView()`
  (`null` until hydration, so they never flash).

## Git workflow expectations (main and dev)

- `main` is the **stable production branch**. `dev` is the **working branch**.
- Default workflow for agents: work on `dev`, commit to `dev`, push `origin/dev`.
- **Releases promote `dev` to `main` by fast-forward — no pull requests.** Only do
  this when a human asks to "promote dev to main" (or equivalent). Procedure:
  1. `git fetch origin` and confirm `dev` is clean and equals `origin/dev`.
  2. Confirm `main` is an ancestor of `dev`:
     `git merge-base --is-ancestor origin/main origin/dev`. If not (someone committed
     to `main` directly), stop and report — never merge, rebase, or force.
  3. Run the canonical check on `dev`: `npm run lint && npm test && npm run build`.
  4. `git push origin origin/dev:refs/heads/main` (a plain fast-forward push).
  5. Sync local `main`: `git fetch origin main:main`, then verify `dev`, `main`,
     `origin/dev`, `origin/main` all point to the same commit.
- Never commit directly to `main`; all changes land on `dev` first.
- Do not change git config, do not force-push, do not rewrite published history.
- Use Conventional Commit messages (e.g. `feat:`, `fix:`, `chore(deps):`,
  `docs:`), matching the existing history.

## Definition of done

A change is done when all of the following hold:

1. The stated task is fully implemented (no half-built feature left active).
2. `npm run lint && npm test && npm run build` passes with no new errors or
   warnings.
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
- A task would require committing directly to `main`, a non-fast-forward update of
  `main`, editing git config, or committing secrets. (Fast-forward promotion of
  `dev` to `main` on request is allowed — see the git workflow section.)
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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
