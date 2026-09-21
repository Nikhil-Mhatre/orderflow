// @ts-check

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

/**
 * Shared ESLint configuration for TypeScript projects.
 *
 * This configuration intentionally does not assume a specific runtime.
 * Runtime-specific globals and settings belong in the corresponding
 * environment preset, such as node.mjs.
 */
export default defineConfig(
  // -------------------------------------------------------------------------
  // Files covered by this configuration
  // -------------------------------------------------------------------------

  {
    files: ["**/*.{js,cjs,mjs,ts,cts,mts}"],

    // ESLint's recommended JavaScript rules plus TypeScript-aware rules.
    //
    // Type-checked rules are intentionally enabled here because the backend
    // services are strongly typed TypeScript applications.
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],

    languageOptions: {
      // Use typescript-eslint's parser for both JavaScript and TypeScript
      // files covered by this configuration.
      parser: tseslint.parser,

      parserOptions: {
        // Use TypeScript's Project Service rather than manually maintaining
        // a separate tsconfig specifically for ESLint.
        //
        // This keeps ESLint's type information aligned with the same
        // tsconfig.json used by the editor and TypeScript compiler.
        projectService: true,
      },
    },

    linterOptions: {
      // Treat unused eslint-disable comments as errors.
      //
      // This prevents stale suppression comments from accumulating.
      reportUnusedDisableDirectives: "error",
    },
  },

  // -------------------------------------------------------------------------
  // JavaScript files
  // -------------------------------------------------------------------------

  {
    files: ["**/*.{js,cjs,mjs}"],

    // JavaScript files do not necessarily belong to a TypeScript project.
    // Disable type-aware TypeScript rules for them while retaining normal
    // ESLint rules.
    extends: [tseslint.configs.disableTypeChecked],
  },

  // -------------------------------------------------------------------------
  // Repository/build artifacts
  // -------------------------------------------------------------------------

  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
      "**/out/**",
      "**/.cache/**",
      "**/tmp/**",
      "**/.turbo/**",
    ],
  },
);
