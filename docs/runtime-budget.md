# Runtime budget

Critical path: **auth_signin** (open modal → email/password → session cookie).

- Budget: **p95 ≤ 3000ms** from submit to authenticated UI (local production
  server, warm Firebase Identity Toolkit).
- Measurement: browser performance marks around sign-in in until-100 auth probe.
