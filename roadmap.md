# Grade.me — Roadmap

Punchlist of next steps, known bugs, and open issues as of 2026-10-28.
What the product does today is [`spec.md`](./spec.md). Setup is [`README.md`](./README.md).

Each item should stay small enough for one review. The gate is
`npm run lint && npm test && npm run typecheck && npm run build`.

## Shipped

- **Server-authoritative credits.** Grading, grammar correction, and plagiarism
  scans debit on the server. Stripe grants the pack once per PaymentIntent, from
  `completePayment` and from `POST /api/stripe/webhook` when
  `STRIPE_WEBHOOK_SECRET` is set. Clients cannot write `credits`.
- **Copyleaks callbacks.** `x-copyleaks-secret` is required in every environment.
  A failed submit and a later error callback cannot refund twice.
- **HttpOnly session cookie** plus RS256 verification in the proxy.
- **Plagiarism scan dialog** shows and counts the essay's words, not editor HTML.
- **In-app purchases** do not grant credits.

## Next

### 1. Plagiarism result UX

After a scan, the report page should move from pending to completed or error
without a manual refresh, show similarity and the AI-detection signal, and
explain insufficient-credit and submission failures. The completed webhook
currently stores `results` only, so an AI-content percentage is not available
to the page until that payload is kept.

### 2. Credit model

Starter credits disagree: `useAuthStore` defaults to 1000, `useProfileStore`
defaults to 0, and new profiles are created with 1000. The pre-flight grade
estimate still assumes 1000 output tokens. Show an estimate before a grade the
way the scan dialog already shows one, and use one documented starter balance.

### 3. Upload failure messages

`parseDocumentFromUrl` throws on an unsupported type, an oversized file, a
blocked URL, and a parse failure. The grader shows a generic toast because
production hides server-action error text. Each failure should say what to do
next. Supported formats in the UI are DOCX, PDF, ODT, RTF, and TXT, parsed by
`mammoth` (DOCX) and `officeparser` (PDF, ODT, RTF).

### 4. First-run grade

There is no onboarding beyond the first-sign-in identity dialog. A dismissible,
per-user prompt with sample text and a preselected rubric should get a new
account to a first grade without blocking returning users.

### 5. Shareable rubrics

Let an educator export a custom rubric and let another account import it into
`custom_rubrics`, reusing the existing copy and validation paths.

### 6. Model catalog

Do not change model IDs until a human asks. The list is intentionally
`openai:gpt-6-sol` and `anthropic:claude-sonnet-5` because credits use one flat
per-token rate. Fireworks and Groq have no listed model, so a saved Fireworks
key is unused. Grok 4.7 stays off the list until the platform xAI key works
again (it was reported disabled on 2026-10-22). The selector should only offer
providers `isProviderEnabled` reports as configured.

## Known bugs and open issues

- **Firebase client packages declare Node `>=24.12.0`.** CI and local development
  use Node 22. `npm install` warns `EBADENGINE` for `@firebase/app`,
  `@firebase/auth`, `@firebase/firestore`, `@firebase/storage`, and
  `@firebase/ai`. The app still installs and builds. Moving CI to Node 24 is a
  separate decision.
- **TypeScript 7 is not usable yet.** `typescript-eslint` (via
  `eslint-config-next`) rejects TypeScript 7.0. The app stays on TypeScript 6.0.3.
- **`jwks-rsa@4` needs `jose@5.10.0`.** `firebase-admin` 14 depends on
  `jwks-rsa` 4, which asks for `jose` 6. The `jose@5.10.0` override is what lets
  `require('firebase-admin/auth')` load. Do not drop it.
- **`.env.example` used to name `XAI_API_URL`.** The registry reads
  `XAI_BASE_URL`. Production should use that name. `XAI_API_URL` is not read.
- **`NEXT_PUBLIC_CREDITS_PER_GRADING` is unused** by application code. It is still
  listed in `.env.example` and CI. Grading cost is computed on the server from
  `CREDITS_PER_INPUT_TOKEN`, `CREDITS_PER_OUTPUT_TOKEN`, and `CREDITS_PER_DOLLAR`.
- **Matched-source links are not allowlisted.** Report pages render Copyleaks
  URLs. A `javascript:` URL in that payload is not confirmed as exploitable and
  is not stripped.
- **`officeparser` dynamic `require`.** Production builds warn about
  `moduleLoader.js`. Parsing still works.
- **Document parsers.** There is no demonstrated zip-bomb bound in `mammoth` or
  `officeparser` beyond the 10 MB upload cap.
- **No component or browser tests.** Coverage is Vitest in the Node environment.
- **A paid Copyleaks round trip has not been run** against the header-secret
  webhook. Scans stay pending if `COPYLEAKS_WEBHOOK_SECRET`, `BASE_URL`,
  `COPYLEAKS_EMAIL`, or `COPYLEAKS_API_KEY` is unset (the route returns 503 and
  does not debit).
- **Stripe webhook grants need `STRIPE_WEBHOOK_SECRET`.** Without it the route
  returns 503. Browser checkout can still grant the pack through
  `completePayment`.
- **Lint warnings left in place:** `window.location.assign` on the email-link
  finish page, and unused locals in `Grader.tsx`.
