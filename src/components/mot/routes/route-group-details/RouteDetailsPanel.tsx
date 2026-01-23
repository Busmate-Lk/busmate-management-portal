'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Navigation,
  Map,
  List,
  Clock,
  Eye,
  Edit,
  MapPin,
  ArrowRight,
  Route as RouteIcon,
  ChevronRight,
  Info
} from 'lucide-react';
import type { RouteResponse } from '../../../../../generated/api-clients/route-management';
import { RouteMap } from '../RouteMap';
import { RouteSchedulesTab } from './RouteSchedulesTab';

interface RouteDetailsPanelProps {
  routes: RouteResponse[];
}

type TabType = 'overview' | 'map' | 'schedules';

export function RouteDetailsPanel({ routes }: RouteDetailsPanelProps) {
  const router = useRouter();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(
    routes.length > 0 ? routes[0].id || null : null
  );
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const selectedRoute = useMemo(() => 
    routes.find(r => r.id === selectedRouteId),
    [routes, selectedRouteId]
  );

  const outboundRoutes = routes.filter(r => r.direction === 'OUTBOUND');
  const inboundRoutes = routes.filter(r => r.direction === 'INBOUND');

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Get ordered stops for display
  const getOrderedStops = (route: RouteResponse) => {
    if (!route.routeStops || route.routeStops.length === 0) {
      return [
        { stopId: route.startStopId, stopName: route.startStopName, type: 'start', distance: 0 },
        { stopId: route.endStopId, stopName: route.endStopName, type: 'end', distance: route.distanceKm || 0 }
      ];
    }

    const stops = [];
    
    // Start stop
    stops.push({
      stopId: route.startStopId,
      stopName: route.startStopName,
      type: 'start',
      distance: 0
    });

    // Intermediate stops sorted by order
    const sortedIntermediateStops = [...route.routeStops]
      .filter(s => s.stopName !== route.startStopName && s.stopName !== route.endStopName)
      .sort((a, b) => (a.stopOrder || 0) - (b.stopOrder || 0));

    sortedIntermediateStops.forEach(stop => {
      stops.push({
        stopId: stop.stopId,
        stopName: stop.stopName,
        type: 'intermediate',
        distance: stop.distanceFromStartKm || 0
      });
    });

    // End stop
    stops.push({
      stopId: route.endStopId,
      stopName: route.endStopName,
      type: 'end',
      distance: route.distanceKm || 0
    });

    return stops;
  };

  if (routes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <RouteIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Routes Defined</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            This route group doesn't have any routes yet. Add outbound and inbound routes to complete the route group.
          </p>
          <button
            onClick={() => router.push('/mot/routes/workspace')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <RouteIcon className="w-4 h-4" />
            Create Route
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: List },
    { id: 'map' as TabType, label: 'Map View', icon: Map },
    { id: 'schedules' as TabType, label: 'Schedules', icon: Clock }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Route Direction Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {/* Outbound routes */}
          {outboundRoutes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id || null)}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                selectedRouteId === route.id
                  ? 'border-emerald-500 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedRouteId === route.id ? 'bg-emerald-100' : 'bg-gray-100'
                }`}>
                  <Navigation className={`w-3.5 h-3.5 rotate-45 ${
                    selectedRouteId === route.id ? 'text-emerald-600' : 'text-gray-500'
                  }`} />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold">Outbound</div>
                  <div className="text-xs text-gray-400 font-normal truncate max-w-[140px]">
                    {route.startStopName} → {route.endStopName}
                  </div>
                </div>
                <span className="sm:hidden">Outbound</span>
              </div>
            </button>
          ))}

          {/* Inbound routes */}
          {inboundRoutes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id || null)}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                selectedRouteId === route.id
                  ? 'border-cyan-500 text-cyan-700 bg-cyan-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedRouteId === route.id ? 'bg-cyan-100' : 'bg-gray-100'
                }`}>
                  <Navigation className={`w-3.5 h-3.5 -rotate-135 ${
                    selectedRouteId === route.id ? 'text-cyan-600' : 'text-gray-500'
                  }`} />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold">Inbound</div>
                  <div className="text-xs text-gray-400 font-normal truncate max-w-[140px]">
                    {route.startStopName} → {route.endStopName}
                  </div>
                </div>
                <span className="sm:hidden">Inbound</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedRoute && (
        <>
          {/* Sub Tabs */}
          <div className="px-4 sm:px-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors rounded-t-lg -mb-px ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 border-x border-t border-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Route Info Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Route Name</div>
                    <div className="font-semibold text-gray-900 truncate">{selectedRoute.name || 'Unnamed'}</div>
                    {selectedRoute.routeNumber && (
                      <div className="text-xs text-gray-500 mt-0.5">#{selectedRoute.routeNumber}</div>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Direction</div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full ${
                      selectedRoute.direction === 'OUTBOUND'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-cyan-100 text-cyan-700'
                    }`}>
                      <Navigation className={`w-3 h-3 ${
                        selectedRoute.direction === 'OUTBOUND' ? 'rotate-45' : '-rotate-135'
                      }`} />
                      {selectedRoute.direction}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Distance</div>
                    <div className="font-semibold text-gray-900">
                      {selectedRoute.distanceKm?.toFixed(1) || '0'} <span className="font-normal text-gray-500">km</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Duration</div>
                    <div className="font-semibold text-gray-900">{formatDuration(selectedRoute.estimatedDurationMinutes)}</div>
                  </div>
                </div>

                {/* Route Through */}
                {selectedRoute.routeThrough && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-blue-900">Route Through</div>
                        <p className="text-sm text-blue-700 mt-0.5">{selectedRoute.routeThrough}</p>
                        {(selectedRoute.routeThroughSinhala || selectedRoute.routeThroughTamil) && (
                          <div className="flex gap-4 mt-2 text-xs text-blue-600">
                            {selectedRoute.routeThroughSinhala && <span>{selectedRoute.routeThroughSinhala}</span>}
                            {selectedRoute.routeThroughTamil && <span>{selectedRoute.routeThroughTamil}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stops Timeline */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Route Stops</h3>
                    <span className="text-xs text-gray-500">
                      {getOrderedStops(selectedRoute).length} stops
                    </span>
                  </div>
                  
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gradient-to-b from-emerald-400 via-gray-200 to-red-400" />

                    <div className="space-y-0">
                      {getOrderedStops(selectedRoute).map((stop, index) => {
                        const isFirst = index === 0;
                        const isLast = index === getOrderedStops(selectedRoute).length - 1;

                        return (
                          <div
                            key={stop.stopId || index}
                            className="relative flex items-center gap-4 py-3 group"
                          >
                            {/* Timeline node */}
                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                              isFirst
                                ? 'bg-emerald-500 text-white'
                                : isLast
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white border-2 border-gray-300 text-gray-600 group-hover:border-blue-400'
                            }`}>
                              <span className="text-xs font-bold">{index + 1}</span>
                            </div>

                            {/* Stop info */}
                            <div className="flex-1 min-w-0 flex items-center justify-between bg-white rounded-lg border border-gray-100 px-4 py-2.5 group-hover:border-blue-200 group-hover:bg-blue-50/30 transition-colors">
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 truncate">
                                  {stop.stopName || 'Unknown Stop'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {stop.distance?.toFixed(1) || '0'} km from start
                                  {isFirst && ' • Origin'}
                                  {isLast && ' • Destination'}
                                </div>
                              </div>

                              {stop.stopId && (
                                <button
                                  onClick={() => router.push(`/mot/bus-stops/${stop.stopId}`)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                                  title="View stop details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Route Metadata */}
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Route Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Route ID</span>
                      <span className="font-mono text-gray-700 text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {selectedRoute.id?.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Road Type</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        selectedRoute.roadType === 'EXPRESSWAY'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedRoute.roadType || 'Normal'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Created</span>
                      <span className="text-gray-700">
                        {selectedRoute.createdAt
                          ? new Date(selectedRoute.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Last Updated</span>
                      <span className="text-gray-700">
                        {selectedRoute.updatedAt
                          ? new Date(selectedRoute.updatedAt).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Map Tab */}
            {activeTab === 'map' && (
              <RouteMap route={selectedRoute} />
            )}

            {/* Schedules Tab */}
            {activeTab === 'schedules' && (
              <RouteSchedulesTab
                routeId={selectedRoute.id!}
                routeName={selectedRoute.name || 'Unnamed Route'}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
