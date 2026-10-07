import { defineConfig } from "cypress";
import path from "node:path";

const root = __dirname;
const stub = (file: string) => path.resolve(root, "tests/support/stubs", file);

/**
 * Cypress component-testing setup (no e2e).
 *
 * Performance: Vite dev server (no Next/webpack build), no video/screenshots,
 * no retained test snapshots in run mode, and Next-specific modules are
 * replaced by tiny stubs (see tests/support/stubs) so components mount in isolation.
 *
 * "API calls" are Server Actions, which components receive as props
 * (`action`), so tests mock them with `cy.stub()`; no network or database is involved.
 */
export default defineConfig({
  fixturesFolder: false,
  video: false,
  screenshotOnRunFailure: false,
  numTestsKeptInMemory: 0,
  retries: { runMode: 0, openMode: 0 },
  defaultCommandTimeout: 4000,
  component: {
    specPattern: "tests/component/**/*.cy.tsx",
    supportFile: "tests/support/component.tsx",
    indexHtmlFile: "tests/support/component-index.html",
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        configFile: false,
        root,
        resolve: {
          alias: [
            { find: /^@\//, replacement: `${path.resolve(root, "src")}/` },
            { find: /^next\/link$/, replacement: stub("next-link.tsx") },
            { find: /^next\/navigation$/, replacement: stub("next-navigation.tsx") },
          ],
        },
      },
    },
  },
});
