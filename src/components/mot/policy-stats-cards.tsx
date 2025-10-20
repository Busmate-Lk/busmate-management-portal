'use client';

import { FileText, Clock, AlertTriangle, Edit, TrendingUp } from 'lucide-react';

interface PolicyStatsCardsProps {
  stats?: {
    published: { count: number; change: string };
    underReview: { count: number; avgDays: number };
    draft: { count: number };
    updatedThisMonth: { count: number };
  };
}

export function PolicyStatsCards({ stats }: PolicyStatsCardsProps) {
  const defaultStats = {
    published: { count: 25, change: '+3 this month' },
    underReview: { count: 8, avgDays: 5 },
    draft: { count: 5 },
    updatedThisMonth: { count: 12 },
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-green-50 rounded-xl border-2 border-green-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center">
          <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Published Policies
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {currentStats.published.count}
            </p>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                {currentStats.published.change}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center">
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Under Review
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {currentStats.underReview.count}
            </p>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                Avg review: {currentStats.underReview.avgDays} days
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-xl border-2 border-yellow-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center">
          <div className="bg-yellow-100 text-yellow-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Draft Policies
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {currentStats.draft.count}
            </p>
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">
                Awaiting approval
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-xl border-2 border-purple-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center">
          <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
            <Edit className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Updated This Month
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {currentStats.updatedThisMonth.count}
            </p>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">
                Regular updates
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
