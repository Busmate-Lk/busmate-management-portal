/**
 * Inject a minimal Google Maps API stub into the page so the AddressPicker
 * component initialises without requiring a real API key or network call.
 *
 * Call `await mockGoogleMapsApi(page)` BEFORE navigating to any page that
 * renders a Google Map.
 */
import { type Page } from '@playwright/test';

export async function mockGoogleMapsApi(page: Page): Promise<void> {
  await page.addInitScript(() => {
    // Prevent the real Google Maps script from loading
    const origCreateElement = document.createElement.bind(document);
    document.createElement = function (tagName: string, options?: ElementCreationOptions) {
      const el = origCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'script') {
        const origSetAttribute = el.setAttribute.bind(el);
        el.setAttribute = function (name: string, value: string) {
          if (name === 'src' && value.includes('maps.googleapis.com')) {
            // Replace with a no-op; we already have the stub below
            return;
          }
          return origSetAttribute(name, value);
        };
      }
      return el;
    } as typeof document.createElement;

    // -------------------------------------------------------------------
    // Minimal google.maps stub
    // -------------------------------------------------------------------
    const noop = () => {};
    const chainable = () => new Proxy({}, { get: () => chainable });

    class FakeLatLng {
      private _lat: number;
      private _lng: number;
      constructor(lat: number, lng: number) {
        this._lat = lat;
        this._lng = lng;
      }
      lat() { return this._lat; }
      lng() { return this._lng; }
      toJSON() { return { lat: this._lat, lng: this._lng }; }
    }

    class FakeMap {
      constructor(_el: HTMLElement, _opts?: any) {}
      setCenter = noop;
      setZoom = noop;
      addListener = (_event: string, _cb: Function) => ({ remove: noop });
      getCenter = () => new FakeLatLng(6.9271, 79.8612);
      getZoom = () => 12;
      fitBounds = noop;
      panTo = noop;
    }

    class FakeMarker {
      constructor(_opts?: any) {}
      setMap = noop;
      setPosition = noop;
      getPosition = () => new FakeLatLng(6.9271, 79.8612);
      addListener = (_event: string, _cb: Function) => ({ remove: noop });
    }

    class FakeGeocoder {
      geocode(_request: any, callback: Function) {
        callback(
          [
            {
              formatted_address: '123 Galle Road, Colombo, Sri Lanka',
              address_components: [
                { long_name: 'Colombo', types: ['locality'] },
                { long_name: 'Western Province', types: ['administrative_area_level_1'] },
                { long_name: 'Sri Lanka', types: ['country'] },
                { long_name: '00100', types: ['postal_code'] },
              ],
              geometry: {
                location: new FakeLatLng(6.9271, 79.8612),
              },
            },
          ],
          'OK',
        );
      }
    }

    class FakeAutocomplete {
      constructor(_input: HTMLInputElement, _opts?: any) {}
      addListener = (_event: string, _cb: Function) => ({ remove: noop });
      getPlace = () => ({
        formatted_address: '123 Galle Road, Colombo, Sri Lanka',
        geometry: { location: new FakeLatLng(6.9271, 79.8612) },
        address_components: [
          { long_name: 'Colombo', types: ['locality'] },
          { long_name: 'Western Province', types: ['administrative_area_level_1'] },
          { long_name: 'Sri Lanka', types: ['country'] },
          { long_name: '00100', types: ['postal_code'] },
        ],
      });
    }

    (window as any).google = {
      maps: {
        Map: FakeMap,
        Marker: FakeMarker,
        Geocoder: FakeGeocoder,
        LatLng: FakeLatLng,
        MapTypeId: { ROADMAP: 'roadmap', SATELLITE: 'satellite', HYBRID: 'hybrid', TERRAIN: 'terrain' },
        event: { addListener: noop, removeListener: noop, clearListeners: noop },
        places: {
          Autocomplete: FakeAutocomplete,
          AutocompleteService: class { getPlacePredictions = noop; },
          PlacesService: class { getDetails = noop; },
        },
        geometry: {
          spherical: { computeDistanceBetween: () => 0 },
        },
      },
    };
  });
}
