/**
 * Reusable test-data factories for bus-stop E2E tests.
 *
 * Each factory returns a plain object that matches the shape the API expects
 * or returns, making it easy to build mock responses and form-fill helpers.
 */

// ---------------------------------------------------------------------------
// Types mirroring the generated API models (kept lean for test clarity)
// ---------------------------------------------------------------------------
export interface LocationDto {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  addressSinhala?: string;
  citySinhala?: string;
  stateSinhala?: string;
  countrySinhala?: string;
  addressTamil?: string;
  cityTamil?: string;
  stateTamil?: string;
  countryTamil?: string;
}

export interface StopRequest {
  name: string;
  nameSinhala?: string;
  nameTamil?: string;
  description?: string;
  location: LocationDto;
  isAccessible?: boolean;
}

export interface StopResponse extends StopRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface PageStopResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: StopResponse[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

let counter = 0;

/** Generate a unique suffix so parallel tests don't collide. */
function uid(): string {
  return `${Date.now()}-${++counter}`;
}

/** Build a valid StopRequest with sensible defaults. Override any field via `overrides`. */
export function buildStopRequest(overrides: Partial<StopRequest> = {}): StopRequest {
  const id = uid();
  return {
    name: `E2E Test Stop ${id}`,
    description: `Automated test stop created by Playwright (${id})`,
    location: {
      latitude: 6.9271,
      longitude: 79.8612,
      address: '123 Galle Road',
      city: 'Colombo',
      state: 'Western Province',
      zipCode: '00100',
      country: 'Sri Lanka',
    },
    isAccessible: true,
    ...overrides,
  };
}

/** Build a StopResponse (what the API returns after create/update). */
export function buildStopResponse(overrides: Partial<StopResponse> = {}): StopResponse {
  const request = buildStopRequest(overrides);
  return {
    id: overrides.id ?? crypto.randomUUID(),
    ...request,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'e2e-test-user',
    updatedBy: 'e2e-test-user',
    ...overrides,
  };
}

/** Build a paginated list response wrapping the given stops. */
export function buildPageStopResponse(
  stops: StopResponse[],
  page = 0,
  size = 10,
  totalElements?: number,
): PageStopResponse {
  const total = totalElements ?? stops.length;
  return {
    content: stops,
    totalElements: total,
    totalPages: Math.ceil(total / size),
    size,
    number: page,
    first: page === 0,
    last: page >= Math.ceil(total / size) - 1,
    numberOfElements: stops.length,
    empty: stops.length === 0,
  };
}

/** A minimal set of form values used to fill the "Add New Bus Stop" form. */
export interface BusStopFormValues {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isAccessible: boolean;
}

/** Sensible defaults to fill into the create form. */
export function buildBusStopFormValues(overrides: Partial<BusStopFormValues> = {}): BusStopFormValues {
  const id = uid();
  return {
    name: `E2E Bus Stop ${id}`,
    description: `Created by Playwright test (${id})`,
    address: '456 Galle Road',
    city: 'Colombo',
    state: 'Western Province',
    zipCode: '00100',
    country: 'Sri Lanka',
    isAccessible: true,
    ...overrides,
  };
}
