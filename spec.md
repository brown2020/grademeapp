# Grade.me — Product Specification

Authoritative product spec and roadmap for **Grade.me** (`grademeapp`). This is the
single source of truth for what the product is, what it does today, and what to
build next. For agent/contributor workflow and engineering conventions, see
[`AGENTS.md`](./AGENTS.md). For setup instructions, see [`README.md`](./README.md).

Conclusions drawn from reading the code (rather than from prior docs) are marked
**[inferred]**.

---

## 1. Product overview

### Product promise

Give writers fast, specific, rubric-aligned feedback on a draft so they can improve
it *before* they submit it. The letter/percentage grade orients the writer; the
real value is the structured explanation, the quoted evidence from their own text,
and concrete suggestions for improvement — delivered in seconds and streamed live.

### Target users

- **Students** self-checking essays against an assignment's expectations.
- **Educators** producing consistent, rubric-based feedback at scale and authoring
  reusable rubrics.
- **Independent writers** who want structured critique on demand.

The grading prompt is parameterized by writer identity and level (e.g. a 9th-grade
student), assignment type, topic, audience, and word limit, so feedback is
calibrated to the writer rather than generic.

### Core workflows

1. **Sign in** (Google, email/password, or passwordless email link).
2. **Compose or upload** an essay (type/paste in the TipTap editor, or upload
   DOCX/PDF/ODT/RTF/TXT).
3. **Configure the assignment** (identity, level, topic, audience, word limit,
   text type) and **pick or build a rubric**.
4. **Grade** — receive a streamed grade + rubric-aligned feedback; it is saved to
   history.
5. **Iterate** — apply grammar/spelling correction, re-grade, run a plagiarism /
   AI-content check, and export to `.docx`.
6. **Manage credits** — buy credits via Stripe, or bring your own API key.

### Product goals

- Make the first grade fast and obviously useful (low time-to-value).
- Make feedback trustworthy: rubric-aligned, evidence-quoted, improvement-focused.
- Make rubrics reusable and shareable so feedback is consistent.
- Keep billing transparent and predictable (credits map to real model cost).
- Work equally well on mobile (including the React Native WebView wrapper).

---

## 2. Current application state

### What the app currently does

A logged-in user can grade an essay against a rubric and get streamed AI feedback
with a percentage grade, correct grammar/spelling, upload documents for grading,
run a Copyleaks plagiarism/AI-detection scan, review past gradings, build and
favorite custom rubrics, buy credits with Stripe (or use their own API key), and
export results to `.docx`.

### Current feature inventory

| Area | Status | Notes |
|---|---|---|
| AI grading (streamed) | ✅ Working | `generateGrade` server action + `readStreamableValue`. |
| Rubric library (~13 types) | ✅ Working | `src/lib/constants/rubrics.json`. |
| Custom rubric builder | ✅ Working | One schema-driven builder (`components/rubrics/builder`, config in `rubrics/lib/rubricTypeConfig.ts`); stored shapes per type unchanged. |
| Favorite + relevance-sorted rubrics | ✅ Working | `useRubricStore.sortAndGroupRubrics`. |
| Grammar/spelling correction | ✅ Working | `correctGrammarAndSpelling`, chunked for long text. |
| Document upload + parsing | ✅ Working | DOCX/PDF/ODT/RTF/TXT up to 10 MB; parses only the caller's own Storage upload. Modern PDFs (cross-reference streams) failed before 2026-10-22. |
| Plagiarism / AI-content detection | ✅ Working | Copyleaks submit + webhook + report pages. |
| Grading history ("assignments") | ✅ Working | `users/{uid}/summaries`. |
| Credit purchase (Stripe) | ✅ Working | PaymentIntent create/validate; credited on success. |
| Bring-your-own API key | ✅ Working | OpenAI/Fireworks keys in profile; `useCredits=false`. |
| Multi-method auth | ✅ Working | Google, email/password, email link. |
| `.docx` export | ✅ Working | `htmlToDocx` + `DownloadPopover`. |
| In-app guided tours | ⛔ Removed | Dormant `react-joyride` stubs deleted in the 2026-09 redesign. |
| Automated tests | 🟡 Limited | Vitest covers pure utility logic under `src/lib/utils`; no component/e2e harness. |
| OpenAI-compatible provider | 🟡 Partial | Registered, but commented out in the model list. |

