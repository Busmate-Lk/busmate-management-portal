'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import {
  Maximize2,
  Minimize2,
  Layers,
  Bus,
  Navigation,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Map as MapIcon,
} from 'lucide-react';
import { BusDetailPopup } from './BusDetailPopup';
import type { TrackedBus, MapViewMode, MapCenter } from '@/types/location-tracking';

// ── Props ─────────────────────────────────────────────────────────

interface TrackingMapProps {
  /** Array of tracked buses to display */
  buses: TrackedBus[];
  /** Currently selected bus */
  selectedBus: TrackedBus | null;
  /** Callback when a bus is selected */
  onBusSelect: (bus: TrackedBus | null) => void;
  /** Current map center */
  center: MapCenter;
  /** Current zoom level */
  zoom: number;
  /** Callback when center changes */
  onCenterChange: (center: MapCenter) => void;
  /** Callback when zoom changes */
  onZoomChange: (zoom: number) => void;
  /** Current view mode */
  viewMode: MapViewMode;
  /** Callback to change view mode */
  onViewModeChange: (mode: MapViewMode) => void;
  /** Whether the map is loaded */
  isLoaded: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Callback for viewing full bus details */
  onViewBusDetails?: (bus: TrackedBus) => void;
  /** Callback for viewing route */
  onViewRoute?: (routeId: string) => void;
}

// ── Map Configuration ─────────────────────────────────────────────

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }],
    },
  ],
};

// ── Bus Marker Component ──────────────────────────────────────────

interface BusMarkerProps {
  bus: TrackedBus;
  isSelected: boolean;
  onClick: () => void;
}

