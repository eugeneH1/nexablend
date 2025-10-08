// packages/config/eslint-config-next

import next from "eslint-config-next";
import js from "@eslint/js";

/**
 * @type {import("eslint").Linter.FlatConfig[]}
 */
export default [
  js.configs.recommended,
  ...next(),
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/jsx-key": "off"
    }
  }
];


