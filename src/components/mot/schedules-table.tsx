'use client';

import { 
  Eye, 
  Edit, 
  Bus, 
  Power, 
  Trash2, 
  Clock, 
  Calendar,
  MapPin,
  MoreVertical,
  Info
} from 'lucide-react';
import { useState } from 'react';
import { ScheduleResponse } from '../../../generated/api-clients/route-management';

interface SchedulesTableProps {
  schedules: ScheduleResponse[];
  onView: (scheduleId: string) => void;
  onEdit: (scheduleId: string) => void;
  onAssignBuses: (scheduleId: string, routeName: string) => void;
  onDeactivate: (scheduleId: string, scheduleName: string) => void;
  onDelete: (scheduleId: string, scheduleName: string) => void;
  isLoading?: boolean;
}

export function SchedulesTable({
  schedules,
  onView,
  onEdit,
  onAssignBuses,
  onDeactivate,
  onDelete,
  isLoading = false,
}: SchedulesTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const getStatusConfig = (status: string) => {
    const configs = {
      ACTIVE: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '●',
        label: 'Active'
      },
      PENDING: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '●',
        label: 'Pending'
      },
      INACTIVE: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: '●',
        label: 'Inactive'
      },
      CANCELLED: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '●',
        label: 'Cancelled'
      }
    };
    
    return configs[status as keyof typeof configs] || configs.PENDING;
  };

  const getScheduleTypeConfig = (type: string) => {
    const configs = {
      REGULAR: {
        color: 'bg-blue-100 text-blue-800',
        label: 'Regular'
      },
      SPECIAL: {
        color: 'bg-purple-100 text-purple-800',
        label: 'Special'
      }
    };
    
    return configs[type as keyof typeof configs] || configs.REGULAR;
  };

  const formatDaysOfWeek = (scheduleCalendars: any[]) => {
    if (!scheduleCalendars || scheduleCalendars.length === 0) return 'Not set';
    
    const calendar = scheduleCalendars[0];
    const days = [];
    
    if (calendar.monday) days.push('Mon');
    if (calendar.tuesday) days.push('Tue');
    if (calendar.wednesday) days.push('Wed');
    if (calendar.thursday) days.push('Thu');
    if (calendar.friday) days.push('Fri');
    if (calendar.saturday) days.push('Sat');
    if (calendar.sunday) days.push('Sun');
    
    if (days.length === 7) return 'Daily';
    if (days.length === 5 && !calendar.saturday && !calendar.sunday) return 'Weekdays';
    if (days.length === 2 && calendar.saturday && calendar.sunday) return 'Weekends';
    
    return days.join(', ');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getTotalStops = (scheduleStops: any[]) => {
    return scheduleStops?.length || 0;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operating Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stops</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="bg-white rounded-lg">
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No schedules found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first schedule.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Schedule Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operating Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type & Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stops
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Effective Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => {
              const statusConfig = getStatusConfig(schedule.status || 'PENDING');
              const typeConfig = getScheduleTypeConfig(schedule.scheduleType || 'REGULAR');
              const isExpanded = expandedRow === schedule.id;

              return (
                <tr 
                  key={schedule.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Schedule Details */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-48">
                        {schedule.name || 'Unnamed Schedule'}
                      </div>
                      {schedule.description && (
                        <div className="text-sm text-gray-500 truncate max-w-48">
                          {schedule.description}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Route */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {schedule.routeName || 'No route assigned'}
                      </div>
                      {schedule.routeGroupName && (
                        <div className="text-sm text-gray-500">
                          {schedule.routeGroupName}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Operating Days */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatDaysOfWeek(schedule.scheduleCalendars || [])}
                    </div>
                  </td>

                  {/* Type & Status */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                        <span className="mr-1">{statusConfig.icon}</span>
                        {statusConfig.label}
                      </span>
                    </div>
                  </td>

                  {/* Stops */}
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      {getTotalStops(schedule.scheduleStops || [])}
                    </div>
                  </td>

                  {/* Effective Period */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="truncate">
                          {formatDate(schedule.effectiveStartDate || '')}
                        </span>
                      </div>
                      {schedule.effectiveEndDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          to {formatDate(schedule.effectiveEndDate)}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Created */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatDate(schedule.createdAt || '')}
                    </div>
                    {schedule.updatedAt && schedule.updatedAt !== schedule.createdAt && (
                      <div className="text-xs text-gray-500">
                        Updated {formatDate(schedule.updatedAt)}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(schedule.id!)}
                        className="p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Schedule"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => onEdit(schedule.id!)}
                        className="p-1 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        title="Edit Schedule"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => onAssignBuses(schedule.id!, schedule.routeName || 'Unknown Route')}
                        className="p-1 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="Assign Buses"
                      >
                        <Bus className="h-4 w-4" />
                      </button>

                      {schedule.status === 'ACTIVE' && (
                        <button
                          onClick={() => onDeactivate(schedule.id!, schedule.name || 'Unknown Schedule')}
                          className="p-1 rounded-md text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                          title="Deactivate Schedule"
                        >
                          <Power className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => onDelete(schedule.id!, schedule.name || 'Unknown Schedule')}
                        className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Schedule"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setExpandedRow(isExpanded ? null : schedule.id!)}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                        title="More Info"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <div className="absolute left-0 right-0 bg-gray-50 border border-gray-200 p-4 mt-2 rounded-lg shadow-sm z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Schedule ID:</span>
                            <span className="ml-2 text-gray-900">{schedule.id}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Route ID:</span>
                            <span className="ml-2 text-gray-900">{schedule.routeId || 'Not assigned'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Created By:</span>
                            <span className="ml-2 text-gray-900">{schedule.createdBy || 'System'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Updated By:</span>
                            <span className="ml-2 text-gray-900">{schedule.updatedBy || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Total Stops:</span>
                            <span className="ml-2 text-gray-900">{getTotalStops(schedule.scheduleStops || [])}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Calendars:</span>
                            <span className="ml-2 text-gray-900">{schedule.scheduleCalendars?.length || 0}</span>
                          </div>
                        </div>
                        {schedule.description && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <span className="font-medium text-gray-700">Description:</span>
                            <p className="mt-1 text-gray-900">{schedule.description}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