### Current user flows (as implemented)

- **Auth:** `useAuthToken` subscribes to Firebase auth, sets an ID-token cookie
  (refreshed every 50 min), and publishes the user to `useAuthStore` only after the
  cookie is written, so the first server requests after a page load are always
  authenticated. `useInitializeStores` then loads `users/{uid}/profile/userData`
  into `useProfileStore` (creating it with starter credits on first sign-in).
- **Grade:** `grader/Grader.tsx` → `generateGrade(...)` verifies the session, reads
  the balance/billing mode/BYO keys server-side, resolves a `provider:model` from the
  registry, rejects short balances before calling the model, streams text, and
  debits the actual cost on the server; the client mirrors the returned balance and
  saves via `saveDocument`. Grammar correction works the same way.
- **Plagiarism:** client → `POST /api/copyleaks/submit` (verifies the session uid,
  debits credits atomically, writes a `pending` report, submits base64 text to
  Copyleaks, refunds on failure) → Copyleaks → `POST /api/copyleaks/webhook/[status]`
  (HMAC-verified) settles the pending report once (completed, or error with a
  credit refund) → report pages render it, polling while pending.
  Filenames encode `{uid}-{docId}` for correlation.
- **Payments:** checkout creates a PaymentIntent for the fixed credit pack, tagged
  with the buyer's uid; the success page calls `completePayment`, which verifies
  ownership, status and amount and grants the credits once per intent in a
  transaction (safe across reloads and retries).

### Existing integrations

- **Firebase** — Auth, Firestore, Storage (client SDK + `firebase-admin`).
- **AI providers** via Vercel AI SDK registry — OpenAI, Fireworks, xAI, Anthropic,
  Google, Groq, Azure OpenAI, and a generic OpenAI-compatible endpoint.
- **Stripe** — credit purchases (PaymentIntents).
- **Copyleaks** — plagiarism and AI-generated-content detection (async webhooks).
- **React Native WebView** — the web app runs inside a mobile wrapper. Inside it the
  site offers neither Google sign-in nor credit purchases (`useIsReactNativeWebView`).

### Current architecture summary

Single Next.js 16 App Router app, client-heavy (Firebase client auth + Zustand),
with server work in `"use server"` actions and `src/app/api` route handlers.
Firestore is the database, keyed under `users/{uid}` with `profile`, `summaries`,
`custom_rubrics`, and `plagiarism_reports` subcollections. See
[`AGENTS.md`](./AGENTS.md) for the detailed module map and data model.

### Existing technical constraints

- **Bundler is Webpack**, pinned via `--webpack` (not Turbopack).
- **Strict TypeScript**, and the build fails on type errors
  (`ignoreBuildErrors: false`). ESLint flat config enforces
  `react-hooks/set-state-in-effect: error`.
- **npm only** (`package-lock.json`), with `legacy-peer-deps=true`.
- `eslint*` packages are intentionally pinned; `officeparser`/`lucide-react` have
  pin history.
- Must remain React Native WebView-safe.
- Spellcheck dictionaries (`.aff`/`.dic`) are static files in `public/dictionaries`,
  fetched with `nspell` after the editor mounts; keep them out of the JS bundle.
- The shell (layout, header, auth, profile/payments stores) must not import
  `firebase/firestore` or `firebase/storage` statically; use `loadFirestore()` so
  the signed-out landing page ships no Firestore code.

### Known limitations

- **Repo security rules are not deployed yet.** `firestore.rules` and
  `storage.rules` lock `credits` and other server-owned data and pass the emulator
  suite, but production still runs console rules that let a signed-in user change
  their own `profile/userData.credits` (confirmed 2026-10-21 with a +1 probe that
  was reverted; cross-user access is denied). Deploy with
  `firebase deploy --only firestore:rules,storage --project grademe-999af`.
- **Unused in-app purchase path is still callable.** The wrapper no longer starts
  purchases, but the `recordInAppPurchase` server action still grants a pack per
  unseen transaction id without App Store / Play receipt verification, so a
  crafted call can grant credits. Remove it (and the profile page listener).
- **Webhook signatures are optional outside production.** Without
  `COPYLEAKS_WEBHOOK_SECRET` the handler accepts unsigned callbacks in development;
  production fails closed.
