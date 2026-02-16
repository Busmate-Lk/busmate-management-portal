'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Search,
    X,
    ChevronDown,
    Filter,
    CheckCircle,
    XCircle,
    MapPin,
} from 'lucide-react';

interface StaffFilterOptions {
    statuses: string[];
    provinces: string[];
    locations: string[];
}

interface StaffAdvancedFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    provinceFilter: string;
    setProvinceFilter: (value: string) => void;
    filterOptions: StaffFilterOptions;
    loading: boolean;
    totalCount?: number;
    filteredCount?: number;
    onClearAll?: () => void;
    onSearch?: (term: string) => void;
}

export default function StaffAdvancedFilters({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    provinceFilter,
    setProvinceFilter,
    filterOptions,
    loading,
    totalCount = 0,
    filteredCount = 0,
    onClearAll,
    onSearch,
}: StaffAdvancedFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const activeFilterCount = [
        statusFilter !== 'all',
        provinceFilter !== 'all',
    ].filter(Boolean).length;

    const hasActiveFilters = activeFilterCount > 0 || searchTerm.length > 0;

    // Search handler with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onSearch) {
                onSearch(searchTerm);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    const getStatusIcon = (value: string) => {
        switch (value) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'inactive':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusLabel = (value: string) => {
        switch (value) {
            case 'active':
                return 'Active';
            case 'inactive':
                return 'Inactive';
            default:
                return value;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Search Bar + Filter Toggle */}
            <div className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search staff members by name, email, NIC..."
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-3.5 w-3.5 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${isExpanded || activeFilterCount > 0
                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Filter className="h-4 w-4" />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                {activeFilterCount}
                            </span>
                        )}
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {/* Results count */}
                {hasActiveFilters && (
                    <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                            Showing <span className="font-medium text-gray-900">{filteredCount}</span> of{' '}
                            <span className="font-medium text-gray-900">{totalCount}</span> staff members
                        </span>
                        {onClearAll && (
                            <button
                                onClick={onClearAll}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Expandable Filter Section */}
            {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Status
                            </label>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    disabled={loading}
                                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none disabled:opacity-50"
                                >
                                    <option value="all">All Statuses</option>
                                    {filterOptions.statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {getStatusLabel(status)}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Province Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Province
                            </label>
                            <div className="relative">
                                <select
                                    value={provinceFilter}
                                    onChange={(e) => setProvinceFilter(e.target.value)}
                                    disabled={loading}
                                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none disabled:opacity-50"
                                >
                                    <option value="all">All Provinces</option>
                                    {filterOptions.provinces.map((province) => (
                                        <option key={province} value={province}>
                                            {province}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
