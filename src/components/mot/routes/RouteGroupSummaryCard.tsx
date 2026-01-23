'use client';

import { Bus, Route as RouteIcon, MapPin, Timer } from 'lucide-react';
import type { RouteGroupResponse, RouteResponse } from '../../../../generated/api-clients/route-management';

interface RouteGroupSummaryCardProps {
  routeGroup: RouteGroupResponse;
  routes: RouteResponse[];
}

export function RouteGroupSummaryCard({ routeGroup, routes }: RouteGroupSummaryCardProps) {
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

  const getTotalDistance = () => {
    return routes.reduce((total, route) => total + (route.distanceKm || 0), 0);
  };

  const getAverageDuration = () => {
    if (routes.length === 0) return 0;
    const totalDuration = routes.reduce((total, route) => total + (route.estimatedDurationMinutes || 0), 0);
    return Math.round(totalDuration / routes.length);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
            <Bus className="w-4 h-4" />
            Group Name
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {routeGroup.name || 'Unnamed Group'}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
            <RouteIcon className="w-4 h-4" />
            Total Routes
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {routes.length}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
            <MapPin className="w-4 h-4" />
            Total Distance
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {getTotalDistance().toFixed(1)} km
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
            <Timer className="w-4 h-4" />
            Avg Duration
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {Math.floor(getAverageDuration() / 60)}h {getAverageDuration() % 60}m
          </div>
        </div>
      </div>

      {routeGroup.description && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-1">Description</div>
          <div className="text-gray-700">{routeGroup.description}</div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Last Updated:</span>
          <span className="ml-2 text-gray-900">
            {formatDate(routeGroup.updatedAt)}
            {routeGroup.updatedBy && ` by ${routeGroup.updatedBy}`}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Created:</span>
          <span className="ml-2 text-gray-900">
            {formatDate(routeGroup.createdAt)}
            {routeGroup.createdBy && ` by ${routeGroup.createdBy}`}
          </span>
        </div>
      </div>
    </div>
  );
}