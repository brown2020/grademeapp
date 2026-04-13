import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // All set-state-in-effect patterns converted to adjusting-state-during-render.
    rules: {
      "react-hooks/set-state-in-effect": "error",
    },
  },
];

export default config;
