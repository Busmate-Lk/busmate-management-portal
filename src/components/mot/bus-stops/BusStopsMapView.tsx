'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Eye, 
  Edit, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Locate,
  AlertTriangle
} from 'lucide-react';
import type { StopResponse } from '../../../../generated/api-clients/route-management';

interface BusStopsMapViewProps {
  busStops: StopResponse[];
  loading: boolean;
  onDelete?: (busStop: StopResponse) => void;
}

// Custom marker colors for accessibility status
const ACCESSIBLE_MARKER_COLOR = '#10B981'; // Green
const NOT_ACCESSIBLE_MARKER_COLOR = '#EF4444'; // Red
const DEFAULT_MARKER_COLOR = '#6B7280'; // Gray

// Map configuration
const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 }; // Sri Lanka center
const DEFAULT_ZOOM = 8;
const CLUSTER_ZOOM = 12;

declare global {
  interface Window {
    google: typeof google;
    busStopMapActions?: {
      viewDetails: (id: string) => void;
      editStop: (id: string) => void;
      deleteStop: (id: string) => void;
    };
  }
}

export function BusStopsMapView({ 
  busStops, 
  loading, 
  onDelete 
}: BusStopsMapViewProps) {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const markerClustererRef = useRef<any>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedBusStop, setSelectedBusStop] = useState<StopResponse | null>(null);

  // Filter bus stops that have valid coordinates
  const validBusStops = useMemo(() => {
    return busStops.filter(stop => 
      stop.location?.latitude && 
      stop.location?.longitude &&
      !isNaN(Number(stop.location.latitude)) &&
      !isNaN(Number(stop.location.longitude))
    );
  }, [busStops]);

  // Calculate map bounds to fit all bus stops
  const getMapBounds = useCallback(() => {
    if (validBusStops.length === 0) return null;

    const bounds = new window.google.maps.LatLngBounds();
    validBusStops.forEach(stop => {
      if (stop.location?.latitude && stop.location?.longitude) {
        bounds.extend(new window.google.maps.LatLng(
          stop.location.latitude, 
          stop.location.longitude
        ));
      }
    });
    return bounds;
  }, [validBusStops]);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Check if Google Maps is already loaded
        if (typeof window.google !== 'undefined') {
          createMap();
          return;
        }

        // Load Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => createMap();
        script.onerror = () => setMapError('Failed to load Google Maps');
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map');
      }
    };

    const createMap = () => {
      if (!mapRef.current || !window.google) return;

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: false, // We'll use custom controls
        });

        googleMapRef.current = map;

        // Create info window
        infoWindowRef.current = new window.google.maps.InfoWindow({
          maxWidth: 300,
        });

        setIsMapLoaded(true);
      } catch (error) {
        console.error('Error creating map:', error);
        setMapError('Failed to create map');
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (markerClustererRef.current) {
        markerClustererRef.current.clearMarkers();
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  // Create markers for bus stops
  useEffect(() => {
    if (!isMapLoaded || !googleMapRef.current || !window.google) return;

    // Clear existing markers
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    const newMarkers = validBusStops.map(stop => {
      if (!stop.location?.latitude || !stop.location?.longitude) return null;

      const position = new window.google.maps.LatLng(
        stop.location.latitude,
        stop.location.longitude
      );

      const markerColor = stop.isAccessible === true 
        ? ACCESSIBLE_MARKER_COLOR 
        : stop.isAccessible === false 
        ? NOT_ACCESSIBLE_MARKER_COLOR 
        : DEFAULT_MARKER_COLOR;

      const marker = new window.google.maps.Marker({
        position,
        map: googleMapRef.current,
        title: stop.name || 'Unnamed Stop',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        },
      });

      // Add click listener to show info window
      marker.addListener('click', () => {
        showInfoWindow(marker, stop);
        setSelectedBusStop(stop);
      });

      return marker;
    }).filter(Boolean) as google.maps.Marker[];

    markersRef.current = newMarkers;

    // Initialize marker clusterer if there are many markers
    if (newMarkers.length > 10) {
      // Note: You'll need to install @googlemaps/markerclusterer if not already installed
      // markerClustererRef.current = new MarkerClusterer({ markers: newMarkers, map: googleMapRef.current });
    }

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = getMapBounds();
      if (bounds && googleMapRef.current) {
        googleMapRef.current.fitBounds(bounds);
        
        // Set minimum zoom level
        const listener = window.google.maps.event.addListenerOnce(googleMapRef.current, 'bounds_changed', () => {
          if (googleMapRef.current && googleMapRef.current.getZoom()! > CLUSTER_ZOOM) {
            googleMapRef.current.setZoom(CLUSTER_ZOOM);
          }
        });
      }
    }

  }, [isMapLoaded, validBusStops, getMapBounds]);

  // Show info window for a bus stop
  const showInfoWindow = (marker: google.maps.Marker, stop: StopResponse) => {
    if (!infoWindowRef.current) return;
    
    const formatLocation = (location: any) => {
      if (!location) return 'No location';
      const parts = [];
      if (location.address) parts.push(location.address);
      if (location.city) parts.push(location.city);
      if (location.state) parts.push(location.state);
      return parts.length > 0 ? parts.join(', ') : 'No address';
    };

    const accessibilityBadge = stop.isAccessible === true 
      ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Accessible</span>'
      : stop.isAccessible === false
      ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">✗ Not Accessible</span>'
      : '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>';

    const content = `
      <div class="p-4 min-w-[250px]">
        <h3 class="font-semibold text-lg text-gray-900 mb-2">${stop.name || 'Unnamed Stop'}</h3>
        
        <div class="space-y-2 mb-4">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-sm text-gray-600">${formatLocation(stop.location)}</span>
          </div>
          
          ${stop.description ? `
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span class="text-sm text-gray-600">${stop.description}</span>
          </div>
          ` : ''}
          
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-700">Accessibility:</span>
            ${accessibilityBadge}
          </div>
        </div>
        
        <div class="flex justify-end space-x-2 pt-2 border-t border-gray-200">
          <button 
            onclick="window.busStopMapActions?.viewDetails('${stop.id}')" 
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Details
          </button>
          <button 
            onclick="window.busStopMapActions?.editStop('${stop.id}')" 
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
          <button 
            onclick="window.busStopMapActions?.deleteStop('${stop.id}')" 
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    `;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(googleMapRef.current, marker);
  };

  // Map action handlers
  useEffect(() => {
    window.busStopMapActions = {
      viewDetails: (id: string) => {
        router.push(`/mot/bus-stops/${id}`);
      },
      editStop: (id: string) => {
        router.push(`/mot/bus-stops/${id}/edit`);
      },
      deleteStop: (id: string) => {
        const stop = busStops.find(s => s.id === id);
        if (stop && onDelete) {
          onDelete(stop);
        }
      },
    };

    return () => {
      delete window.busStopMapActions;
    };
  }, [router, busStops, onDelete]);

  // Map control handlers
  const handleZoomIn = () => {
    if (googleMapRef.current) {
      const currentZoom = googleMapRef.current.getZoom() || DEFAULT_ZOOM;
      googleMapRef.current.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (googleMapRef.current) {
      const currentZoom = googleMapRef.current.getZoom() || DEFAULT_ZOOM;
      googleMapRef.current.setZoom(currentZoom - 1);
    }
  };

  const handleResetView = () => {
    if (googleMapRef.current) {
      const bounds = getMapBounds();
      if (bounds && validBusStops.length > 0) {
        googleMapRef.current.fitBounds(bounds);
      } else {
        googleMapRef.current.setCenter(DEFAULT_CENTER);
        googleMapRef.current.setZoom(DEFAULT_ZOOM);
      }
    }
  };

  const handleFindMyLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (googleMapRef.current) {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          googleMapRef.current.setCenter(userLocation);
          googleMapRef.current.setZoom(12);
        }
      },
      () => {
        console.error('Unable to retrieve your location');
      }
    );
  };

  if (mapError) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map Error</h3>
          <p className="text-gray-500 mb-4">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
      {/* Map Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bus Stops Map</h3>
            <p className="text-sm text-gray-600">
              {validBusStops.length} bus stops with valid coordinates
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>Accessible</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span>Not Accessible</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
                <span>Unknown</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div ref={mapRef} className="w-full h-96" />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 border border-gray-200"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 border border-gray-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleResetView}
            className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 border border-gray-200"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleFindMyLocation}
            className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 border border-gray-200"
            title="Find My Location"
          >
            <Locate className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Loading Overlay */}
        {(loading || !isMapLoaded) && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-600">
                {!isMapLoaded ? 'Loading map...' : 'Loading bus stops...'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Invalid Coordinates Warning */}
      {busStops.length > validBusStops.length && (
        <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">
              {busStops.length - validBusStops.length} bus stops have invalid coordinates and are not shown on the map.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}