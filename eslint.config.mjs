import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: ["lib/storage/internal/access.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: 'MemberExpression[object.name="localStorage"]',
          message:
            "Use appLocalStorage from @/lib/storage instead of localStorage.",
        },
        {
          selector:
            'MemberExpression[object.object.name="window"][object.property.name="localStorage"]',
          message:
            "Use appLocalStorage from @/lib/storage instead of window.localStorage.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
