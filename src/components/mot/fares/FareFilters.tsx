'use client';

import { SearchFilterBar, SelectFilter, FilterChipDescriptor } from '@/components/shared/SearchFilterBar';
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
    filteredCount: number;
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
    filteredCount,
    onClearAll,
    loading,
}: FareFiltersProps) {
    const activeChips: FilterChipDescriptor[] = [];

    if (statusFilter !== 'all') {
        activeChips.push({
            key: 'status',
            label: `Status: ${statusFilter}`,
            onRemove: () => onStatusChange('all'),
        });
    }
    if (busTypeFilter !== 'all') {
        activeChips.push({
            key: 'busType',
            label: `Bus Type: ${busTypeFilter}`,
            onRemove: () => onBusTypeChange('all'),
        });
    }
    if (operatorFilter !== 'all') {
        activeChips.push({
            key: 'operator',
            label: `Operator: ${operatorFilter}`,
            onRemove: () => onOperatorChange('all'),
        });
    }
    if (regionFilter !== 'all') {
        activeChips.push({
            key: 'region',
            label: `Region: ${regionFilter}`,
            onRemove: () => onRegionChange('all'),
        });
    }

    return (
        <SearchFilterBar
            searchValue={searchTerm}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search by ID, route, or operator..."
            totalCount={totalCount}
            filteredCount={filteredCount}
            resultLabel="fare structures"
            loading={loading}
            activeChips={activeChips}
            onClearAllFilters={onClearAll}
            filters={
                <>
                    <SelectFilter
                        value={statusFilter}
                        onChange={onStatusChange}
                        options={filterOptions.statuses.map((s) => ({ value: s, label: s }))}
                        allLabel="All Statuses"
                    />
                    <SelectFilter
                        value={busTypeFilter}
                        onChange={onBusTypeChange}
                        options={filterOptions.busTypes.map((t) => ({ value: t, label: t }))}
                        allLabel="All Bus Types"
                    />
                    <SelectFilter
                        value={operatorFilter}
                        onChange={onOperatorChange}
                        options={filterOptions.operators.map((o) => ({ value: o, label: o }))}
                        allLabel="All Operators"
                    />
                    <SelectFilter
                        value={regionFilter}
                        onChange={onRegionChange}
                        options={filterOptions.regions.map((r) => ({ value: r, label: r }))}
                        allLabel="All Regions"
                    />
                </>
            }
        />
    );
}
