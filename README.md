# Grade.me

AI-powered writing feedback for students, educators, and writers. Submit an essay (typed, pasted, or uploaded), pick or build a rubric, and get a streamed grade with rubric-aligned feedback. Live at [https://grade.me](https://grade.me).

Product behavior is [`spec.md`](./spec.md). Next steps and known issues are [`roadmap.md`](./roadmap.md). Agent conventions are [`AGENTS.md`](./AGENTS.md).

## Features

- Streamed AI grading with rubric-aligned feedback and a percentage grade
- Rubric library (built-in types plus a custom builder), favorites, and relevance sorting
- TipTap editor with grammar and spelling correction (`nspell` and dictionaries in `public/dictionaries`)
- Document upload: DOCX (`mammoth`), PDF, ODT, and RTF (`officeparser`), TXT
- Plagiarism and AI-content scans via Copyleaks (plain-text dialog, async webhook, report pages)
- Grading history (“assignments”) with per-submission detail
- Credits via Stripe PaymentIntents, plus a signed Stripe webhook when configured
- Bring-your-own OpenAI or Fireworks key (any other provider bills platform credits)
- Firebase auth: Google, email/password, and passwordless email link, with an HttpOnly session cookie
- DOCX export of feedback and the document
- React Native WebView embed (no Google sign-in and no credit purchase inside the wrapper)

## Tech stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router, Webpack via `--webpack`) |
| UI | React 19, Tailwind CSS 4, Radix primitives, TipTap 3 |
| Language | TypeScript 6 |
| State | Zustand 5 |
| Backend | Firebase 13 and `firebase-admin` 14 (Auth, Firestore, Storage) |
| AI | Vercel AI SDK (`ai` 7 and `@ai-sdk/*` for OpenAI, Anthropic, Google, Azure, xAI, and RSC streaming) |
| Payments | Stripe 23 and `@stripe/react-stripe-js` |
| Documents | `mammoth`, `officeparser`, `docx` |
| Plagiarism | Copyleaks REST API through route handlers |
| Tests | Vitest 5, ESLint 10 |

`firebase-admin` 14 pulls `jwks-rsa` 4. `package.json` overrides that package's `jose` dependency to `5.10.0` so `require('firebase-admin/auth')` loads.

## Project structure

```
src/
  app/                     # App Router pages and API routes
    api/copyleaks/         # submit, webhook/[status], reports
    api/session/           # HttpOnly session cookie
    api/stripe/webhook/    # signed credit-pack grants
    grader/ rubrics/ assignments/ dashboard/ profile/
    plagiarism-check/ payment-*/ loginfinish/ support/ terms/ privacy/
  actions/                 # Server actions: grading, grammar, uploads, payments, docx
  components/              # shell, auth, grader, editor, rubrics, history, plagiarism, payments, ui
  zustand/                 # Auth, profile, rubrics, payments
  firebase/                # Client and Admin SDK
  lib/                     # AI registry, rubrics, hooks, server billing and auth
  proxy.ts                 # Route protection (expiry + Firebase RS256)
```

## Getting started

### Prerequisites

- Node.js 22 (CI uses 22; some Firebase client packages warn that they prefer Node 24)
- npm (`.npmrc` sets `legacy-peer-deps=true`)
- A Firebase project with Auth, Firestore, and Storage
- A Stripe account for credit purchases
- Optional: Copyleaks, and provider API keys for the models you enable

### Install

```bash
git clone https://github.com/brown2020/grademeapp.git
cd grademeapp
cp .env.example .env.local
npm ci
npm run dev
```

Fill `.env.local` from the names below. Never commit real values.

Open [http://localhost:3000](http://localhost:3000).

## Environment variable names

Names only. Values belong in `.env.local`, the host, or GitHub Actions secrets.

### Required for a signed-in app

| Name | Purpose |
| --- | --- |
| `FIREBASE_TYPE` | Admin service-account field |
| `FIREBASE_PROJECT_ID` | Admin project id |
| `FIREBASE_PRIVATE_KEY_ID` | Admin key id |
| `FIREBASE_PRIVATE_KEY` | Admin private key |
| `FIREBASE_CLIENT_EMAIL` | Admin client email |
| `FIREBASE_CLIENT_ID` | Admin client id |
| `FIREBASE_AUTH_URI` | Admin auth URI |
| `FIREBASE_TOKEN_URI` | Admin token URI |
| `FIREBASE_AUTH_PROVIDER_X509_CERT_URL` | Admin cert URL |
| `FIREBASE_CLIENT_CERTS_URL` | Admin client certs URL |
| `FIREBASE_UNIVERSE_DOMAIN` | Admin universe domain |
| `NEXT_PUBLIC_FIREBASE_APIKEY` | Client Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTHDOMAIN` | Client auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECTID` | Client project id (also the proxy token audience) |
| `NEXT_PUBLIC_FIREBASE_STORAGEBUCKET` | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID` | Client sender id |
| `NEXT_PUBLIC_FIREBASE_APPID` | Client app id |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENTID` | Analytics measurement id |
| `NEXT_PUBLIC_COOKIE_NAME` | Session cookie name (default `grademeAuthToken`) |

### Payments

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret. Unset: `POST /api/stripe/webhook` returns 503 and grants nothing |
| `NEXT_PUBLIC_STRIPE_PRODUCT_NAME` | Label stored on the PaymentIntent |

### AI providers

| Name | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Platform OpenAI key |
| `FIREWORKS_API_KEY` | Platform Fireworks key |
| `ANTHROPIC_API_KEY` | Anthropic |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google |
| `GROQ_API_KEY` | Groq |
| `XAI_API_KEY` | xAI |
| `XAI_BASE_URL` | xAI base URL override (this is the name the registry reads) |
| `AZURE_API_KEY` | Azure OpenAI |
| `AZURE_RESOURCE_NAME` | Azure resource |
| `OPENAI_COMPATIBLE_API_KEY` | OpenAI-compatible endpoint |
| `OPENAI_COMPATIBLE_API_BASE_URL` | OpenAI-compatible base URL |
| `NEXT_PUBLIC_OPENAI_COMPATIBLE_MODEL` | Model id for that endpoint |
| `CREDITS_PER_INPUT_TOKEN` | Server credit rate (default used when unset) |
| `CREDITS_PER_OUTPUT_TOKEN` | Server credit rate |
| `CREDITS_PER_DOLLAR` | Credits per dollar |

### Plagiarism

All four must be set or a scan returns 503 and is not charged.

| Name | Purpose |
| --- | --- |
| `COPYLEAKS_EMAIL` | Copyleaks account email |
| `COPYLEAKS_API_KEY` | Copyleaks API key |
| `COPYLEAKS_WEBHOOK_SECRET` | Shared secret echoed as `x-copyleaks-secret` |
| `BASE_URL` | Public origin Copyleaks calls |

`NEXT_PUBLIC_CREDITS_PER_GRADING` is in `.env.example` and CI. Application code does not read it.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Next.js dev server (Webpack) |
| `npm run build` | Production build (Webpack) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest, once |
| `npm run test:rules` | Firestore and Storage rules in the emulators (Java 21) |
| `npm run doctor` | React Doctor |

## Testing and CI

GitHub Actions on `dev` and `main` runs typecheck, Vitest, and a production build, plus Firestore/Storage rules in the emulators and a malware IOC scan. The build step receives only the public `NEXT_PUBLIC_*` names from Actions secrets.

## Firebase

1. Enable Google, email/password, and email-link auth.
2. Data lives under `users/{uid}`: `profile/userData`, `summaries`, `custom_rubrics`, `payments`, `plagiarism_reports`.
3. Uploads go to `uploads/{uid}/` in Storage.
4. Deploy rules only when you intend to: `firebase deploy --only firestore:rules,storage --project grademe-999af`.

## Deployment

Next.js on Vercel. Set the same variable names in the host. Keep Webpack (`--webpack`). Point the Copyleaks status webhook at `/api/copyleaks/webhook/{STATUS}` and the Stripe webhook at `/api/stripe/webhook`.

`dev` is the working branch. `main` is updated by a fast-forward promotion after QA. Commits on `main` must be signed. Do not force-push.

## License

GNU Affero General Public License v3.0 — see [LICENSE.md](LICENSE.md).
