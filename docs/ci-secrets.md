# CI secrets (GitHub Actions)

Wire these as repository Actions **secrets** (never inline in workflow YAML):

- `NEXT_PUBLIC_COOKIE_NAME`
- `NEXT_PUBLIC_FIREBASE_APIKEY`
- `NEXT_PUBLIC_FIREBASE_AUTHDOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECTID`
- `NEXT_PUBLIC_FIREBASE_STORAGEBUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID`
- `NEXT_PUBLIC_FIREBASE_APPID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENTID`
- `NEXT_PUBLIC_STRIPE_PRODUCT_NAME`
- `NEXT_PUBLIC_CREDITS_PER_GRADING`
- `NEXT_PUBLIC_STRIPE_KEY` (publishable)

Firebase client init is deferred when `NEXT_PUBLIC_FIREBASE_APIKEY` is empty so
`typecheck` / `test` / empty-secret builds still pass. Secrets are injected only
on the Production build step (not on `npm ci`) to satisfy React Doctor
`build-pipeline-secret-boundary`.
