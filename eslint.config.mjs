import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Downgrade set-state-in-effect to warn for legitimate prop-sync patterns
    // (syncing external store values into local controlled-input state).
    // These will be refactored to useSyncExternalStore or key-based reset
    // in a future pass. Keeping as warn so they remain visible.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
