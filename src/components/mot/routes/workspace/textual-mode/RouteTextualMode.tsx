'use client';

import { useRouteWorkspace } from "@/context/RouteWorkspace/useRouteWorkspace";
import { useEffect, useState } from "react";

export default function RouteTextualMode() {
  const { data, updateFromYaml, getYaml } = useRouteWorkspace();
  const [yamlText, setYamlText] = useState('');

  // Sync context data to textarea when form changes
  useEffect(() => {
    setYamlText(getYaml());
  }, [data, getYaml]);

  // Handle textarea changes and update context
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setYamlText(newText);

    // Parse and update context
    try {
      updateFromYaml(newText);
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
  };

  return (
    <div className="flex flex-col rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">YAML Editor</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter or paste route group data in YAML format. Changes sync with Form Mode in real-time.
        </p>
      </div>
      {/* Full available screen sized text editor area to type or paste full route group data with route data and routestop data in textual format */}
      <div className="p-4">
        <textarea
          className="w-full h-[700px] border border-slate-300 rounded-lg px-3 py-2.5 bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
          value={yamlText}
          onChange={handleTextChange}
          placeholder="# Example:
route_group:
  name: Colombo - Kandy Express Routes
  name_sinhala: කොළඹ - මහනුවර එක්ස්ප්‍රස් මාර්ග
  name_tamil: கொழும்பு - கண்டி எக்ஸ்பிரஸ் வழிகள்
  description: Main express routes between Colombo and Kandy"
        />
      </div>
    </div>
  )
}
