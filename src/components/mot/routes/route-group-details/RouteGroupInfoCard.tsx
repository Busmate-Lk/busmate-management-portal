'use client';

import { useState } from 'react';
import {
  Edit,
  Trash2,
  Route as RouteIcon,
  Globe,
  Calendar,
  User,
  FileText,
  MapPin,
  Clock
} from 'lucide-react';
import type { RouteGroupResponse, RouteResponse } from '../../../../../generated/api-clients/route-management';

interface RouteGroupInfoCardProps {
  routeGroup: RouteGroupResponse;
  routes: RouteResponse[];
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function RouteGroupInfoCard({
  routeGroup,
  routes,
  onEdit,
  onDelete,
  isDeleting = false
}: RouteGroupInfoCardProps) {

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  // Calculate statistics
  const outboundRoutes = routes.filter(r => r.direction === 'OUTBOUND');
  const inboundRoutes = routes.filter(r => r.direction === 'INBOUND');
  const totalDistance = routes.reduce((sum, r) => sum + (r.distanceKm || 0), 0);
  const avgDuration = routes.length > 0
    ? Math.round(routes.reduce((sum, r) => sum + (r.estimatedDurationMinutes || 0), 0) / routes.length)
    : 0;
  const totalStops = routes.reduce((sum, r) => sum + (r.routeStops?.length || 0) + 2, 0);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const stats = [
    {
      label: 'Total Routes',
      value: routes.length,
      subValue: `${outboundRoutes.length} out · ${inboundRoutes.length} in`,
      icon: RouteIcon,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Total Distance',
      value: `${totalDistance.toFixed(1)} km`,
      subValue: routes.length > 1 ? `~${(totalDistance / routes.length).toFixed(1)} km avg per route` : 'Single route',
      icon: MapPin,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      label: 'Avg Duration',
      value: formatDuration(avgDuration),
      subValue: `Across ${routes.length} route${routes.length !== 1 ? 's' : ''}`,
      icon: Clock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      label: 'Total Stops',
      value: totalStops,
      subValue: routes.length > 0 ? `~${Math.round(totalStops / routes.length)} stops per route` : 'No routes',
      icon: MapPin,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6">
        {/* Header Row - Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          {/* Icon and Main Name */}
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <RouteIcon className="w-7 h-7 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {routeGroup.name || 'Unnamed Route Group'}
              </h1>
              {routeGroup.id && (
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  ID: {routeGroup.id}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onEdit}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Multi-language Names */}
        {(routeGroup.nameSinhala || routeGroup.nameTamil) && (
          <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              Multi-Language Names
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {routeGroup.nameSinhala && (
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase">Sinhala</span>
                  <p className="text-gray-800 font-medium mt-0.5">{routeGroup.nameSinhala}</p>
                </div>
              )}
              {routeGroup.nameTamil && (
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase">Tamil</span>
                  <p className="text-gray-800 font-medium mt-0.5">{routeGroup.nameTamil}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {routeGroup.description && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Description
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
              {routeGroup.description}
            </p>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="mb-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="bg-linear-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {stat.label}
                  </span>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.subValue}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t border-gray-100 text-xs text-gray-500">
          {routeGroup.createdAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created: {formatDate(routeGroup.createdAt)}</span>
            </div>
          )}
          {routeGroup.createdBy && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>By: {routeGroup.createdBy}</span>
            </div>
          )}
          {routeGroup.updatedAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Updated: {formatDate(routeGroup.updatedAt)}</span>
            </div>
          )}
          {routeGroup.updatedBy && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>By: {routeGroup.updatedBy}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
