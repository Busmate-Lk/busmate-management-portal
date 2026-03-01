/**
 * Custom Playwright fixture that provides API-mocking helpers.
 *
 * Usage in tests:
 *
 *   import { test } from '../../fixtures/api-mocks.fixture';
 *
 *   test('my test', async ({ page, mockBusStopApi }) => {
 *     await mockBusStopApi.mockListPageApis(myStops);
 *     await page.goto('/mot/bus-stops');
 *     // …
 *   });
 *
 * Authentication is handled globally: the Playwright global setup logs in to
 * Asgardeo once and saves the session state to .playwright/user.json.
 * The playwright.config.ts `storageState` option injects those cookies into
 * every test context automatically — no auth needed in individual tests.
 *
 * API calls are intercepted at the browser network layer via `page.route()`
 * so tests run without a live backend.
 */
import { test as base, type Page, type Route } from '@playwright/test';
import {
  buildStopResponse,
  buildPageStopResponse,
  type StopResponse,
  type StopRequest,
} from '../helpers/test-data';

// ---------------------------------------------------------------------------
// Bus-stop API mock helper
// ---------------------------------------------------------------------------
export class BusStopApiMock {
  private page: Page;
  /** Stores the most recent StopRequest body sent by the app. */
  public lastCreateRequest: StopRequest | null = null;
  /** The canned response returned on POST /api/stops. */
  public createdStop: StopResponse | null = null;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Mock: successful create ────────────────────────────────────────────
  /**
   * Intercept `POST /api/stops` and respond with a 201 + canned StopResponse.
   * Also captures the request body for assertions.
   */
  async mockCreateSuccess(overrides: Partial<StopResponse> = {}): Promise<StopResponse> {
    const stop = buildStopResponse(overrides);
    this.createdStop = stop;

    await this.page.route('**/api/stops', async (route: Route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        try {
          this.lastCreateRequest = JSON.parse(request.postData() || '{}');
        } catch {
          /* ignore parse errors */
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(stop),
        });
      } else {
        // Let other methods (GET) pass through or be handled by other handlers
        await route.fallback();
      }
    });

    return stop;
  }

  // ── Mock: create failure ───────────────────────────────────────────────
  async mockCreateFailure(message = 'Internal Server Error', status = 500): Promise<void> {
    await this.page.route('**/api/stops', async (route: Route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status,
          contentType: 'application/json',
          body: JSON.stringify({ message }),
        });
      } else {
        await route.fallback();
      }
    });
  }

  // ── Mock: list page (GET /api/stops) ───────────────────────────────────
  async mockListStops(stops: StopResponse[] = []): Promise<void> {
    const response = buildPageStopResponse(stops);

    await this.page.route('**/api/stops?*', async (route: Route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(response),
        });
      } else {
        await route.fallback();
      }
    });

    // Also handle /api/stops without query params
    await this.page.route('**/api/stops', async (route: Route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(response),
        });
      } else {
        await route.fallback();
      }
    });
  }

  // ── Mock: get single stop ──────────────────────────────────────────────
  async mockGetStopById(stop: StopResponse): Promise<void> {
    await this.page.route(`**/api/stops/${stop.id}`, async (route: Route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(stop),
        });
      } else {
        await route.fallback();
      }
    });
  }

  // ── Mock: statistics ───────────────────────────────────────────────────
  async mockStatistics(overrides: Record<string, unknown> = {}): Promise<void> {
    const stats = {
      totalStops: 25,
      accessibleStops: 15,
      nonAccessibleStops: 10,
      totalStates: 5,
      totalCities: 12,
      ...overrides,
    };

    await this.page.route('**/api/stops/statistics', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(stats),
      });
    });
  }

  // ── Mock: filter options ───────────────────────────────────────────────
  async mockFilterOptions(): Promise<void> {
    await this.page.route('**/api/stops/filters/options', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          states: ['Western Province', 'Central Province', 'Southern Province'],
          cities: ['Colombo', 'Kandy', 'Galle'],
        }),
      });
    });
  }

  // ── Convenience: mock all list-page APIs at once ───────────────────────
  async mockListPageApis(stops: StopResponse[] = []): Promise<void> {
    await Promise.all([
      this.mockListStops(stops),
      this.mockStatistics(),
      this.mockFilterOptions(),
    ]);
  }
}

// ---------------------------------------------------------------------------
// Auth bypass helper
// ---------------------------------------------------------------------------

/**
 * Bypass the Asgardeo auth middleware by intercepting the middleware redirect.
 *
 * For e2e tests we mock the server-side auth check by intercepting navigation
 * and injecting a fake session cookie. This approach works because:
 * - The middleware reads `__asgardeo__session` cookie signed with ASGARDEO_SECRET
 * - In development, the secret defaults to a known value
 *
 * IMPORTANT: This only works when the Next.js server is started with the same
 * `ASGARDEO_SECRET` used to sign the test cookie. For simplicity in e2e tests,
 * we mock the auth redirect at the route level instead.
 */
export async function bypassAuth(page: Page): Promise<void> {
  // Intercept any redirect to the Asgardeo login page and return a 200
  // This prevents the middleware from redirecting unauthenticated users
  await page.route('**/api/auth/**', async (route) => {
    const url = route.request().url();
    if (url.includes('signin') || url.includes('callback')) {
      await route.fulfill({ status: 200, body: '{}' });
    } else {
      await route.fallback();
    }
  });
}

// ---------------------------------------------------------------------------
// Extended test fixture
// ---------------------------------------------------------------------------
type Fixtures = {
  mockBusStopApi: BusStopApiMock;
};

export const test = base.extend<Fixtures>({
  mockBusStopApi: async ({ page }, use) => {
    const mock = new BusStopApiMock(page);
    await use(mock);
  },
});

export { expect } from '@playwright/test';
