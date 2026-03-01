/**
 * Playwright Global Setup — Asgardeo Authentication
 *
 * This file runs ONCE before all tests. It:
 *  1. Checks if a valid, unexpired session already exists (reuse for speed)
 *  2. If not, launches a real browser, navigates to the app's login page,
 *     completes the Asgardeo OIDC login flow with the test user credentials,
 *     and saves the browser storage state (cookies) to .playwright/user.json
 *
 * All subsequent test workers load the saved storage state so they start
 * already authenticated without repeating the login flow.
 *
 * Environment variables (set in .env.e2e):
 *   E2E_USERNAME   – test account email / username
 *   E2E_PASSWORD   – test account password
 *   E2E_FORCE_LOGIN=true – ignore cached session and always re-login
 *
 * To force a fresh login at any time:
 *   E2E_FORCE_LOGIN=true npm run test:e2e
 *   – or –
 *   rm -rf .playwright && npm run test:e2e
 */
import { chromium, type FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Load credentials from .env.e2e (if the file exists)
const envE2ePath = path.join(process.cwd(), '.env.e2e');
if (fs.existsSync(envE2ePath)) {
  const lines = fs.readFileSync(envE2ePath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !(key in process.env)) {
      process.env[key] = val;
    }
  }
}

// ── Constants ────────────────────────────────────────────────────────────────
/** Directory for all Playwright auth artefacts. */
export const AUTH_DIR = path.join(process.cwd(), '.playwright');
/** Saved browser storage state (cookies + localStorage). */
export const AUTH_FILE = path.join(AUTH_DIR, 'user.json');
/** Metadata file so we know when the session was created. */
export const AUTH_META_FILE = path.join(AUTH_DIR, 'user.meta.json');
/** Re-login when a saved session is older than this many minutes. */
const SESSION_TTL_MINUTES = 50;

