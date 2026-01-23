'use client';

import React from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  Edit, 
  Trash2, 
  Navigation,
  MapPin,
  Clock,
  Route as RouteIcon,
  Ruler
} from 'lucide-react';
import type { RouteResponse } from '../../../../generated/api-clients/route-management';

interface RoutesTableProps {
  routes: RouteResponse[];
  onView: (routeId: string) => void;
  onEdit: (routeId: string) => void;
  onDelete: (routeId: string, routeName: string) => void;
  onSort: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  activeFilters: Record<string, any>;
  loading: boolean;
  currentSort: { field: string; direction: 'asc' | 'desc' };
}

export function RoutesTable({
  routes,
  onView,
  onEdit,
  onDelete,
  onSort,
  activeFilters,
  loading,
  currentSort
}: RoutesTableProps) {
  const getSortIcon = (field: string) => {
    if (currentSort.field !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    return currentSort.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  const handleSort = (field: string) => {
    const newDirection = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getDirectionIcon = (direction?: string) => {
    if (direction === 'OUTBOUND') {
      return <Navigation className="w-4 h-4 text-blue-600" />;
    } else if (direction === 'INBOUND') {
      return <Navigation className="w-4 h-4 text-green-600 rotate-180" />;
    }
    return <RouteIcon className="w-4 h-4 text-gray-400" />;
  };

  const getDirectionLabel = (direction?: string) => {
    if (direction === 'OUTBOUND') return 'Outbound';
    if (direction === 'INBOUND') return 'Inbound';
    return 'Unknown';
  };

  if (loading && routes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading routes...</p>
        </div>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <RouteIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
          <p className="text-gray-500 mb-4">
            {Object.keys(activeFilters).some(key => activeFilters[key])
              ? "No routes match your current filters. Try adjusting your search criteria."
              : "No routes have been created yet."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Route Name
                  {getSortIcon('name')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Direction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('distanceKm')}
              >
                <div className="flex items-center gap-1">
                  Distance
                  {getSortIcon('distanceKm')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('estimatedDurationMinutes')}
              >
                <div className="flex items-center gap-1">
                  Duration
                  {getSortIcon('estimatedDurationMinutes')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-1">
                  Created
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {route.name || 'Unnamed Route'}
                    </div>
                    {route.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {route.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {route.routeGroupName || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getDirectionIcon(route.direction)}
                    <span className="text-sm text-gray-900">
                      {getDirectionLabel(route.direction)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="truncate max-w-32">
                      {route.startStopName || 'Unknown'}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="truncate max-w-32">
                      {route.endStopName || 'Unknown'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Ruler className="w-3 h-3 text-gray-400" />
                    {route.distanceKm ? `${route.distanceKm.toFixed(1)} km` : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {route.estimatedDurationMinutes ? `${route.estimatedDurationMinutes} min` : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(route.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(route.id!)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="View route details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(route.id!)}
                      className="text-amber-600 hover:text-amber-900 transition-colors"
                      title="Edit route"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(route.id!, route.name || 'Unnamed Route')}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete route"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {loading && routes.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            <span className="text-xs text-blue-800">Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
}