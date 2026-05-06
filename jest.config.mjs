import nextJest from "next/jest.js";

/**
 * Jest worker processes often drop `--verbose` from `process.argv`, so integration tests
 * would never see `getWowApiJestProviders().verboseLogging`. Mirror the CLI flag into env
 * here (parent process, before workers fork) so workers inherit `WOW_API_TEST_PAYLOAD_LOG`.
 */
if (process.argv.includes("--verbose")) {
  process.env.WOW_API_TEST_PAYLOAD_LOG = "1";
}

const createJestConfig = nextJest({ dir: "./" });

/** @type {import("jest").Config} */
const customJestConfig = {
  testEnvironment: "node",
  testTimeout: 30_000,
};

export default createJestConfig(customJestConfig);
