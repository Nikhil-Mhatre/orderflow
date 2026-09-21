// @ts-check

import globals from "globals";
import { defineConfig } from "eslint/config";

import baseConfig from "./base.mjs";

/**
 * ESLint configuration for Node.js applications.
 *
 * This preset builds on the shared TypeScript configuration and adds
 * Node.js-specific globals and conventions.
 */
export default defineConfig(
  // -------------------------------------------------------------------------
  // Shared configuration
  // -------------------------------------------------------------------------

  baseConfig,

  // -------------------------------------------------------------------------
  // Node.js environment
  // -------------------------------------------------------------------------

  {
    files: ["**/*.{js,cjs,mjs,ts,cts,mts}"],

    languageOptions: {
      // Node.js global variables such as process, Buffer, console, etc.
      globals: {
        ...globals.node,
      },
    },
  },
);