- **Route protection in `src/proxy.ts` is a gate, not authorization.** It checks
  the session cookie's structure and expiry only; authorization lives in the
  actions/handlers (`src/lib/server/requestAuth.ts`).
- **Credits use one flat per-token rate for every model** (`generateResponse.ts`), so
  `src/lib/types/models.ts` is limited to mid/fast tiers; adding premium models needs
  per-model pricing first.
- **Fireworks/Groq have no listed models** since Llama was removed, so a saved
  Fireworks BYO key is currently unused.
- **[inferred] Inconsistent starter-credit defaults** across `useAuthStore` (1000),
  `useProfileStore` default (0), and `createNewProfile` (1000).
- **[inferred] Output-token cost estimate is a fixed guess** (1000 tokens; see the
  in-code `TODO`), so pre-flight credit checks are rough.
- **AI-content % is not stored.** The Copyleaks completed webhook saves `results`
  only, so the report page cannot show an AI-detection score.
- Tours were removed; no onboarding currently runs beyond the first-sign-in identity dialog.
- Automated tests cover pure utilities and the server trust boundaries (actions and
  route handlers with an in-memory Firestore fake); there is no component or
  end-to-end harness in the repo.

### Performance budget

Budgets recorded 2026-06-06, before measuring. Checked against a local production
build (`npm run build && npm run start`) on a developer laptop; field data is out of
scope. "Initial JavaScript" is the scripts referenced by the route's server HTML
(lazy chunks and `Link` prefetches excluded).

| Item | Budget | Measured 2026-06-06 |
| --- | --- | --- |
| `/` server response (warm, local) | median ≤ 200 ms over 10 requests | 6 ms |
| `/` initial JavaScript, compressed | ≤ 350 KB | 256 KB (was 406 KB) |
| `/grader` initial JavaScript, compressed | ≤ 600 KB (editor, Firebase and Stripe are inherently heavy) | 451 KB (was 833 KB) |
| Server-only SDKs in client chunks | none: `firebase-admin`, `stripe` (Node), `@ai-sdk/*` providers, `mammoth`, `officeparser` | none |
| Grading requests per submit | exactly one `generateGrade` call; duplicate submits are ignored while one is in flight | 1 request for 3 clicks |

---

## 3. Product roadmap

Ordered by product impact and dependency order. Each item is sized for a single
focused, PR-sized change (one clean commit sequence) and is product-oriented, not a
QA backlog. Acceptance criteria assume the canonical gate (`npm run lint &&
npm test && npm run build`) passes.

### M1 — Trustworthy, server-authoritative credit metering — **Done (2026-10-21)**

Grading, grammar correction and plagiarism scans now debit on the server, payments
grant credits once per intent on the server, and clients only mirror the balance.
Clients can no longer write `credits` (repo rules, emulator-tested); profiles
are created server-side. Remaining billing-integrity work (deploying those rules,
IAP receipt verification) is tracked under Known limitations.

**User value:** users are billed accurately and fairly; the business stops leaking
paid usage. This underpins every paid workflow, so it comes first.

**Implementation intent:** make the server the source of truth for debits. Have the
grading path debit credits server-side against `users/{uid}/profile/userData` using
the actual usage returned by the model (the value already computed as `creditsUsed`)
via the admin SDK, and have the client reflect the resulting balance instead of
performing the debit. Apply the same pattern to `/api/copyleaks/submit` so the
plagiarism scan debits server-side at submit time.

**Acceptance criteria:**
- Grading and plagiarism debits are written server-side; the client no longer needs
  `minusCredits` to make billing correct.
- A request with insufficient credits is rejected server-side before any
  model/Copyleaks call.
- Balances shown in the UI match Firestore after a grade and after a scan.

### M2 — Authenticate the Copyleaks webhook and harden report writes — **Done**

HMAC signature verification (fail-closed in production) is in place. Callbacks
resolve the report from `developerPayload` (`uid/docId`, falling back to the
filename), settle it in a transaction only while it is `pending`, and refund the
scan's credits on `error`; unknown reports are acknowledged without writes. Covered
by `webhook/[status]/route.test.ts`. A live Copyleaks round trip (paid) has not been
run against these changes.

**User value:** users' plagiarism reports can't be spoofed or corrupted by forged
callbacks; results they see are trustworthy.

**Implementation intent:** verify inbound webhooks (shared-secret path segment or
Copyleaks signature) before writing, and confirm the `uid/docId` resolves to an
existing `pending` report owned by that user before updating it. Reject and log
anything else.

