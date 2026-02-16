"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface Metric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface AnalyticsKeyMetricsProps {
  metrics: Metric[];
}

export function AnalyticsKeyMetrics({ metrics }: AnalyticsKeyMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`relative overflow-hidden border-l-4 ${
            index === 0
              ? "border-l-blue-500"
              : index === 1
              ? "border-l-green-500"
              : index === 2
              ? "border-l-purple-500"
              : "border-l-orange-500"
          } bg-white rounded-lg border border-gray-200 shadow-sm`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <button className="p-0 h-auto text-gray-400 hover:text-gray-600 transition-colors">
                    <div className="flex items-center gap-1">
                      <span className="text-xs">...</span>
                    </div>
                  </button>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <div className="flex items-center gap-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        metric.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {metric.change} from last month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
