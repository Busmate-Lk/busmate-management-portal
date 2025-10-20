'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function RealTimeClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-md p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-blue-800 rounded-lg">
          <Clock className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Current Time</h3>
      </div>

      <div className="text-center space-y-1.5">
        <div className="text-3xl font-mono font-bold text-slate-800 tracking-wide drop-shadow-sm">
          {formatTime(currentTime)}
        </div>
        <div className="text-xs text-slate-600 font-medium">
          {formatDate(currentTime)}
        </div>
      </div>
    </div>
  );
}
