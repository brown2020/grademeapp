import { defineConfig } from "vitest/config";

/** Security-rules tests; run inside the Firebase emulators via `npm run test:rules`. */
export default defineConfig({
  test: {
    environment: "node",
    include: ["rules/**/*.test.ts"],
    testTimeout: 20_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
});
