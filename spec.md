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
| Custom rubric builder | ✅ Working | Per-type criteria builders in `components/rubrics/criteriaBuilders`. |
| Favorite + relevance-sorted rubrics | ✅ Working | `useRubricStore.sortAndGroupRubrics`. |
| Grammar/spelling correction | ✅ Working | `correctGrammarAndSpelling`, chunked for long text. |
| Document upload + parsing | ✅ Working | DOCX/PDF/ODT/RTF/TXT; SSRF-guarded. |
| Plagiarism / AI-content detection | ✅ Working | Copyleaks submit + webhook + report pages. |
| Grading history ("assignments") | ✅ Working | `users/{uid}/summaries`. |
| Credit purchase (Stripe) | ✅ Working | PaymentIntent create/validate; credited on success. |
| Bring-your-own API key | ✅ Working | OpenAI/Fireworks keys in profile; `useCredits=false`. |
| Multi-method auth | ✅ Working | Google, email/password, email link. |
| `.docx` export | ✅ Working | `htmlToDocx` + `DownloadPopover`. |
| In-app guided tours | ⛔ Disabled **[inferred]** | All tour components return `null`; `react-joyride` not React 19 compatible. |
| Automated tests | ❌ None | No test runner or test files. |
| OpenAI-compatible provider | 🟡 Partial | Registered, but commented out in the model list. |

### Current user flows (as implemented)

- **Auth:** `useAuthToken` subscribes to Firebase auth, sets an ID-token cookie
  (refreshed every 50 min), mirrors the user into `useAuthStore`, then
  `useInitializeStores` loads `users/{uid}/profile/userData` into `useProfileStore`
  (creating it with starter credits on first sign-in).
- **Grade:** `Grader.tsx` → `generateGrade(...)` resolves a `provider:model` from
  the registry, estimates cost (+50% buffer), streams text, returns `creditsUsed`;
  client streams via `readStreamableValue`, deducts with `minusCredits`, and saves
  via `saveDocument`.
- **Plagiarism:** client → `POST /api/copyleaks/submit` (admin SDK validates
  credits, writes a `pending` report, submits base64 text to Copyleaks with a
  webhook) → Copyleaks → `POST /api/copyleaks/webhook/[status]` writes results →
  report pages render them. Filenames encode `{uid}-{docId}` for correlation.
- **Payments:** checkout page creates a PaymentIntent (`createPaymentIntent`),
  confirms client-side, and the success page validates (`validatePaymentIntent`)
  and adds credits, guarding against double-credit.

### Existing integrations

- **Firebase** — Auth, Firestore, Storage (client SDK + `firebase-admin`).
- **AI providers** via Vercel AI SDK registry — OpenAI, Fireworks, xAI, Anthropic,
  Google, Groq, Azure OpenAI, and a generic OpenAI-compatible endpoint.
- **Stripe** — credit purchases (PaymentIntents).
- **Copyleaks** — plagiarism and AI-generated-content detection (async webhooks).
- **React Native WebView** — the web app runs inside a mobile wrapper.

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
- Spellcheck dictionaries (`.aff`/`.dic`) are bundled through a `raw-loader`
  webpack rule.

### Known limitations

- **[inferred] Grading credit deduction is client-side.** `generateGrade` returns
  `creditsUsed`, but `minusCredits` runs in the browser after streaming. A
  determined client could stream feedback without a reliable server-side debit.
  Server-authoritative metering is the biggest integrity gap.
- **[inferred] Plagiarism credits are checked server-side but debited
  client-side.** `/api/copyleaks/submit` verifies sufficient credits but does not
  deduct; the client calls `minusCredits` afterward, so the debit can be skipped.
- **[inferred] No Copyleaks webhook authentication.** `webhook/[status]` trusts any
  POST and writes to Firestore based on the filename-encoded `uid/docId`.
- **Route protection is server-side but not full authorization.** `src/proxy.ts`
  gates the authenticated routes by validating the session cookie's structure and
  expiry, but does not verify the token signature, and there is still no Firestore
  rules file in the repo. Data safety for direct Firestore/API access depends on
  console-configured rules plus server-side token verification in handlers/actions
  (which still trust a client-supplied `uid` in places).
- **[inferred] Model list is stale.** `src/lib/types/models.ts` lists older models
  (gpt-4o, claude-3-5, gemini-1.5, grok-beta) despite current AI SDKs.
- **[inferred] Inconsistent starter-credit defaults** across `useAuthStore` (1000),
  `useProfileStore` default (0), and `createNewProfile` (1000).
- **[inferred] Output-token cost estimate is a fixed guess** (1000 tokens; see the
  in-code `TODO`), so pre-flight credit checks are rough.
- Tours are disabled; no onboarding currently runs.
- No automated tests; only lint + build gate changes.
- `parsed_output.txt` in the repo root is a leftover `pdf2json` debug artifact.

---

## 3. Product roadmap

Ordered by product impact and dependency order. Each item is sized for a single
focused, PR-sized change (one clean commit sequence) and is product-oriented, not a
QA backlog. Acceptance criteria assume the canonical gate (`npm run lint &&
npm run build`) passes.

### M1 — Trustworthy, server-authoritative credit metering

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

### M2 — Authenticate the Copyleaks webhook and harden report writes

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

### M7 — Resilient document upload feedback

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
