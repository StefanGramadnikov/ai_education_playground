import { defineConfig } from "vitest/config";
import path from "node:path";

/** Unit tests (repository, actions, validation) live in tests/unit. UI tests use Cypress (see cypress.config.ts). */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      // `server-only` throws outside React Server Components; stub it in tests.
      "server-only": path.resolve(import.meta.dirname, "tests/support/stubs/empty.ts"),
    },
  },
  test: { environment: "node", include: ["tests/unit/**/*.test.ts"] },
});
