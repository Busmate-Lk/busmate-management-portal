'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type {
  TrackedBus,
  TrackingStats,
  TrackingFilterState,
  TrackingFilterOptions,
  TrackingStatsCardMetric,
  MapCenter,
  MapViewMode,
} from '@/types/location-tracking';
import {
  getTrackedBuses,
  getTrackingStats,
  getTrackingStatsMetrics,
  getTrackingFilterOptions,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  AUTO_REFRESH_INTERVAL,
} from '@/data/mot/location-tracking';

// ── Types ─────────────────────────────────────────────────────────

interface UseLocationTrackingOptions {
  /** Auto-refresh interval in milliseconds (default: 10000) */
  refreshInterval?: number;
  /** Enable auto-refresh by default (default: true) */
  autoRefreshEnabled?: boolean;
}

interface UseLocationTrackingReturn {
  // Data
  buses: TrackedBus[];
  filteredBuses: TrackedBus[];
  stats: TrackingStats;
  statsMetrics: TrackingStatsCardMetric[];
  filterOptions: TrackingFilterOptions;
  
  // Filters
  filters: TrackingFilterState;
  setFilters: (filters: TrackingFilterState) => void;
  
  // Selection
  selectedBus: TrackedBus | null;
  setSelectedBus: (bus: TrackedBus | null) => void;
  
  // Map State
  mapCenter: MapCenter;
  setMapCenter: (center: MapCenter) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;
  viewMode: MapViewMode;
  setViewMode: (mode: MapViewMode) => void;
  
  // UI State
  statsCollapsed: boolean;
  setStatsCollapsed: (collapsed: boolean) => void;
  
  // Loading & Error
  isLoading: boolean;
  error: string | null;
  
  // Refresh
  refresh: () => void;
  lastUpdate: Date | null;
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
  
  // Actions
  focusOnBus: (bus: TrackedBus) => void;
  resetView: () => void;
}

// ── Hook ──────────────────────────────────────────────────────────

export function useLocationTracking(
  options: UseLocationTrackingOptions = {}
): UseLocationTrackingReturn {
  const {
    refreshInterval: defaultInterval = AUTO_REFRESH_INTERVAL,
    autoRefreshEnabled = true,
  } = options;

  // Data State
  const [buses, setBuses] = useState<TrackedBus[]>([]);
  const [stats, setStats] = useState<TrackingStats>({
    totalBusesTracking: 0,
    activeBuses: 0,
    idleBuses: 0,
    offlineBuses: 0,
    busesOnTime: 0,
    busesDelayed: 0,
    averageSpeed: 0,
    totalPassengers: 0,
    activeRoutes: 0,
    alerts: { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
  });
  const [statsMetrics, setStatsMetrics] = useState<TrackingStatsCardMetric[]>([]);
  const [filterOptions, setFilterOptions] = useState<TrackingFilterOptions>({
    routes: [],
    operators: [],
    tripStatuses: [],
  });

  // Filter State
  const [filters, setFilters] = useState<TrackingFilterState>({
    search: '',
    routeId: 'all',
    operatorId: 'all',
    tripStatus: 'all',
    deviceStatus: 'all',
    movementStatus: 'all',
    showOnlyActive: false,
    showOfflineDevices: true,
  });

  // Selection State
  const [selectedBus, setSelectedBus] = useState<TrackedBus | null>(null);

  // Map State
  const [mapCenter, setMapCenter] = useState<MapCenter>(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_MAP_ZOOM);
  const [viewMode, setViewMode] = useState<MapViewMode>('standard');

  // UI State
  const [statsCollapsed, setStatsCollapsed] = useState(false);

  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refresh State
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(autoRefreshEnabled);
  const [refreshInterval, setRefreshInterval] = useState(defaultInterval / 1000);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load data
  const loadData = useCallback(async (forceRefresh: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate network delay for realistic feel
      await new Promise((resolve) => setTimeout(resolve, 300));

      const loadedBuses = getTrackedBuses(forceRefresh);
      const loadedStats = getTrackingStats();
      const loadedMetrics = getTrackingStatsMetrics();
      const loadedFilterOptions = getTrackingFilterOptions();

      setBuses(loadedBuses);
      setStats(loadedStats);
      setStatsMetrics(loadedMetrics);
      setFilterOptions(loadedFilterOptions);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error loading tracking data:', err);
      setError('Failed to load tracking data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        loadData(true);
      }, refreshInterval * 1000);
    } else {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, loadData]);

  // Filter buses
  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          bus.bus.registrationNumber?.toLowerCase().includes(searchLower) ||
          bus.route?.name?.toLowerCase().includes(searchLower) ||
          bus.bus.operatorName?.toLowerCase().includes(searchLower) ||
          bus.bus.id?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Route filter
      if (filters.routeId !== 'all' && bus.route?.id !== filters.routeId) {
        return false;
      }

      // Operator filter
      if (filters.operatorId !== 'all' && bus.bus.operatorId !== filters.operatorId) {
        return false;
      }

      // Trip status filter
      if (filters.tripStatus !== 'all' && bus.trip?.status !== filters.tripStatus) {
        return false;
      }

      // Device status filter
      if (filters.deviceStatus !== 'all' && bus.deviceStatus !== filters.deviceStatus) {
        return false;
      }

      // Movement status filter
      if (filters.movementStatus !== 'all' && bus.movementStatus !== filters.movementStatus) {
        return false;
      }

      // Show only active filter
      if (
        filters.showOnlyActive &&
        bus.trip?.status !== 'in_transit' &&
        bus.trip?.status !== 'on_time'
      ) {
        return false;
      }

      // Show offline devices filter
      if (!filters.showOfflineDevices && bus.deviceStatus === 'offline') {
        return false;
      }

      return true;
    });
  }, [buses, filters]);

  // Focus on a specific bus
  const focusOnBus = useCallback((bus: TrackedBus) => {
    const [lng, lat] = bus.location.location.coordinates;
    setMapCenter({ lat, lng });
    setMapZoom(15);
    setSelectedBus(bus);
  }, []);

  // Reset view to default
  const resetView = useCallback(() => {
    setMapCenter(DEFAULT_MAP_CENTER);
    setMapZoom(DEFAULT_MAP_ZOOM);
    setSelectedBus(null);
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  return {
    // Data
    buses,
    filteredBuses,
    stats,
    statsMetrics,
    filterOptions,

    // Filters
    filters,
    setFilters,

    // Selection
    selectedBus,
    setSelectedBus,

    // Map State
    mapCenter,
    setMapCenter,
    mapZoom,
    setMapZoom,
    viewMode,
    setViewMode,

    // UI State
    statsCollapsed,
    setStatsCollapsed,

    // Loading & Error
    isLoading,
    error,

    // Refresh
    refresh,
    lastUpdate,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,

    // Actions
    focusOnBus,
    resetView,
  };
}
