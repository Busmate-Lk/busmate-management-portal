'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Maximize2, Radio, Settings, LayoutGrid } from 'lucide-react';
import { useJsApiLoader } from '@react-google-maps/api';

// Page Context
import { useSetPageMetadata, useSetPageActions } from '@/context/PageContext';

// Custom Hook
import { useLocationTracking } from '@/hooks/useLocationTracking';

// Components
import {
  TrackingStatsCards,
  TrackingSearchFilters,
  TrackingMap,
  TrackingBusList,
} from '@/components/mot/location-tracking';

// Types
import type { TrackedBus, MapViewMode } from '@/types/location-tracking';

// ── Google Maps Libraries ─────────────────────────────────────────

const GOOGLE_MAPS_LIBRARIES: ('geometry' | 'places')[] = ['geometry', 'places'];

// ── Main Page Component ───────────────────────────────────────────

export default function LocationTrackingPage() {
  const router = useRouter();

  // Set page metadata
  useSetPageMetadata({
    title: 'Location Tracking',
    description: 'Real-time bus location monitoring and fleet tracking',
    activeItem: 'location-tracking',
    showBreadcrumbs: true,
    breadcrumbs: [{ label: 'Location Tracking' }],
  });

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Use custom hook for all state management
  const {
    buses,
    filteredBuses,
    statsMetrics,
    filterOptions,
    filters,
    setFilters,
    selectedBus,
    setSelectedBus,
    mapCenter,
    setMapCenter,
    mapZoom,
    setMapZoom,
    viewMode,
    setViewMode,
    statsCollapsed,
    setStatsCollapsed,
    isLoading,
    error,
    refresh,
    lastUpdate,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    focusOnBus,
  } = useLocationTracking();

  // Handle view bus details
  const handleViewBusDetails = useCallback(
    (bus: TrackedBus) => {
      // Navigate to a detailed bus view page (if exists)
      // For now, just log or show a toast
      console.log('View details for bus:', bus.bus.registrationNumber);
    },
    []
  );

  // Handle view route
  const handleViewRoute = useCallback(
    (routeId: string) => {
      // Navigate to route details page
      router.push(`/mot/routes/${routeId}`);
    },
    [router]
  );

  // Handle view mode changes
  const handleViewModeChange = useCallback(
    (mode: MapViewMode) => {
      setViewMode(mode);
      // Collapse stats when going fullscreen
      if (mode === 'fullscreen') {
        setStatsCollapsed(true);
      }
    },
    [setViewMode, setStatsCollapsed]
  );

  // Set page actions
  useSetPageActions(
    <div className="flex items-center gap-2 shrink-0">
      {/* Last update indicator */}
      {lastUpdate && (
        <span className="text-xs text-gray-500 hidden sm:inline">
          Updated{' '}
          {lastUpdate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      )}

      {/* Live/Paused Toggle */}
      <button
        onClick={() => setAutoRefresh(!autoRefresh)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          autoRefresh
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Radio className={`h-3.5 w-3.5 ${autoRefresh ? 'animate-pulse' : ''}`} />
        {autoRefresh ? 'Live' : 'Paused'}
      </button>

      {/* Refresh Button */}
      <button
        onClick={refresh}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">Refresh</span>
      </button>

      {/* Fullscreen Toggle */}
      <button
        onClick={() =>
          handleViewModeChange(viewMode === 'fullscreen' ? 'standard' : 'fullscreen')
        }
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Maximize2 className="h-4 w-4" />
        <span className="hidden sm:inline">
          {viewMode === 'fullscreen' ? 'Exit Fullscreen' : 'Fullscreen'}
        </span>
      </button>
    </div>
  );

  // Fullscreen view - only show map
  if (viewMode === 'fullscreen') {
    return (
      <TrackingMap
        buses={filteredBuses}
        selectedBus={selectedBus}
        onBusSelect={setSelectedBus}
        center={mapCenter}
        zoom={mapZoom}
        onCenterChange={setMapCenter}
        onZoomChange={setMapZoom}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        isLoaded={isLoaded}
        isLoading={isLoading}
        onViewBusDetails={handleViewBusDetails}
        onViewRoute={handleViewRoute}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards - Collapsible */}
      <TrackingStatsCards
        metrics={statsMetrics}
        loading={isLoading && statsMetrics.length === 0}
        isCollapsed={statsCollapsed}
        onToggleCollapse={() => setStatsCollapsed(!statsCollapsed)}
        lastUpdate={lastUpdate}
      />

      {/* Search & Filters */}
      <TrackingSearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        filterOptions={filterOptions}
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={() => setAutoRefresh(!autoRefresh)}
        refreshInterval={refreshInterval}
        onRefreshIntervalChange={setRefreshInterval}
        isLoading={isLoading}
        filteredCount={filteredBuses.length}
        totalCount={buses.length}
        onRefresh={refresh}
      />

      {/* Main Content: Map + Bus List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map - Takes 3 columns on large screens */}
        <div className="lg:col-span-3">
          <TrackingMap
            buses={filteredBuses}
            selectedBus={selectedBus}
            onBusSelect={setSelectedBus}
            center={mapCenter}
            zoom={mapZoom}
            onCenterChange={setMapCenter}
            onZoomChange={setMapZoom}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            isLoaded={isLoaded}
            isLoading={isLoading}
            onViewBusDetails={handleViewBusDetails}
            onViewRoute={handleViewRoute}
          />
        </div>

        {/* Bus List Sidebar - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-[500px] lg:h-[600px] overflow-hidden">
            <TrackingBusList
              buses={filteredBuses}
              selectedBus={selectedBus}
              onBusSelect={setSelectedBus}
              onBusFocus={focusOnBus}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