**Acceptance criteria:**
- Unauthenticated/forged webhook POSTs are rejected (4xx) and write nothing.
- Valid completion/error callbacks update only the matching pending report.
- Manual-verification steps documented (no automated test infra required).

### M3 — Reliable plagiarism status and result UX

**User value:** after submitting a scan, users get clear, automatic progress and a
readable result instead of a static "being generated" message.

**Implementation intent:** surface the `pending → completed/error` lifecycle on the
report page by subscribing to the report document, and present a focused result
summary (overall similarity + AI-detection signal) with graceful empty/error
states. No polling hacks.

**Acceptance criteria:**
- Report page transitions from pending to completed/error without a manual refresh.
- Completed reports show similarity and AI-detection results clearly; errors show a
  retry path.
- Insufficient-credit and submission failures are explained in-product.

### M4 — Refresh the model catalog and provider selection

**User value:** users grade with current, higher-quality models; feedback quality
and speed improve immediately.

**Implementation intent:** update `src/lib/types/models.ts` to current models per
enabled provider, ensure `ModelSelector` only offers providers that
`isProviderEnabled` reports as configured, and pick a sensible default. Keep the
`provider:model` contract intact.

**Acceptance criteria:**
- Only configured providers/models appear in the selector.
- A clearly-labeled default model is preselected.
- Grading succeeds end-to-end with the new default.

### M5 — First-run activation: a working onboarding moment

**User value:** new users reach their first useful grade quickly, which is the core
activation event.

**Implementation intent:** replace the dormant `react-joyride` tours with a
lightweight, React-19-compatible first-run experience (e.g. a dismissible,
persisted "grade your first essay" prompt with sample text and a preselected rubric
on the grader). Remove or clearly retire the dead tour components so there is one
onboarding path.

**Acceptance criteria:**
- A first-time user is guided to produce a grade with minimal input.
- The onboarding state persists per user and never blocks returning users.
- No disabled/`null` tour components remain wired into pages.

### M6 — Consistent, transparent credit model

**User value:** users understand what an action costs and start with a correct,
predictable balance; trust in billing increases.

**Implementation intent:** unify the starter-credit defaults across the auth store,
profile default, and `createNewProfile` to one documented value, and show an
estimated credit cost before grading and before a plagiarism scan (reusing the
existing estimation math). Remove the dead `useCredits` branch in
`generateResponse.ts`.

**Acceptance criteria:**
- New accounts always start with the same documented credit balance.
- The user sees an estimated cost before confirming a grade or a scan.
- No dead credit-branch code remains.

### M7 — Resilient document upload feedback — **Partly done**

The parser now throws on unsupported types, oversized files and parse failures
(the grader shows a toast) instead of loading error text into the editor, and the
allowlist is covered by `uploadUrl.test.ts`. Still open: specific per-failure
messages in the UI (production masks server-action error text).

**User value:** users who upload a file always know whether it worked and why,
instead of getting silent failures or an unparsed essay.

**Implementation intent:** surface parse outcomes from `parseDocumentFromUrl`
(unsupported type, blocked URL, parse failure) as clear in-product messages, and
confirm the supported-format list in the UI matches what the parser actually
handles. Keep the SSRF guard intact.

**Acceptance criteria:**
- Each failure mode shows a specific, actionable message.
- Supported formats advertised in the UI match parser behavior.
- The SSRF guard remains and is exercised by the allowed-URL path.

### M8 — Shareable rubrics

**User value:** educators can reuse and distribute a rubric to students/peers,
making feedback consistent across a class — a natural extension of the existing
custom-rubric system.

**Implementation intent:** allow exporting a custom rubric and importing/copying it
into another account (e.g. via a shareable link or export/import payload),
reusing the existing `copyDefaultRubric`/`addCustomRubric` paths and rubric type
validation.

**Acceptance criteria:**
- A user can produce a shareable artifact/link for a custom rubric.
- A recipient can import it into their own `custom_rubrics` with validation.
- Imported rubrics behave identically to natively created ones.

> Roadmap note: items M1–M3 protect revenue and trust and should land first; M4–M7
> raise core-workflow quality, performance, and activation; M8 extends an existing
> capability into clear new user value. None introduce a product direction
> unsupported by the current app.
