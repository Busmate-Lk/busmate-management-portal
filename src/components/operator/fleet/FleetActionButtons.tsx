'use client';

import React from 'react';
import { Plus, Download, FileText, Wrench } from 'lucide-react';

interface FleetActionButtonsProps {
  onAddBus: () => void;
  onExportFleet: () => void;
  onMaintenanceSchedule?: () => void;
  onGenerateReport?: () => void;
  isLoading?: boolean;
  selectedCount?: number;
}

export function FleetActionButtons({
  onAddBus,
  onExportFleet,
  onMaintenanceSchedule,
  onGenerateReport,
  isLoading = false,
  selectedCount = 0
}: FleetActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Primary Actions */}
      <div className="flex gap-3">
        {/* <button
          onClick={onAddBus}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Bus</span>
          <span className="sm:hidden">Add</span>
        </button> */}
        
        {/* {onMaintenanceSchedule && (
          <button
            onClick={onMaintenanceSchedule}
            disabled={isLoading}
            className="flex items-center gap-2 border border-orange-600 text-orange-600 bg-white px-4 py-2 rounded-lg hover:bg-orange-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule Maintenance</span>
            <span className="sm:hidden">Maintenance</span>
          </button>
        )} */}
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-3">
        <button
          onClick={onExportFleet}
          disabled={isLoading}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export Fleet</span>
          <span className="sm:hidden">Export</span>
        </button>

        {onGenerateReport && (
          <button
            onClick={onGenerateReport}
            disabled={isLoading}
            className="flex items-center gap-2 border border-green-300 text-green-700 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Fleet Report</span>
            <span className="sm:hidden">Report</span>
          </button>
        )}
      </div>
    </div>
  );
}