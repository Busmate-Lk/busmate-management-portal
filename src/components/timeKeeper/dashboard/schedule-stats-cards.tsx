'use client';

import { TrendingUp, Calendar, Clock, MapPin, Bus } from 'lucide-react';

interface ScheduleStats {
  activeSchedules: number;
  onTimePerformance: number;
  routesCovered: number;
  busesAssigned: number;
}

interface ScheduleStatsCardsProps {
  stats?: ScheduleStats;
}

export function ScheduleStatsCards({ stats }: ScheduleStatsCardsProps) {
  // Default values if no stats provided
  const defaultStats = {
    activeSchedules: 156,
    onTimePerformance: 98.5,
    routesCovered: 42,
    busesAssigned: 89,
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Active Schedules Card */}
      <div className="bg-blue-50 border-blue-200 rounded-xl shadow-sm border-2 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center">
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Active Schedules
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {displayStats.activeSchedules}
            </p>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="ml-1 text-sm font-medium text-green-600">
                8%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* On-Time Performance Card */}
      <div className="bg-green-50 border-green-200 rounded-xl shadow-sm border-2 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center">
          <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              On-Time Performance
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {displayStats.onTimePerformance}%
            </p>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="ml-1 text-sm font-medium text-green-600">
                2.1%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Routes Covered Card */}
      <div className="bg-teal-50 border-teal-200 rounded-xl shadow-sm border-2 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center">
          <div className="bg-teal-100 text-teal-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Routes Covered
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {displayStats.routesCovered}
            </p>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="ml-1 text-sm font-medium text-green-600">3</span>
              <span className="text-sm text-gray-500 ml-1">new routes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buses Assigned Card */}
      <div className="bg-purple-50 border-purple-200 rounded-xl shadow-sm border-2 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center">
          <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <Bus className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Buses Assigned
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {displayStats.busesAssigned}
            </p>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="ml-1 text-sm font-medium text-green-600">5</span>
              <span className="text-sm text-gray-500 ml-1">this month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
