'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Navigation, 
  List, 
  Map, 
  Clock, 
  MoreHorizontal, 
  Plus,
  Route as RouteIcon,
  Eye,
  Edit
} from 'lucide-react';
import type { RouteResponse, RouteStopResponse } from '@/lib/api-client/route-management';
import { RouteMap } from './RouteMap';

interface RouteTabType {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface RoutesTabsSectionProps {
  routes: RouteResponse[];
}

export function RoutesTabsSection({ routes }: RoutesTabsSectionProps) {
  const router = useRouter();
  const [activeRouteTab, setActiveRouteTab] = useState<string>(routes.length > 0 ? routes[0].id || '' : '');
  const [activeSubTab, setActiveSubTab] = useState<string>('details');

  const subTabs: RouteTabType[] = [
    { id: 'map', label: 'Visual View', icon: <Map className="w-4 h-4" /> },
    { id: 'details', label: 'Route Details', icon: <List className="w-4 h-4" /> },
    { id: 'schedules', label: 'Schedules', icon: <Clock className="w-4 h-4" /> },
    { id: 'more', label: 'More', icon: <MoreHorizontal className="w-4 h-4" /> },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getActiveRoute = () => {
    return routes.find(route => route.id === activeRouteTab);
  };

  // Fixed: Sort route stops by stopOrder and handle start/end stops properly
  const getOrderedStops = (route: RouteResponse) => {
    if (!route.routeStops || route.routeStops.length === 0) {
      // If no intermediate stops, just return start and end
      return {
        startStop: {
          stopId: undefined,
          stopName: route.startStopName,
          location: route.startStopLocation,
          stopOrder: 0,
          distanceFromStartKm: 0
        },
        intermediateStops: [],
        endStop: {
          stopId: undefined,
          stopName: route.endStopName,
          location: route.endStopLocation,
          stopOrder: 999,
          distanceFromStartKm: route.distanceKm || 0
        }
      };
    }

    // Sort all stops by stopOrder
    const sortedStops = [...route.routeStops].sort((a, b) => (a.stopOrder || 0) - (b.stopOrder || 0));
    
    // Find start and end stops from the sorted list
    const startStop = sortedStops.find(stop => 
      stop.stopName === route.startStopName || 
      stop.stopOrder === 0 ||
      stop.distanceFromStartKm === 0
    );
    
    const endStop = sortedStops.find(stop => 
      stop.stopName === route.endStopName ||
      stop.stopOrder === Math.max(...sortedStops.map(s => s.stopOrder || 0))
    );

    // Get intermediate stops (excluding start and end)
    const intermediateStops = sortedStops.filter(stop => 
      stop.stopId !== startStop?.stopId && 
      stop.stopId !== endStop?.stopId
    );

    return {
      startStop: startStop || {
        stopId: undefined,
        stopName: route.startStopName,
        location: route.startStopLocation,
        stopOrder: 0,
        distanceFromStartKm: 0
      },
      intermediateStops,
      endStop: endStop || {
        stopId: undefined,
        stopName: route.endStopName,
        location: route.endStopLocation,
        stopOrder: 999,
        distanceFromStartKm: route.distanceKm || 0
      }
    };
  };

  if (routes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
        <RouteIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Routes Found</h3>
        <p className="text-gray-600 mb-6">
          This route group doesn't have any routes yet. Create your first route to get started.
        </p>
        {/* <button
          onClick={onAddRoute}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add First Route
        </button> */}
      </div>
    );
  }

  const activeRoute = getActiveRoute();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Route Tabs (Outbound/Inbound) */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-1 p-1">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setActiveRouteTab(route.id || '')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeRouteTab === route.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Navigation className={`w-4 h-4 ${route.direction === 'OUTBOUND' ? 'rotate-45' : 'rotate-225'}`} />
                <span>{route.direction === 'OUTBOUND' ? 'Outbound' : 'Inbound'}</span>
                <span className="text-xs text-gray-500">
                  {route.startStopName} → {route.endStopName}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sub Tabs */}
      {activeRoute && (
        <>
          <div className="border-b border-gray-200">
            <div className="flex gap-1 p-1">
              {subTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    activeSubTab === tab.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Route Details Tab */}
            {activeSubTab === 'details' && (
              <div className="space-y-6">
                {/* Route Info Bar */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Route Name</div>
                      <div className="text-gray-900">{activeRoute.name || 'Unnamed Route'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Direction</div>
                      <div className="text-gray-900">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activeRoute.direction === 'OUTBOUND' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {activeRoute.direction}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Distance</div>
                      <div className="text-gray-900">{activeRoute.distanceKm || 0} km</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Duration</div>
                      <div className="text-gray-900">
                        {Math.floor((activeRoute.estimatedDurationMinutes || 0) / 60)}h{' '}
                        {(activeRoute.estimatedDurationMinutes || 0) % 60}m
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stops Timeline - Fixed ordering */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Stops</h3>
                  <div className="space-y-3">
                    {(() => {
                      const { startStop, intermediateStops, endStop } = getOrderedStops(activeRoute);
                      const totalStops = intermediateStops.length + 2;

                      return (
                        <>
                          {/* Start Stop */}
                          <div className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">1</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {startStop.stopName || 'Start Stop'}
                              </div>
                              <div className="text-sm text-gray-600">
                                {startStop.distanceFromStartKm || 0} km • Starting Point
                              </div>
                            </div>
                            {startStop.stopId && (
                              <div className="flex items-center gap-2">
                                <button onClick={() => router.push(`/mot/bus-stops/${startStop.stopId}`)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="View stop details">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => router.push(`/mot/bus-stops/${startStop.stopId}/edit`)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="Edit stop">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Intermediate Stops - Properly ordered */}
                          {intermediateStops.map((stop, index) => {
                            const sequence = index + 2;
                            return (
                              <div key={stop.stopId || index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">{sequence}</div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {stop.stopName || `Stop ${sequence}`}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {stop.distanceFromStartKm || 0} km from start
                                  </div>
                                </div>
                                {stop.stopId && (
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => router.push(`/mot/bus-stops/${stop.stopId}`)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="View stop details">
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => router.push(`/mot/bus-stops/${stop.stopId}/edit`)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="Edit stop">
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* End Stop */}
                          <div className="flex items-center gap-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">{totalStops}</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {endStop.stopName || 'End Stop'}
                              </div>
                              <div className="text-sm text-gray-600">
                                {endStop.distanceFromStartKm || activeRoute.distanceKm || 0} km • Final Destination
                              </div>
                            </div>
                            {endStop.stopId && (
                              <div className="flex items-center gap-2">
                                <button onClick={() => router.push(`/mot/bus-stops/${endStop.stopId}`)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="View stop details">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => router.push(`/mot/bus-stops/${endStop.stopId}/edit`)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="Edit stop">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Route Metadata */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Route Metadata</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Route ID:</span>
                      <span className="ml-2 text-gray-900 font-mono">{activeRoute.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2 text-gray-900">
                        {formatDate(activeRoute.createdAt)}
                        {activeRoute.createdBy && ` by ${activeRoute.createdBy}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Updated:</span>
                      <span className="ml-2 text-gray-900">
                        {formatDate(activeRoute.updatedAt)}
                        {activeRoute.updatedBy && ` by ${activeRoute.updatedBy}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Route Group:</span>
                      <span className="ml-2 text-gray-900">{activeRoute.routeGroupName}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Visual Map Tab */}
            {activeSubTab === 'map' && (
              <div className="space-y-4">
                {/* Show map for both OUTBOUND and INBOUND routes */}
                {(activeRoute.direction === 'OUTBOUND' || activeRoute.direction === 'INBOUND') ? (
                  <RouteMap route={activeRoute} />
                ) : (
                  <div className="text-center py-12 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Map className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-yellow-900 mb-2">Map View - Supported Directions</h3>
                    <p className="text-yellow-700 mb-4">
                      Map visualization is available for OUTBOUND and INBOUND routes.
                    </p>
                    <p className="text-sm text-yellow-600">
                      Current route direction: <span className="font-medium">{activeRoute.direction || 'Unknown'}</span>
                    </p>
                    <p className="text-xs text-yellow-500 mt-2">
                      Supported directions: OUTBOUND, INBOUND
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Schedules Tab */}
            {activeSubTab === 'schedules' && (
              <div className="space-y-4">
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Route Schedules</h3>
                  <p className="text-gray-600 mb-4">
                    🔌 <strong>API Integration Point:</strong> Fetch and display route schedules
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>• Show bus schedules for this route</p>
                    <p>• Display departure/arrival times</p>
                    <p>• Filter by date range</p>
                    <p>• Add/edit schedule functionality</p>
                  </div>
                </div>
              </div>
            )}

            {/* More Tab */}
            {activeSubTab === 'more' && (
              <div className="space-y-4">
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <MoreHorizontal className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Information</h3>
                  <p className="text-gray-600 mb-4">
                    🔌 <strong>API Integration Point:</strong> Add more route-related features
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>• Route analytics and statistics</p>
                    <p>• Historical data and reports</p>
                    <p>• Performance metrics</p>
                    <p>• Route optimization suggestions</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}