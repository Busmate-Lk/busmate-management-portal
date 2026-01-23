'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Calendar,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { ScheduleManagementService } from '../../../../../generated/api-clients/route-management';
import type { ScheduleResponse } from '../../../../../generated/api-clients/route-management';

interface RouteSchedulesTabProps {
  routeId: string;
  routeName: string;
}

export function RouteSchedulesTab({ routeId, routeName }: RouteSchedulesTabProps) {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ScheduleManagementService.getSchedulesByRoute(
        routeId,
        undefined,
        0,
        100,
        'name',
        'asc'
      );

      // Sort by departure time
      const sortedSchedules = (response.content || []).sort((a, b) => {
        const aTime = getFirstStopDepartureTime(a);
        const bTime = getFirstStopDepartureTime(b);
        if (!aTime || !bTime) return 0;
        return aTime.localeCompare(bTime);
      });

      setSchedules(sortedSchedules);
    } catch (err) {
      console.error('Error loading schedules:', err);
      setError('Failed to load schedules');
    } finally {
      setIsLoading(false);
    }
  }, [routeId]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const getFirstStopDepartureTime = (schedule: ScheduleResponse): string | null => {
    if (!schedule.scheduleStops || schedule.scheduleStops.length === 0) return null;
    return schedule.scheduleStops[0].departureTime || null;
  };

  const getLastStopArrivalTime = (schedule: ScheduleResponse): string | null => {
    if (!schedule.scheduleStops || schedule.scheduleStops.length === 0) return null;
    return schedule.scheduleStops[schedule.scheduleStops.length - 1].arrivalTime || null;
  };

  const formatTime = (timeString?: string | null): string => {
    if (!timeString) return '--:--';
    try {
      const parts = timeString.split(':');
      if (parts.length >= 2) {
        const hours = parseInt(parts[0], 10);
        const minutes = parts[1];
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes} ${period}`;
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return { icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'INACTIVE':
        return { icon: XCircle, bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
      case 'PENDING':
        return { icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'CANCELLED':
        return { icon: XCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      default:
        return { icon: AlertCircle, bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' };
    }
  };

  const getDaysOfWeek = (calendars?: any[]) => {
    if (!calendars || calendars.length === 0) return [];
    const c = calendars[0];
    const days = [];
    if (c?.monday) days.push('M');
    if (c?.tuesday) days.push('T');
    if (c?.wednesday) days.push('W');
    if (c?.thursday) days.push('T');
    if (c?.friday) days.push('F');
    if (c?.saturday) days.push('S');
    if (c?.sunday) days.push('S');
    return days;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadSchedules}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">No Schedules</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          Create schedules to define when buses operate on this route.
        </p>
        <button
          onClick={() => router.push(`/mot/schedules/add-new?routeId=${routeId}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Schedule
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">
            {schedules.length} schedule{schedules.length !== 1 ? 's' : ''} found
          </span>
        </div>
        <button
          onClick={() => router.push(`/mot/schedules/add-new?routeId=${routeId}`)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {/* Schedule Cards */}
      <div className="space-y-2">
        {schedules.map((schedule) => {
          const statusConfig = getStatusConfig(schedule.status);
          const StatusIcon = statusConfig.icon;
          const days = getDaysOfWeek(schedule.scheduleCalendars);

          return (
            <div
              key={schedule.id}
              className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
              onClick={() => router.push(`/mot/schedules/${schedule.id}`)}
            >
              <div className="flex items-center gap-4">
                {/* Time Display */}
                <div className="flex items-center gap-2 min-w-[180px]">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatTime(getFirstStopDepartureTime(schedule))}
                    </div>
                    <div className="text-xs text-gray-400">Depart</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatTime(getLastStopArrivalTime(schedule))}
                    </div>
                    <div className="text-xs text-gray-400">Arrive</div>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {schedule.name || 'Unnamed Schedule'}
                    </h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                      <StatusIcon className="w-3 h-3" />
                      {schedule.status}
                    </span>
                    {schedule.scheduleType && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        schedule.scheduleType === 'SPECIAL'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {schedule.scheduleType}
                      </span>
                    )}
                  </div>

                  {/* Days indicator */}
                  {days.length > 0 && (
                    <div className="flex items-center gap-1">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <span
                          key={i}
                          className={`w-5 h-5 flex items-center justify-center text-xs font-medium rounded ${
                            days[i]
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/mot/schedules/${schedule.id}`);
                    }}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/mot/schedules/${schedule.id}/edit`);
                    }}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
