/**
 * Page-object-style selectors for bus-stop pages.
 *
 * Centralising selectors here means tests stay readable and changes to the DOM
 * only need to be updated in one place.
 */
import { type Page, type Locator } from '@playwright/test';

// ---------------------------------------------------------------------------
// Add / Edit Bus Stop Form
// ---------------------------------------------------------------------------
export class BusStopFormSelectors {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Basic Information ──────────────────────────────────────────────────
  get nameInput(): Locator {
    return this.page.getByPlaceholder('Enter bus stop name');
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder('Enter bus stop description (optional)');
  }

  get accessibleCheckbox(): Locator {
    return this.page.getByRole('checkbox', { name: /wheelchair accessible/i });
  }

  // ── Location fields ────────────────────────────────────────────────────
  get mapSearchInput(): Locator {
    return this.page.getByPlaceholder('Search for an address or place...');
  }

  get addressInput(): Locator {
    return this.page.getByPlaceholder('Enter street address');
  }

  get cityInput(): Locator {
    return this.page.getByPlaceholder('Enter city');
  }

  get stateInput(): Locator {
    return this.page.getByPlaceholder('Enter state or province');
  }

  get zipCodeInput(): Locator {
    return this.page.getByPlaceholder('Enter ZIP or postal code');
  }

  get countryInput(): Locator {
    return this.page.getByPlaceholder('Enter country');
  }

  // ── Sinhala fields (optional) ──────────────────────────────────────────
  get addressSinhalaInput(): Locator {
    return this.page.getByPlaceholder('සිංහලෙන් ලිපිනය ඇතුළත් කරන්න');
  }

  get citySinhalaInput(): Locator {
    return this.page.getByPlaceholder('සිංහලෙන් නගරය ඇතුළත් කරන්න');
  }

  get stateSinhalaInput(): Locator {
    return this.page.getByPlaceholder('සිංහලෙන් පළාත ඇතුළත් කරන්න');
  }

  get countrySinhalaInput(): Locator {
    return this.page.getByPlaceholder('සිංහලෙන් රට ඇතුළත් කරන්න');
  }

  // ── Tamil fields (optional) ────────────────────────────────────────────
  get addressTamilInput(): Locator {
    return this.page.getByPlaceholder('தமிழில் முகவரியை உள்ளிடவும்');
  }

  get cityTamilInput(): Locator {
    return this.page.getByPlaceholder('தமிழில் நகரத்தை உள்ளிடவும்');
  }

  get stateTamilInput(): Locator {
    return this.page.getByPlaceholder('தமிழில் மாநிலத்தை உள்ளிடவும்');
  }

  get countryTamilInput(): Locator {
    return this.page.getByPlaceholder('தமிழில் நாட்டை உள்ளிடவும்');
  }

  // ── Actions ────────────────────────────────────────────────────────────
  get submitButton(): Locator {
    return this.page.getByRole('button', { name: /create bus stop|update bus stop/i });
  }

  get cancelButton(): Locator {
    return this.page.getByRole('button', { name: /cancel/i });
  }

  get backButton(): Locator {
    return this.page.getByRole('button', { name: /back to bus stops/i });
  }

  // ── Sections ───────────────────────────────────────────────────────────
  get basicInfoSection(): Locator {
    return this.page.getByText('Basic Information').locator('..');
  }

  get locationSection(): Locator {
    return this.page.getByText('Location Information').locator('..');
  }

  get sinhalaSection(): Locator {
    return this.page.getByText(/sinhala location information/i).locator('..');
  }

  get tamilSection(): Locator {
    return this.page.getByText(/tamil location information/i).locator('..');
  }

  // ── Validation errors ──────────────────────────────────────────────────
  get validationErrors(): Locator {
    return this.page.locator('.text-red-600.text-sm');
  }

  get generalError(): Locator {
    return this.page.locator('.bg-red-50');
  }

  // ── Loading / feedback ─────────────────────────────────────────────────
  get loadingSpinner(): Locator {
    return this.page.locator('.animate-spin');
  }
}

// ---------------------------------------------------------------------------
// Bus Stops List Page
// ---------------------------------------------------------------------------
export class BusStopListSelectors {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get addNewButton(): Locator {
    return this.page.getByRole('link', { name: /add new|add bus stop/i });
  }

  get searchInput(): Locator {
    return this.page.getByPlaceholder(/search/i);
  }

  /** Returns all rows in the bus-stop table body. */
  get tableRows(): Locator {
    return this.page.locator('table tbody tr');
  }

  /** Find a table cell that contains the given bus-stop name. */
  cellWithName(name: string): Locator {
    return this.page.locator('table tbody tr').filter({ hasText: name });
  }
}
