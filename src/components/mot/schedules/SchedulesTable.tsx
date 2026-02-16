'use client';

import React from 'react';
import {
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Route as RouteIcon,
  AlertCircle
} from 'lucide-react';
import { ScheduleResponse } from '../../../../generated/api-clients/route-management/models/ScheduleResponse';

interface SchedulesTableProps {
  schedules: ScheduleResponse[];
  onView: (scheduleId: string) => void;
  onEdit: (scheduleId: string) => void;
  onDelete: (scheduleId: string, scheduleName: string) => void;
  onAssignBuses: (scheduleId: string, routeName: string) => void;
  onSort: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  activeFilters: Record<string, any>;
  loading: boolean;
  currentSort: { field: string; direction: 'asc' | 'desc' };
}

export function SchedulesTable({
  schedules,
  onView,
  onEdit,
  onDelete,
  onAssignBuses,
  onSort,
  activeFilters,
  loading,
  currentSort
}: SchedulesTableProps) {
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

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'INACTIVE':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return 'Unknown';
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getScheduleTypeIcon = (type?: string) => {
    switch (type) {
      case 'REGULAR':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'SPECIAL':
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const getScheduleTypeLabel = (type?: string) => {
    if (!type) return 'Unknown';
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const getDaysOfWeek = (scheduleCalendars?: any[]) => {
    if (!scheduleCalendars || scheduleCalendars.length === 0) return 'N/A';
    
    const calendar = scheduleCalendars[0];
    const days = [];
    
    if (calendar?.monday) days.push('Mon');
    if (calendar?.tuesday) days.push('Tue');
    if (calendar?.wednesday) days.push('Wed');
    if (calendar?.thursday) days.push('Thu');
    if (calendar?.friday) days.push('Fri');
    if (calendar?.saturday) days.push('Sat');
    if (calendar?.sunday) days.push('Sun');
    
    return days.length > 0 ? days.join(', ') : 'N/A';
  };

  if (loading && schedules.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading schedules...</p>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
          <p className="text-gray-500 mb-4">
            {Object.keys(activeFilters).some(key => activeFilters[key])
              ? "No schedules match your current filters. Try adjusting your search criteria."
              : "No schedules have been created yet."}
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
                  <span>Schedule Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route & Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status & Days
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('effectiveStartDate')}
              >
                <div className="flex items-center gap-1">
                  <span>Effective Period</span>
                  {getSortIcon('effectiveStartDate')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-1">
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {schedule.name || 'Unnamed Schedule'}
                      </div>
                      {schedule.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs" title={schedule.description}>
                          {schedule.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <RouteIcon className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="font-medium">
                        {schedule.routeName || 'Unknown Route'}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      {getScheduleTypeIcon(schedule.scheduleType)}
                      <span className="ml-1">
                        {getScheduleTypeLabel(schedule.scheduleType)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(schedule.status)}`}>
                      {getStatusIcon(schedule.status)}
                      <span className="ml-1">{getStatusLabel(schedule.status)}</span>
                    </span>
                    <div className="text-xs text-gray-500">
                      {getDaysOfWeek(schedule.scheduleCalendars)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <span>From: {formatDate(schedule.effectiveStartDate)}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>To: {formatDate(schedule.effectiveEndDate)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <div>{formatDate(schedule.createdAt)}</div>
                    {schedule.updatedAt && schedule.updatedAt !== schedule.createdAt && (
                      <div className="text-xs">
                        Updated: {formatDate(schedule.updatedAt)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(schedule.id!)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="View schedule details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(schedule.id!)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      title="Edit schedule"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onAssignBuses(schedule.id!, schedule.routeName || 'Unknown Route')}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="Assign buses"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(schedule.id!, schedule.name || 'Unnamed Schedule')}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete schedule"
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
      
      {loading && schedules.length > 0 && (
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