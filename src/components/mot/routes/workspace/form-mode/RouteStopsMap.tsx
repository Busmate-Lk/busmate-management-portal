'use client';

import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useRouteWorkspace } from '@/context/RouteWorkspace/useRouteWorkspace';
import { 
  fetchRouteDirections, 
  extractValidStops, 
  calculateCenter, 
  getMarkerIconUrl, 
  getStopType,
  applyDistancesToRouteStops,
  DirectionsChunk,
  RouteDirectionsResult 
} from '@/services/routeWorkspaceMap';

interface RouteStopsMapProps {
    onToggle: () => void;
    collapsed: boolean;
    routeIndex: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '750px',
  borderRadius: '0.375rem', // rounded-md
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
};

export default function RouteStopsMap({ onToggle, collapsed, routeIndex }: RouteStopsMapProps) {
  const { data, coordinateEditingMode, updateRouteStop, updateRoute } = useRouteWorkspace();
  const [directionsChunks, setDirectionsChunks] = useState<DirectionsChunk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchedDistances, setLastFetchedDistances] = useState<Map<number, number> | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // Get route stops from context
  const route = data.routeGroup.routes[routeIndex];
  const routeStops = route?.routeStops || [];

  // Extract valid stops using the shared service
  const validStops = useMemo(() => {
    return extractValidStops(routeStops);
  }, [routeStops]);

  // Calculate center using the shared service
  const center = useMemo(() => {
    return calculateCenter(validStops);
  }, [validStops]);

  const getMarkerIcon = (stopIndex: number) => {
    const type = getStopType(stopIndex, validStops.length);
    return getMarkerIconUrl(type);
  };

  const fetchDirections = useCallback(async () => {
    if (!isLoaded || validStops.length < 2) {
      setIsLoading(false);
      setDirectionsChunks([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await fetchRouteDirections(routeStops);
      setDirectionsChunks(result.directionsChunks);
      setLastFetchedDistances(result.distances);
    } catch (error) {
      console.error('Error fetching directions:', error);
      setDirectionsChunks([]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, validStops.length, routeStops]);

  // Refetch directions when valid stops change
  useEffect(() => {
    if (!collapsed && isLoaded) {
      fetchDirections();
    }
  }, [validStops, collapsed, isLoaded, fetchDirections]);

  const onMapLoad = useCallback(() => {
    fetchDirections();
  }, [fetchDirections]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    // Only handle clicks when coordinate editing mode is active
    if (coordinateEditingMode && coordinateEditingMode.routeIndex === routeIndex) {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      
      if (lat && lng) {
        const { stopIndex } = coordinateEditingMode;
        const currentStop = routeStops[stopIndex];
        
        if (currentStop) {
          // Update the stop's coordinates
          updateRouteStop(routeIndex, stopIndex, {
            stop: {
              ...currentStop.stop,
              location: {
                ...currentStop.stop.location,
                latitude: lat,
                longitude: lng
              }
            }
          });
        }
      }
    }
  }, [coordinateEditingMode, routeIndex, routeStops, updateRouteStop]);

  // Store map reference and focus on selected stop when coordinate editing mode is activated
  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    fetchDirections();
  }, [fetchDirections]);

  // Focus on the stop when coordinate editing mode is activated
  useEffect(() => {
    if (coordinateEditingMode && coordinateEditingMode.routeIndex === routeIndex && mapRef.current) {
      const stopIndex = coordinateEditingMode.stopIndex;
      const stop = routeStops[stopIndex];
      
      if (stop?.stop?.location?.latitude && stop?.stop?.location?.longitude) {
        const lat = stop.stop.location.latitude;
        const lng = stop.stop.location.longitude;
        
        // Pan and zoom to the stop
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(15);
      }
    }
  }, [coordinateEditingMode, routeIndex, routeStops]);

  const directionsRendererOptions = {
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#2563eb',
      strokeOpacity: 0.8,
      strokeWeight: 4,
    },
  };

  return (
    <div className={`flex flex-col rounded-md px-0 pt-2 bg-gray-100 ${collapsed ? 'w-12 overflow-hidden' : ''}`}>
      <div className={`flex ${collapsed ? 'flex-col items-center' : 'justify-between items-center'} mb-2 px-2`}>
        {collapsed ? (
          <div className="flex flex-col gap-12">
            <button onClick={onToggle} className="text-white text-sm rounded flex items-center justify-center mb-2">
              <img src="/icons/Sidebar-Collapse--Streamline-Iconoir.svg" className="w-5 h-5" alt="Expand" />
            </button>
            <span className="transform -rotate-90 origin-center whitespace-nowrap text-sm">RouteStopsMap</span>
          </div>
        ) : (
          <>
            <span className="underline">RouteStopsMap</span>
            <span>
              <button onClick={onToggle} className="ml-2 text-white text-sm rounded flex items-center justify-center">
                <img src="/icons/Sidebar-Collapse--Streamline-Iconoir.svg" className="w-5 h-5 rotate-180" alt="Collapse" />
              </button>
            </span>
          </>
        )}
      </div>
      {!collapsed && (
        <>
          {coordinateEditingMode?.routeIndex === routeIndex && (
            <div className="mx-2 mb-2 px-3 py-2 bg-blue-100 border border-blue-400 rounded text-sm text-blue-800">
              <strong>Coordinate Editing Mode Active:</strong> Click anywhere on the map to update the stop location.
            </div>
          )}
          {loadError && (
            <div className="text-sm text-red-600 mb-2 px-2">Error loading Google Maps</div>
          )}
          {!isLoaded && (
            <div className="text-sm text-gray-600 mb-2 px-2">Loading Google Maps...</div>
          )}
          {isLoaded && (
            <>
              {validStops.length === 0 && (
                <div className="text-sm text-gray-600 mb-2 px-2">No stops with valid coordinates to display.</div>
              )}
              {validStops.length === 1 && (
                <div className="text-sm text-gray-600 mb-2 px-2">Add at least one more stop with coordinates to show route.</div>
              )}
              {validStops.length >= 2 && isLoading && (
                <div className="text-sm text-gray-600 mb-2 px-2">Loading route...</div>
              )}
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={validStops.length === 0 ? 8 : 9}
                options={{
                  ...mapOptions,
                  // Change cursor to crosshair when in coordinate editing mode
                  draggableCursor: coordinateEditingMode?.routeIndex === routeIndex ? 'crosshair' : undefined,
                }}
                onLoad={handleMapLoad}
                onClick={onMapClick}
              >
                {directionsChunks.length > 0 && validStops.length >= 2 && (
                  directionsChunks.map((chunk, index) => (
                    <DirectionsRenderer
                      key={`directions-chunk-${index}`}
                      directions={chunk.directions}
                      options={directionsRendererOptions}
                    />
                  ))
                )}
                {validStops.map((stop, index) => {
                  const isEditingThisStop = coordinateEditingMode?.routeIndex === routeIndex && coordinateEditingMode?.stopIndex === stop.originalIndex;
                  return (
                    <Marker
                      key={stop.id}
                      position={{ lat: stop.lat, lng: stop.lng }}
                      title={stop.name}
                      icon={{
                        url: getMarkerIcon(index),
                        // Make marker larger and more prominent when in editing mode
                        scaledSize: isEditingThisStop ? new google.maps.Size(40, 40) : undefined,
                      }}
                      animation={isEditingThisStop ? google.maps.Animation.BOUNCE : undefined}
                    />
                  );
                })}
              </GoogleMap>
            </>
          )}
        </>
      )}
    </div>
  );
}
