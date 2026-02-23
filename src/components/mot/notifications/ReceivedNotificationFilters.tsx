'use client';

import { SearchFilterBar, SelectFilter, FilterChipDescriptor } from '@/components/shared/SearchFilterBar';

interface FilterConfig {
    key: string;
    label: string;
    options: { value: string; label: string }[];
}

interface ReceivedNotificationFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filters: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
    filterConfig: FilterConfig[];
    totalCount: number;
    filteredCount: number;
    onClearAll?: () => void;
    loading?: boolean;
}

export function ReceivedNotificationFilters({
    searchTerm,
    onSearchChange,
    filters,
    onFilterChange,
    filterConfig,
    totalCount,
    filteredCount,
    onClearAll,
    loading,
}: ReceivedNotificationFiltersProps) {
    const activeChips: FilterChipDescriptor[] = [];

    for (const cfg of filterConfig) {
        const val = filters[cfg.key];
        if (val && val !== 'all') {
            const option = cfg.options.find((o) => o.value === val);
            activeChips.push({
                key: cfg.key,
                label: `${cfg.label}: ${option?.label || val}`,
                onRemove: () => onFilterChange(cfg.key, 'all'),
            });
        }
    }

    return (
        <SearchFilterBar
            searchValue={searchTerm}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search notifications..."
            totalCount={totalCount}
            filteredCount={filteredCount}
            resultLabel="notifications"
            loading={loading}
            activeChips={activeChips}
            onClearAllFilters={onClearAll}
            filters={
                <>
                    {filterConfig.map((cfg) => (
                        <SelectFilter
                            key={cfg.key}
                            value={filters[cfg.key] || 'all'}
                            onChange={(val) => onFilterChange(cfg.key, val)}
                            options={cfg.options.filter((o) => o.value !== 'all').map((o) => ({ value: o.value, label: o.label }))}
                            allLabel={cfg.options.find((o) => o.value === 'all')?.label || `All ${cfg.label}`}
                        />
                    ))}
                </>
            }
        />
    );
}
