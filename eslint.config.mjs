import {defineConfig, globalIgnores} from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    ".test-dist/**",
    "node_modules/**",
    "studio/.sanity/**",
    "studio/dist/**",
    "studio/node_modules/**",
    "data/itineraries.json",
  ]),
]);
