/**
 * Playwright Global Teardown
 *
 * Runs once after all tests complete.
 * The auth session (.playwright/user.json) is intentionally kept on disk so
 * the next test run can reuse it (faster execution).
 *
 * To force a fresh login on next run, either:
 *   - Set  E2E_FORCE_LOGIN=true  in your env / .env.e2e
 *   - Delete  .playwright/user.json  manually
 */
async function globalTeardown(): Promise<void> {
  // Auth state is intentionally preserved for session reuse.
  // Add any post-run cleanup here if needed in future (e.g. purge test data).
}

export default globalTeardown;
