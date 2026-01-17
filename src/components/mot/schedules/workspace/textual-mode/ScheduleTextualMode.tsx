'use client';

import { useScheduleWorkspace } from "@/context/ScheduleWorkspace/useScheduleWorkspace";
import { useEffect, useState } from "react";

export default function ScheduleTextualMode() {
  const { data, updateFromYaml, getYaml } = useScheduleWorkspace();
  const [yamlText, setYamlText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  // Sync context data to textarea when form changes
  useEffect(() => {
    const newYaml = getYaml();
    setYamlText(newYaml);
    setParseError(null);
  }, [data, getYaml]);

  // Handle textarea changes and update context
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setYamlText(newText);
    
    // Parse and update context
    try {
      const error = updateFromYaml(newText);
      if (error) {
        setParseError(error);
      } else {
        setParseError(null);
      }
    } catch (error) {
      console.error('Failed to parse YAML:', error);
      setParseError(error instanceof Error ? error.message : 'Failed to parse YAML');
    }
  };

  const hasRouteSelected = !!data.selectedRouteId;

  return (
    <div className="flex flex-col h-full">
      {/* Header with instructions */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">Schedule Textual Mode</span>
          {parseError && (
            <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
              ⚠️ {parseError}
            </span>
          )}
          {!parseError && yamlText.trim() && (
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
              ✓ Valid YAML
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Enter or paste schedule data in YAML format. Changes will sync with Form Mode in real-time.
        </p>
      </div>

      {/* Route context warning */}
      {!hasRouteSelected && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Please select a route in Form Mode first. 
            The route context (stops, route info) is required to properly interpret schedule data.
          </p>
        </div>
      )}

      {/* YAML Editor */}
      <div className="flex-1 min-h-0">
        <textarea 
          className={`w-full h-[750px] border-2 rounded-lg px-3 py-2 outline-none font-mono text-sm resize-none
            ${parseError 
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }
            ${!hasRouteSelected ? 'bg-gray-50' : 'bg-white'}
          `}
          value={yamlText}
          onChange={handleTextChange}
          placeholder={`# Schedule Workspace YAML Format
# Select a route first, then edit schedules below

schedule_workspace:
  route_id: ""
  route_name: ""
  route_group_id: ""
  route_group_name: ""
  
  schedules:
    - schedule:
        name: "Morning Express"
        schedule_type: REGULAR
        status: PENDING
        description: "Weekday morning service"
        
        effective_start_date: "2024-01-01"
        effective_end_date: ""
        
        generate_trips: true
        
        calendar:
          monday: true
          tuesday: true
          wednesday: true
          thursday: true
          friday: true
          saturday: false
          sunday: false
        
        stops:
          - stop:
              stop_order: 0
              arrival_time: "06:00"
              departure_time: "06:02"
          - stop:
              stop_order: 1
              arrival_time: "06:15"
              departure_time: "06:16"
        
        exceptions:
          - exception:
              exception_date: "2024-12-25"
              exception_type: REMOVED
              description: "Christmas Day"`}
          spellCheck={false}
        />
      </div>

      {/* Help section */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <details className="text-sm">
          <summary className="font-medium text-gray-700 cursor-pointer hover:text-gray-900">
            YAML Format Reference
          </summary>
          <div className="mt-2 text-gray-600 space-y-2">
            <div>
              <strong>Schedule Types:</strong> REGULAR, SPECIAL
            </div>
            <div>
              <strong>Status Options:</strong> PENDING, ACTIVE, INACTIVE, CANCELLED
            </div>
            <div>
              <strong>Time Format:</strong> HH:mm or HH:mm:ss (e.g., "06:00" or "06:00:00")
            </div>
            <div>
              <strong>Date Format:</strong> YYYY-MM-DD (e.g., "2024-01-15")
            </div>
            <div>
              <strong>Exception Types:</strong> ADDED (add service), REMOVED (remove service)
            </div>
            <div>
              <strong>Calendar:</strong> Set days to true/false to control operating days
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