// ── Helpers ──────────────────────────────────────────────────────────────────
function isSessionFresh(): boolean {
  if (process.env.E2E_FORCE_LOGIN === 'true') {
    console.log('[auth] E2E_FORCE_LOGIN=true – skipping cache');
    return false;
  }
  try {
    if (!fs.existsSync(AUTH_FILE) || !fs.existsSync(AUTH_META_FILE)) return false;
    const meta: { createdAt: number } = JSON.parse(
      fs.readFileSync(AUTH_META_FILE, 'utf-8'),
    );
    const ageMinutes = (Date.now() - meta.createdAt) / 1000 / 60;
    if (ageMinutes >= SESSION_TTL_MINUTES) {
      console.log(`[auth] Cached session is ${Math.round(ageMinutes)}min old – will re-login`);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function saveMetadata(): void {
  fs.writeFileSync(
    AUTH_META_FILE,
    JSON.stringify({ createdAt: Date.now() }, null, 2),
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function globalSetup(config: FullConfig): Promise<void> {
  if (isSessionFresh()) {
    console.log('[auth] ✓ Reusing cached session (.playwright/user.json)');
    return;
  }

  const E2E_USERNAME = process.env.E2E_USERNAME;
  const E2E_PASSWORD = process.env.E2E_PASSWORD;

  if (!E2E_USERNAME || !E2E_PASSWORD) {
    throw new Error(
      '\n' +
        '  ❌ E2E credentials not found.\n' +
        '  Copy .env.e2e.example → .env.e2e and fill in E2E_USERNAME / E2E_PASSWORD.\n',
    );
  }

  const baseURL =
    config.projects[0]?.use?.baseURL ||
    process.env.BASE_URL ||
    'http://localhost:3000';

  console.log(`\n[auth] 🔐 Logging in as ${E2E_USERNAME} → ${baseURL}`);

  // Honour --headed flag: when the user runs `npm run test:e2e:headed` we also
  // show the login browser so they can see (and intervene in) the auth flow.
  const isHeaded = process.argv.includes('--headed') || process.env.HEADED === '1';
  const browser = await chromium.launch({ headless: !isHeaded, slowMo: isHeaded ? 100 : 0 });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  try {
    // ── Step 1: Navigate to the home page (login landing) ─────────────────
    await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 60_000 });

    // ── Step 2: Click the Asgardeo Sign‑In button ─────────────────────────
    // The home page shows a "Sign In with Asgardeo" button when logged out.
    const signInLink = page.getByRole('button', { name: /sign in/i });
    await signInLink.waitFor({ state: 'visible', timeout: 15_000 });
    await signInLink.click();

    // ── Step 3: Wait for redirect to Asgardeo login page ─────────────────
    // Asgardeo login page is at accounts.asgardeo.io/t/{org}/authenticationendpoint/
    await page.waitForURL(/accounts\.asgardeo\.io/, { timeout: 30_000 });
    console.log('[auth] Reached Asgardeo login page:', page.url());

    // ── Step 4: Fill username ──────────────────────────────────────────────
    // Asgardeo's login page has TWO username inputs:
    //   • input#username      – type="hidden"  (relay field, not visible)
    //   • input#usernameUserInput – type="text" (the actual visible field)
    // The `:not([type="hidden"])` filter is essential to skip the hidden relay.
    const usernameInput = page
      .locator(
        'input#usernameUserInput, ' +
        'input[name="username"]:not([type="hidden"]), ' +
        'input[type="text"][autocomplete="username"], ' +
        'input[type="email"]',
      )
      .first();
    await usernameInput.waitFor({ state: 'visible', timeout: 15_000 });
    await usernameInput.fill(E2E_USERNAME);

    // ── Step 5: Check if password is on the same screen or behind "Next" ──
    // Some Asgardeo tenants use a two-step flow (username → next → password).
    const passwordLocator = page.locator(
      'input[type="password"], input#password, input[name="password"]',
    ).first();
    const isPasswordVisible = await passwordLocator
      .isVisible({ timeout: 500 })
      .catch(() => false);

    if (!isPasswordVisible) {
      // Click the primary action button to advance to the password step
      const nextBtn = page
        .locator(
          'input[type="submit"], input[id="loginButton"], button[type="submit"]',
        )
        .first();
      await nextBtn.click({ timeout: 10_000 });
      // Wait for the password field to appear
      await passwordLocator.waitFor({ state: 'visible', timeout: 15_000 });
    }

    // ── Step 6: Fill password & submit ────────────────────────────────────
    await passwordLocator.fill(E2E_PASSWORD);

    const submitBtn = page
      .locator('input[type="submit"], input[id="loginButton"], button[type="submit"]')
      .first();
    await submitBtn.click({ timeout: 10_000 });

    // ── Step 7: Wait for successful redirect back to the app ─────────────
    // The middleware redirects authenticated users away from "/"; the protected
    // pages will load without another Asgardeo redirect.
    await page.waitForURL(
      (url) => url.origin === new URL(baseURL).origin && !url.href.includes('asgardeo.io'),
      { timeout: 40_000 },
    );
    // Wait for the app to fully settle (session cookie must be written)
    await page.waitForLoadState('networkidle', { timeout: 30_000 });

    console.log('[auth] Redirected back to app:', page.url());

    // ── Step 8: Verify we are actually authenticated ──────────────────────
    // Navigate to a protected MOT page – if unauthenticated we'd be sent back
    // to Asgardeo; if authenticated we land on the page (or dashboard redirect).
    await page.goto(`${baseURL}/mot/bus-stops`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    const afterNavUrl = page.url();
    if (afterNavUrl.includes('asgardeo.io') || afterNavUrl === baseURL || afterNavUrl === `${baseURL}/`) {
      throw new Error(
        `Login did not succeed – still on "${afterNavUrl}" after attempting to navigate to /mot/bus-stops.\n` +
          'Check credentials and that the test account has the "mot" role.',
      );
    }
    console.log('[auth] ✓ Confirmed access to protected route:', afterNavUrl);

    // ── Step 9: Save storage state ────────────────────────────────────────
    fs.mkdirSync(AUTH_DIR, { recursive: true });
    await context.storageState({ path: AUTH_FILE });
    saveMetadata();

    console.log(`[auth] ✓ Session saved → ${AUTH_FILE}`);
  } catch (error) {
    // Capture screenshot to aid debugging
    const screenshotPath = path.join(AUTH_DIR, 'auth-failure.png');
    fs.mkdirSync(AUTH_DIR, { recursive: true });
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
    console.error('[auth] ❌ Screenshot saved to:', screenshotPath);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
