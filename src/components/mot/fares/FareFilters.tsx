'use client';

import { Search, X, Upload, Download, Filter } from 'lucide-react';
import { FareFilterOptions } from '@/data/mot/fares';

interface FareFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    busTypeFilter: string;
    onBusTypeChange: (value: string) => void;
    operatorFilter: string;
    onOperatorChange: (value: string) => void;
    regionFilter: string;
    onRegionChange: (value: string) => void;
    filterOptions: FareFilterOptions;
    totalCount: number;
    onUploadFare: () => void;
    onExportAll: () => void;
    onClearAll: () => void;
    loading?: boolean;
}

export function FareFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    busTypeFilter,
    onBusTypeChange,
    operatorFilter,
    onOperatorChange,
    regionFilter,
    onRegionChange,
    filterOptions,
    totalCount,
    onUploadFare,
    onExportAll,
    onClearAll,
    loading,
}: FareFiltersProps) {
    const hasActiveFilters =
        statusFilter !== 'all' ||
        busTypeFilter !== 'all' ||
        operatorFilter !== 'all' ||
        regionFilter !== 'all' ||
        searchTerm !== '';

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Top bar: Search + Action buttons */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by route, operator, or fare ID..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={onUploadFare}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            Upload New Fare
                        </button>
                        <button
                            onClick={onExportAll}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter row */}
            <div className="px-4 py-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Filter className="w-4 h-4" />
                    <span>Filters:</span>
                </div>

                {/* Status */}
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Status</option>
                    {filterOptions.statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                {/* Bus Type */}
                <select
                    value={busTypeFilter}
                    onChange={(e) => onBusTypeChange(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Bus Types</option>
                    {filterOptions.busTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                {/* Operator */}
                <select
                    value={operatorFilter}
                    onChange={(e) => onOperatorChange(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Operators</option>
                    {filterOptions.operators.map((o) => (
                        <option key={o} value={o}>{o}</option>
                    ))}
                </select>

                {/* Region */}
                <select
                    value={regionFilter}
                    onChange={(e) => onRegionChange(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Regions</option>
                    {filterOptions.regions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                {/* Results count + Clear */}
                <div className="flex items-center gap-3 ml-auto">
                    <span className="text-sm text-gray-500">{totalCount} results</span>
                    {hasActiveFilters && (
                        <button
                            onClick={onClearAll}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
