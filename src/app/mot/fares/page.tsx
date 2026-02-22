'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';
import { useSetPageMetadata, useSetPageActions } from '@/context/PageContext';
import { getFares, getFareStatistics, getFareFilterOptions, Fare } from '@/data/mot/fares';
import { FareStatsCards } from '@/components/mot/fares/FareStatsCards';
import { FareFilters } from '@/components/mot/fares/FareFilters';
import { FaresTable } from '@/components/mot/fares/FaresTable';
import { DeleteFareModal } from '@/components/mot/fares/DeleteFareModal';
import { usePagination } from '@/components/mot/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

    // Pagination
    const { currentPage, totalPages, paginatedData, handlePageChange, totalItems } =
        usePagination(filteredFares, 10);

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
                    totalCount={filteredFares.length}
                    onClearAll={handleClearAll}
                />

                {/* Table */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Fare Structures Directory</h3>
                    </div>

                    <FaresTable
                        fares={paginatedData}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onDeactivate={handleDeactivate}
                        onSort={handleSort}
                        currentSort={{ field: sortField, direction: sortDirection }}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing page {currentPage} of {totalPages} ({totalItems} total)
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium ${page === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
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
