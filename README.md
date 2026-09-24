# Grade.me

AI-powered writing feedback for students, educators, and writers. Submit an essay (typed, pasted, or uploaded), pick or build a rubric, and get a streamed letter grade with detailed, rubric-aligned feedback. Live at [https://grade.me](https://grade.me).

> Product inventory and roadmap: [`spec.md`](./spec.md). Agent / contributor conventions: [`AGENTS.md`](./AGENTS.md).

## Features

- **Streamed AI grading** with rubric-aligned feedback and a percentage / letter grade
- **Rubric library** — built-in rubrics plus a custom rubric builder; favorites and relevance sorting
- **TipTap editor** with grammar/spelling correction (`nspell` + bundled dictionaries)
- **Document upload** — DOCX, PDF, ODT, RTF, TXT (server-side parsing)
- **Plagiarism / AI-content detection** via Copyleaks (async webhook → report pages)
- **Grading history** (“assignments”) with per-submission detail views
- **Credits + Stripe** PaymentIntents, or bring-your-own OpenAI / Fireworks keys
- **Auth** — Firebase Google, email/password, and passwordless email link
- **DOCX export** of feedback / document
- Embeddable in a React Native WebView (layout and auth stay WebView-safe)

## Tech stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js ^16.2.7 (App Router, **Webpack** — not Turbopack) |
| UI | React ^19.2.7, Tailwind CSS ^4.3.0, Radix / shadcn-style primitives, TipTap 3 |
| Language | TypeScript ^6.0.3 |
| State | Zustand ^5.0.14 |
| Backend | Firebase ^12.14.0 + Firebase Admin ^13.10.0 (Auth, Firestore, Storage) |
| AI | Vercel AI SDK (`ai` ^6, `@ai-sdk/*` including OpenAI, Anthropic, Google, Azure, xAI, RSC streaming) |
| Payments | Stripe ^22 + `@stripe/react-stripe-js` |
| Docs | mammoth, pdf2json, officeparser, `@iarna/rtf-to-html`, `docx` |
| Plagiarism | Copyleaks REST API (route handlers) |
| Tests / quality | Vitest ^4.1.8, ESLint 9, React Doctor |

## Project structure

```
src/
  app/                     # App Router pages + Copyleaks API routes
    api/copyleaks/         # submit, webhook/[status], reports/[uid]/[docId]
    grader/ rubrics/ assignments/ dashboard/ profile/
    plagiarism-check/ payment-*/ loginfinish/ support/ terms/ privacy/
  actions/                 # Server actions: generateGrade, grammar, parse docs, payments, docx
  components/              # shell, auth, grader, editor, rubrics, history, plagiarism, payments, ui
  zustand/                 # Auth, profile, rubrics, payments stores
  firebase/                # Client + Admin SDK
  lib/                     # AI registry, constants (rubrics.json), hooks, dictionaries, utils
  proxy.ts                 # Next.js proxy for soft route protection
```

## Getting started

### Prerequisites

- Node.js 22+
- npm (`.npmrc` uses `legacy-peer-deps=true`)
- Firebase project (Auth, Firestore, Storage)
- Stripe account
- Optional: Copyleaks account; provider API keys for models you enable

### Install

```bash
git clone https://github.com/brown2020/grademeapp.git
cd grademeapp
cp .env.example .env.local
# Fill in values from the table below — never commit real secrets
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Start from `.env.example`. Additional keys are read in code for optional providers and Copyleaks.

### Core (in `.env.example`)

| Name | Purpose | Where to get it |
| --- | --- | --- |
| `FIREBASE_*` | Admin SDK service account fields | Firebase Console → Service accounts |
| `NEXT_PUBLIC_FIREBASE_*` | Client Firebase config | Firebase Console → Project settings |
| `NEXT_PUBLIC_COOKIE_NAME` | Auth ID-token cookie name | Choose a stable name (e.g. `grademeAuthToken`) |
| `OPENAI_API_KEY` | Platform OpenAI key | [platform.openai.com](https://platform.openai.com) |
| `FIREWORKS_API_KEY` | Platform Fireworks key | [fireworks.ai](https://fireworks.ai) |
| `XAI_API_KEY` / `XAI_API_URL` | xAI provider | [console.x.ai](https://console.x.ai) |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key | Stripe Dashboard |
| `STRIPE_SECRET_KEY` | Stripe secret key | Stripe Dashboard |
| `NEXT_PUBLIC_STRIPE_PRODUCT_NAME` | Credit product label | Your Stripe product / choice |
| `NEXT_PUBLIC_CREDITS_PER_GRADING` | Credits charged per grading (client display) | Tune for your pricing |

### Also used in code (optional / not all in `.env.example`)

| Name | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Anthropic models via AI SDK registry |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google models |
| `GROQ_API_KEY` | Groq models |
| `AZURE_API_KEY` / `AZURE_RESOURCE_NAME` | Azure OpenAI |
| `OPENAI_COMPATIBLE_API_KEY` / `OPENAI_COMPATIBLE_API_BASE_URL` / `NEXT_PUBLIC_OPENAI_COMPATIBLE_MODEL` | OpenAI-compatible endpoint |
| `XAI_BASE_URL` | Override xAI base URL (code may use this name) |
| `COPYLEAKS_EMAIL` / `COPYLEAKS_API_KEY` / `COPYLEAKS_WEBHOOK_SECRET` | Copyleaks plagiarism / AI detection |
| `BASE_URL` | Public base URL for webhooks / callbacks |
| `CREDITS_PER_INPUT_TOKEN` / `CREDITS_PER_OUTPUT_TOKEN` / `CREDITS_PER_DOLLAR` | Server-side credit accounting |

Never commit real values. Wire CI build secrets via GitHub Actions secrets only.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Next.js dev server (Webpack) |
| `npm run build` | Production build (Webpack) |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run doctor` | React Doctor |

## Testing and CI

- Vitest unit tests (e.g. payment actions, rubric helpers).
- `.github/workflows/ci.yml` on `dev` / `main`: typecheck → test → production build (client env from Actions secrets).
- Malware IOC scan workflow is also present.

## Firebase / services

1. Enable Google, email/password, and email-link auth as needed.
2. Firestore collections used include `users/{uid}`, `users/{uid}/profile/userData`, `summaries`, `custom_rubrics`, `plagiarism_reports`.
3. Configure Storage for uploaded documents.
4. For Copyleaks, set webhook URL to your deployed `/api/copyleaks/webhook/[status]` and matching secrets.

## Deployment

Next.js on Vercel (or similar). Set the same env vars in the host. Keep Webpack (`--webpack`) unless you intentionally migrate bundlers. Do not put secrets in workflow YAML.

## Contributing

1. Branch from `dev`.
2. Respect WebView constraints (scrolling, auth cookie flow).
3. Run `npm run typecheck`, `npm test`, and `npm run build` before opening a PR.
4. See [`AGENTS.md`](./AGENTS.md) for coding conventions.

## License

GNU Affero General Public License v3.0 — see [LICENSE.md](LICENSE.md).
