# Grade.me — Product Specification

What **Grade.me** (`grademeapp`) is and what it does today. Next steps, known bugs,
and open issues are in [`roadmap.md`](./roadmap.md). Agent workflow is
[`AGENTS.md`](./AGENTS.md). Setup is [`README.md`](./README.md).

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
| Automated tests | 🟡 Limited | Vitest covers utilities and server trust boundaries (auth, billing, webhooks). No component or browser harness. |
| OpenAI-compatible provider | 🟡 Partial | Registered, but commented out in the model list. |

### Current user flows (as implemented)

- **Auth:** `useAuthToken` subscribes to Firebase auth and posts the ID token to
  `POST /api/session`, which verifies it and sets an HttpOnly cookie (refreshed
  every 50 min). The uid is published to `useAuthStore` only after that cookie
  write succeeds. `useInitializeStores` then loads `users/{uid}/profile/userData`
  into `useProfileStore` (creating it with starter credits on first sign-in).
  `src/proxy.ts` checks expiry and the Firebase RS256 signature before protected
  pages render.
- **Grade:** `grader/Grader.tsx` → `generateGrade(...)` verifies the session, reads
  the balance, billing mode, and BYO keys server-side, and bills platform credits
  unless the request is OpenAI or Fireworks with a non-blank saved key. It reserves
  the estimate before the provider call, streams text, then reconciles to measured
  usage. The client mirrors the reservation and reloads the profile when the stream
  finishes. Grammar correction uses the same billing rules.
- **Plagiarism:** the scan dialog shows plain text (editor HTML is stripped before
  display, word count, and submit). `POST /api/copyleaks/submit` verifies the
  session uid, refuses the scan with 503 before any debit when
  `COPYLEAKS_WEBHOOK_SECRET` or `BASE_URL` is unset, debits credits, writes a
  `pending` report, and submits base64 text. A failed submit settles that report
  to `error` and refunds once. Copyleaks calls
  `POST /api/copyleaks/webhook/[status]` with `x-copyleaks-secret`. Report pages
  poll while a scan is pending. Filenames encode `{uid}-{docId}` for correlation.
- **Payments:** checkout creates a PaymentIntent for the fixed credit pack, tagged
  with the buyer's uid. The success page calls `completePayment`, and
  `POST /api/stripe/webhook` grants the same pack for a signed
  `payment_intent.succeeded` when `STRIPE_WEBHOOK_SECRET` is set (503 and no grant
  when it is not). Grants are once per intent. `recordInAppPurchase` does not
  grant credits.

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

- **Security rules live in the repo and are deployed.** `firestore.rules` and
  `storage.rules` were deployed to `grademe-999af` on 2026-10-22. Before that,
  production let a signed-in user change their own credits; after deploy, a client
  credit write returns `PERMISSION_DENIED` while owner edits, history and uploads
  still work. Redeploy after any rules change with
  `firebase deploy --only firestore:rules,storage --project grademe-999af`
  (`firebase.json` names the bucket because the project has no App Engine default).
- **In-app purchases are refused.** `recordInAppPurchase` does not grant credits
  until a store receipt can be verified. The profile page no longer listens for
  wrapper purchase messages. Stripe pack grants also run from
  `POST /api/stripe/webhook` when `STRIPE_WEBHOOK_SECRET` is set; without it the
  route returns 503 and the browser `completePayment` path still grants the pack.
- **Copyleaks callbacks require `COPYLEAKS_WEBHOOK_SECRET`.** Submit sends it as
  the `x-copyleaks-secret` status header and refuses the scan (503, no debit)
  when that secret or `BASE_URL` is unset. Unsigned callbacks are rejected in
  every environment.
- **Route protection verifies the session cookie.** `src/proxy.ts` checks expiry
  and the Firebase RS256 signature. Data authorization still lives in the
  actions and handlers (`src/lib/server/requestAuth.ts`).
- Listed models are `openai:gpt-6-sol` (default) and `anthropic:claude-sonnet-5`.
  Credits use one flat per-token rate, so the catalog stays on mid/fast tiers.
- Bring-your-own keys apply only to OpenAI and Fireworks, and only when the saved
  key is non-blank. Other providers always use platform keys and credits.
- Storage uploads are limited to document content types in `storage.rules`. Deploy
  rule changes separately; this app does not deploy them.
- The open punchlist (billing consistency, plagiarism result UX, model catalog,
  onboarding, upload messages, shareable rubrics, and known bugs) is
  [`roadmap.md`](./roadmap.md).

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

## 3. What comes next

Server-authoritative credit metering and Copyleaks callback authentication are
already shipped. The ordered punchlist, known bugs, and open issues are in
[`roadmap.md`](./roadmap.md).
