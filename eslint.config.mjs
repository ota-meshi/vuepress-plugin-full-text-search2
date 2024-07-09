import tsParser from "@typescript-eslint/parser";
import myPlugin from "@ota-meshi/eslint-plugin";

export default [
  {
    ignores: [
      ".nyc_output",
      "coverage",
      "lib",
      "node_modules",
      "**/node_modules",
      "tests/fixtures/**/*.json",
      "!playground/docs/.vuepress",
      "playground/docs/.vuepress/.temp",
      "playground/docs/.vuepress/.cache",
      "playground/docs/.vuepress/dist",
    ],
  },
  ...myPlugin.config({
    node: true,
    ts: true,
    vue3: true,
    prettier: true,
    json: true,
    packageJson: true,
  }),
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "jsdoc/require-jsdoc": "error",
      "no-warning-comments": "warn",
      "no-lonely-if": "off",
      "no-shadow": "off",
      "@typescript-eslint/naming-convention": "off",
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "script",
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    rules: {
      "n/file-extension-in-import": "off",
    },
  },
  {
    files: ["**/*.vue"],

    languageOptions: {
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
        extraFileExtensions: [".vue"],
        parser: "@typescript-eslint/parser",
      },
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "property",
          format: null,
        },
        {
          selector: "method",
          format: null,
        },
      ],

      "no-implicit-globals": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["scripts/**/*.ts", "tests/**/*.ts"],

    rules: {
      "jsdoc/require-jsdoc": "off",
      "no-console": "off",
      "@typescript-eslint/no-misused-promises": "off",
    },
  },
  {
    files: ["playground/**/*.js"],

    rules: {
      "n/no-missing-import": "off",
      "n/no-unpublished-import": "off",
      "n/no-missing-require": "off",
      "n/no-unpublished-require": "off",
    },
  },
];