function BusMarker({ bus, isSelected, onClick }: BusMarkerProps) {
  const isOnline = bus.deviceStatus === 'online';
  const isMoving = bus.movementStatus === 'moving';
  const isDelayed = bus.trip?.status === 'delayed';

  // Determine marker color based on status
  const getMarkerColor = () => {
    if (!isOnline) return { bg: '#EF4444', border: '#B91C1C' }; // Red for offline
    if (isDelayed) return { bg: '#F59E0B', border: '#D97706' }; // Amber for delayed
    if (isMoving) return { bg: '#10B981', border: '#059669' }; // Green for moving
    return { bg: '#6B7280', border: '#4B5563' }; // Gray for idle/stopped
  };

  const colors = getMarkerColor();

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transform transition-all duration-200 hover:scale-110 ${
        isSelected ? 'scale-125 z-50' : 'z-10'
      }`}
      style={{ transform: `rotate(${bus.location.heading || 0}deg)` }}
    >
      {/* Outer ring for selection */}
      {isSelected && (
        <div className="absolute inset-0 -m-2 rounded-full bg-blue-500/20 animate-ping" />
      )}
      
      {/* Main marker */}
      <div
        className={`relative flex items-center justify-center rounded-full shadow-lg transition-shadow ${
          isSelected ? 'shadow-xl ring-4 ring-blue-500/50' : ''
        }`}
        style={{
          width: isSelected ? '40px' : '32px',
          height: isSelected ? '40px' : '32px',
          backgroundColor: colors.bg,
          border: `3px solid ${colors.border}`,
        }}
      >
        {isMoving ? (
          <Navigation
            className="text-white"
            style={{
              width: isSelected ? '20px' : '16px',
              height: isSelected ? '20px' : '16px',
            }}
          />
        ) : (
          <Bus
            className="text-white"
            style={{
              width: isSelected ? '18px' : '14px',
              height: isSelected ? '18px' : '14px',
              transform: `rotate(-${bus.location.heading || 0}deg)`, // Counter-rotate the icon
            }}
          />
        )}
      </div>

      {/* Speed indicator for moving buses */}
      {isOnline && isMoving && (
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white px-1.5 py-0.5 rounded text-xs font-medium shadow whitespace-nowrap"
          style={{ transform: `translateX(-50%) rotate(-${bus.location.heading || 0}deg)` }}
        >
          {bus.location.speed} km/h
        </div>
      )}
    </div>
  );
}

// ── Map Controls Component ────────────────────────────────────────

interface MapControlsProps {
  map: google.maps.Map | null;
  viewMode: MapViewMode;
  onViewModeChange: (mode: MapViewMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  showTraffic: boolean;
  onToggleTraffic: () => void;
}

function MapControls({
  map,
  viewMode,
  onViewModeChange,
  onZoomIn,
  onZoomOut,
  onResetView,
  showTraffic,
  onToggleTraffic,
}: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      {/* View Mode Toggle */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex flex-col">
        <button
          onClick={() => onViewModeChange(viewMode === 'fullscreen' ? 'standard' : 'fullscreen')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title={viewMode === 'fullscreen' ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {viewMode === 'fullscreen' ? (
            <Minimize2 className="h-4 w-4 text-gray-700" />
          ) : (
            <Maximize2 className="h-4 w-4 text-gray-700" />
          )}
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex flex-col">
        <button
          onClick={onZoomIn}
          className="p-2 hover:bg-gray-100 rounded-t transition-colors border-b border-gray-100"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4 text-gray-700" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 hover:bg-gray-100 rounded-b transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      {/* Other Controls */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex flex-col">
        <button
          onClick={onResetView}
          className="p-2 hover:bg-gray-100 rounded-t transition-colors border-b border-gray-100"
          title="Reset view"
        >
          <Crosshair className="h-4 w-4 text-gray-700" />
        </button>
        <button
          onClick={onToggleTraffic}
          className={`p-2 hover:bg-gray-100 rounded-b transition-colors ${
            showTraffic ? 'bg-blue-50' : ''
          }`}
          title="Toggle traffic layer"
        >
          <Layers className={`h-4 w-4 ${showTraffic ? 'text-blue-600' : 'text-gray-700'}`} />
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────

export function TrackingMap({
  buses,
  selectedBus,
  onBusSelect,
  center,
  zoom,
  onCenterChange,
  onZoomChange,
  viewMode,
  onViewModeChange,
  isLoaded,
  isLoading = false,
  onViewBusDetails,
  onViewRoute,
}: TrackingMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Handle map unmount
  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Handle center change
  const handleCenterChanged = useCallback(() => {
    if (!mapRef.current) return;
    const newCenter = mapRef.current.getCenter();
    if (newCenter) {
      const lat = newCenter.lat();
      const lng = newCenter.lng();
      // Only update if significantly different
      if (Math.abs(lat - center.lat) > 0.0001 || Math.abs(lng - center.lng) > 0.0001) {
        onCenterChange({ lat, lng });
      }
    }
  }, [center, onCenterChange]);

  // Handle zoom change
  const handleZoomChanged = useCallback(() => {
    if (!mapRef.current) return;
    const newZoom = mapRef.current.getZoom();
    if (newZoom !== undefined && newZoom !== zoom) {
      onZoomChange(newZoom);
    }
  }, [zoom, onZoomChange]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || zoom;
      mapRef.current.setZoom(Math.min(currentZoom + 1, 20));
    }
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || zoom;
      mapRef.current.setZoom(Math.max(currentZoom - 1, 5));
    }
  }, [zoom]);

  // Reset view to show all buses
  const handleResetView = useCallback(() => {
    if (!mapRef.current || buses.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    buses.forEach((bus) => {
      const [lng, lat] = bus.location.location.coordinates;
      bounds.extend({ lat, lng });
    });
    mapRef.current.fitBounds(bounds, 50);
  }, [buses]);

  // Toggle traffic layer
  const handleToggleTraffic = useCallback(() => {
    setShowTraffic((prev) => {
      const newValue = !prev;
      if (mapRef.current) {
        if (newValue) {
          if (!trafficLayerRef.current) {
            trafficLayerRef.current = new google.maps.TrafficLayer();
          }
          trafficLayerRef.current.setMap(mapRef.current);
        } else {
          if (trafficLayerRef.current) {
            trafficLayerRef.current.setMap(null);
          }
        }
      }
      return newValue;
    });
  }, []);

  // Handle bus marker click
  const handleBusClick = useCallback(
    (bus: TrackedBus) => {
      onBusSelect(bus);
      // Center map on selected bus
      const [lng, lat] = bus.location.location.coordinates;
      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng });
      }
    },
    [onBusSelect]
  );

  // Close popup when clicking on map
  const handleMapClick = useCallback(() => {
    onBusSelect(null);
  }, [onBusSelect]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedBus) {
        onBusSelect(null);
      }
      if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        onViewModeChange(viewMode === 'fullscreen' ? 'standard' : 'fullscreen');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBus, onBusSelect, viewMode, onViewModeChange]);

  // Map container class based on view mode
  const containerClass = useMemo(() => {
    switch (viewMode) {
      case 'fullscreen':
        return 'fixed inset-0 z-50';
      case 'split':
        return 'h-[500px] lg:h-[600px]';
      default:
        return 'h-[500px] lg:h-[600px]';
    }
  }, [viewMode]);

  if (!isLoaded) {
    return (
      <div className={`${containerClass} bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClass} bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm text-gray-600">Updating locations...</span>
          </div>
        </div>
      )}

      {/* Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={mapOptions}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        onCenterChanged={handleCenterChanged}
        onZoomChanged={handleZoomChanged}
        onClick={handleMapClick}
      >
        {/* Bus Markers */}
        {buses.map((bus) => {
          const [lng, lat] = bus.location.location.coordinates;
          return (
            <OverlayView
              key={bus.id}
              position={{ lat, lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <BusMarker
                bus={bus}
                isSelected={selectedBus?.id === bus.id}
                onClick={() => handleBusClick(bus)}
              />
            </OverlayView>
          );
        })}

        {/* Selected Bus Popup */}
        {selectedBus && (
          <OverlayView
            position={{
              lat: selectedBus.location.location.coordinates[1],
              lng: selectedBus.location.location.coordinates[0],
            }}
            mapPaneName={OverlayView.FLOAT_PANE}
          >
            <div className="transform -translate-x-1/2 -translate-y-full -mt-14">
              <BusDetailPopup
                bus={selectedBus}
                onClose={() => onBusSelect(null)}
                onViewFullDetails={onViewBusDetails}
                onViewRoute={onViewRoute}
              />
            </div>
          </OverlayView>
        )}
      </GoogleMap>

      {/* Map Controls */}
      <MapControls
        map={mapRef.current}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        showTraffic={showTraffic}
        onToggleTraffic={handleToggleTraffic}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Legend</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-600" />
            <span className="text-gray-600">Moving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-500 border-2 border-gray-600" />
            <span className="text-gray-600">Idle/Stopped</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-600" />
            <span className="text-gray-600">Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-600" />
            <span className="text-gray-600">Offline</span>
          </div>
        </div>
      </div>

      {/* Bus Count Badge */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 z-10 flex items-center gap-2">
        <Bus className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">
          {buses.length} {buses.length === 1 ? 'bus' : 'buses'}
        </span>
      </div>

      {/* Fullscreen exit hint */}
      {viewMode === 'fullscreen' && (
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg z-10">
          Press <kbd className="bg-white/20 px-1.5 py-0.5 rounded mx-1">Esc</kbd> or click minimize to exit fullscreen
        </div>
      )}
    </div>
  );
}
