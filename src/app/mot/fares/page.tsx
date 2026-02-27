'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';
import { useSetPageMetadata, useSetPageActions } from '@/context/PageContext';
import { getFares, getFareStatistics, getFareFilterOptions, Fare } from '@/data/mot/fares';
import { FareStatsCards } from '@/components/mot/fares/FareStatsCards';
import { FareFilters } from '@/components/mot/fares/FareFilters';
import { FaresTable } from '@/components/mot/fares/FaresTable';
import { DeleteFareModal } from '@/components/mot/fares/DeleteFareModal';
import { DataPagination } from '@/components/shared/DataPagination';
import { Upload, Download } from 'lucide-react';

export default function FaresPage() {
    const router = useRouter();

    useSetPageMetadata({
        title: 'Fare Structures',
        description: 'Manage bus fare structures across all routes and operators',
        activeItem: 'fares',
        showBreadcrumbs: true,
        breadcrumbs: [{ label: 'Fares' }],
    });

    // Data
    const allFares = useMemo(() => getFares(), []);
    const stats = useMemo(() => getFareStatistics(), []);
    const filterOptions = useMemo(() => getFareFilterOptions(), []);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [busTypeFilter, setBusTypeFilter] = useState('all');
    const [operatorFilter, setOperatorFilter] = useState('all');
    const [regionFilter, setRegionFilter] = useState('all');

    // Sort
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Delete modal
    const [fareToDelete, setFareToDelete] = useState<Fare | null>(null);

    // Filter and sort
    const filteredFares = useMemo(() => {
        let filtered = allFares;

        // Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (f) =>
                    f.id.toLowerCase().includes(term) ||
                    f.route.toLowerCase().includes(term) ||
                    f.operator.toLowerCase().includes(term)
            );
        }

        // Status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((f) => f.status === statusFilter);
        }

        // Bus type
        if (busTypeFilter !== 'all') {
            filtered = filtered.filter((f) => f.busType === busTypeFilter);
        }

        // Operator
        if (operatorFilter !== 'all') {
            filtered = filtered.filter((f) => f.operator === operatorFilter);
        }

        // Region
        if (regionFilter !== 'all') {
            filtered = filtered.filter((f) => f.region === regionFilter);
        }

        // Sort
        filtered = [...filtered].sort((a, b) => {
            let aVal: string | number = '';
            let bVal: string | number = '';

            switch (sortField) {
                case 'id': aVal = a.id; bVal = b.id; break;
                case 'route': aVal = a.route; bVal = b.route; break;
                case 'baseFare': aVal = a.baseFare; bVal = b.baseFare; break;
                case 'perKmRate': aVal = a.perKmRate; bVal = b.perKmRate; break;
                case 'effectiveFrom': aVal = a.effectiveFrom; bVal = b.effectiveFrom; break;
                default: aVal = a.id; bVal = b.id;
            }

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
            const comparison = String(aVal).localeCompare(String(bVal));
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [allFares, searchTerm, statusFilter, busTypeFilter, operatorFilter, regionFilter, sortField, sortDirection]);

    // Pagination (0-based)
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const totalElements = filteredFares.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const paginatedData = filteredFares.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    // Handlers
    const handleView = useCallback((fareId: string) => {
        router.push(`/mot/fares/${fareId}`);
    }, [router]);

    const handleEdit = useCallback((fareId: string) => {
        router.push(`/mot/fares/${fareId}/edit`);
    }, [router]);

    const handleDelete = useCallback((fare: Fare) => {
        setFareToDelete(fare);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (fareToDelete) {
            // TODO: Replace with API call
            alert(`Fare ${fareToDelete.id} deleted (simulated)`);
            setFareToDelete(null);
        }
    }, [fareToDelete]);

    const handleDeactivate = useCallback((fare: Fare) => {
        // TODO: Replace with API call
        alert(`Fare ${fare.id} deactivated (simulated)`);
    }, []);

    const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
        setSortField(field);
        setSortDirection(direction);
    }, []);

    const handleClearAll = useCallback(() => {
        setSearchTerm('');
        setStatusFilter('all');
        setBusTypeFilter('all');
        setOperatorFilter('all');
        setRegionFilter('all');
    }, []);

    const handleExport = useCallback(() => {
        alert('Export feature coming soon');
    }, []);

    useSetPageActions(
        <div className="flex items-center gap-2 shrink-0">
            <button
                onClick={() => router.push('/mot/fares/upload')}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
                <Upload className="w-4 h-4" />
                Upload New Fare
            </button>
            <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
                <Download className="w-4 h-4" />
                Export
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
                {/* Stats Cards */}
                <FareStatsCards stats={stats} />

                {/* Filters */}
                <FareFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    busTypeFilter={busTypeFilter}
                    onBusTypeChange={setBusTypeFilter}
                    operatorFilter={operatorFilter}
                    onOperatorChange={setOperatorFilter}
                    regionFilter={regionFilter}
                    onRegionChange={setRegionFilter}
                    filterOptions={filterOptions}
                    totalCount={allFares.length}
                    filteredCount={filteredFares.length}
                    onClearAll={handleClearAll}
                />

                {/* Table + Pagination */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <FaresTable
                        fares={paginatedData}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onDeactivate={handleDeactivate}
                        onSort={handleSort}
                        currentSort={{ field: sortField, direction: sortDirection }}
                    />

                    <DataPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(0); }}
                    />
                </div>

            {/* Delete Modal */}
            {fareToDelete && (
                <DeleteFareModal
                    fare={fareToDelete}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setFareToDelete(null)}
                />
            )}
        </div>
    );
}
