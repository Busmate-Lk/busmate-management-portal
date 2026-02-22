'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Upload, Download } from 'lucide-react';
import { useSetPageMetadata, useSetPageActions } from '@/context/PageContext';
import { PolicyStatsCards } from '@/components/mot/policies/PolicyStatsCards';
import { PolicyFilters } from '@/components/mot/policies/PolicyFilters';
import { PoliciesTable } from '@/components/mot/policies/PoliciesTable';
import { DeletePolicyModal } from '@/components/mot/policies/DeletePolicyModal';
import { Pagination } from '@/components/mot/pagination';
import {
    getPolicies,
    getPolicyStatistics,
    getPolicyFilterOptions,
    Policy,
} from '@/data/mot/policies';

function PoliciesListContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useSetPageMetadata({
        title: 'Policy Management',
        description: 'Manage and monitor transport policies',
        activeItem: 'policies',
        showBreadcrumbs: true,
        breadcrumbs: [{ label: 'Policies' }],
    });

    // Load data from sample data (swap to API calls when backend is ready)
    const allPolicies = useMemo(() => getPolicies(), []);
    const statistics = useMemo(() => getPolicyStatistics(), []);
    const filterOptions = useMemo(() => getPolicyFilterOptions(), []);

    // Filter states
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
    const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
    const [departmentFilter, setDepartmentFilter] = useState(searchParams.get('department') || 'all');
    const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || 'all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Sort
    const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({
        field: 'lastModified',
        direction: 'desc',
    });

    // Delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [policyToDelete, setPolicyToDelete] = useState<Policy | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filter and sort policies
    const filteredPolicies = useMemo(() => {
        let filtered = allPolicies;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(term) ||
                    p.type.toLowerCase().includes(term) ||
                    p.author.toLowerCase().includes(term) ||
                    p.department.toLowerCase().includes(term) ||
                    p.description.toLowerCase().includes(term)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((p) => p.status === statusFilter);
        }
        if (typeFilter !== 'all') {
            filtered = filtered.filter((p) => p.type === typeFilter);
        }
        if (departmentFilter !== 'all') {
            filtered = filtered.filter((p) => p.department === departmentFilter);
        }
        if (priorityFilter !== 'all') {
            filtered = filtered.filter((p) => p.priority === priorityFilter);
        }

        // Sort
        filtered = [...filtered].sort((a, b) => {
            const aVal = (a as any)[sort.field] || '';
            const bVal = (b as any)[sort.field] || '';
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return sort.direction === 'asc' ? cmp : -cmp;
        });

        return filtered;
    }, [allPolicies, searchTerm, statusFilter, typeFilter, departmentFilter, priorityFilter, sort]);

    // Paginate
    const totalPages = Math.ceil(filteredPolicies.length / pageSize);
    const paginatedPolicies = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredPolicies.slice(start, start + pageSize);
    }, [filteredPolicies, currentPage, pageSize]);

    // Handlers
    const handleView = useCallback(
        (policyId: string) => router.push(`/mot/policies/${policyId}`),
        [router]
    );

    const handleEdit = useCallback(
        (policyId: string) => router.push(`/mot/policies/${policyId}/edit`),
        [router]
    );

    const handleDelete = useCallback((policy: Policy) => {
        setPolicyToDelete(policy);
        setShowDeleteModal(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!policyToDelete) return;
        try {
            setIsDeleting(true);
            // TODO: Replace with API call when backend is ready
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setShowDeleteModal(false);
            setPolicyToDelete(null);
            alert(`Policy "${policyToDelete.title}" deleted successfully!`);
        } catch (err) {
            setError('Failed to delete policy. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    }, [policyToDelete]);

    const handleUploadPolicy = useCallback(
        () => router.push('/mot/policies/upload'),
        [router]
    );

    const handleExport = useCallback(() => {
        try {
            const dataToExport = filteredPolicies.map((p) => ({
                ID: p.id,
                Title: p.title,
                Type: p.type,
                Status: p.status,
                Version: p.version,
                Author: p.author,
                Department: p.department,
                Priority: p.priority,
                'Effective Date': p.effectiveDate,
                'Last Modified': p.lastModified,
            }));

            const headers = Object.keys(dataToExport[0] || {});
            const csvContent = [
                headers.join(','),
                ...dataToExport.map((row) =>
                    headers
                        .map((h) => {
                            const val = row[h as keyof typeof row];
                            return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
                        })
                        .join(',')
                ),
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `policies-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch {
            alert('Failed to export. Please try again.');
        }
    }, [filteredPolicies]);

    const handleClearFilters = useCallback(() => {
        setSearchTerm('');
        setStatusFilter('all');
        setTypeFilter('all');
        setDepartmentFilter('all');
        setPriorityFilter('all');
        setCurrentPage(1);
    }, []);

    const handleSort = useCallback((field: string, direction: 'asc' | 'desc') => {
        setSort({ field, direction });
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);
    const handlePageSizeChange = useCallback((size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    }, []);

    useSetPageActions(
        <div className="flex items-center gap-2 shrink-0">
            <button
                onClick={handleUploadPolicy}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
                <Upload className="w-4 h-4" />
                Upload Policy
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
                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                                <button
                                    onClick={() => setError(null)}
                                    className="text-sm text-red-600 hover:text-red-800 underline mt-2"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <PolicyStatsCards stats={statistics} />

                {/* Filters + Actions */}
                <PolicyFilters
                    searchTerm={searchTerm}
                    onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
                    statusFilter={statusFilter}
                    onStatusChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
                    typeFilter={typeFilter}
                    onTypeChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}
                    departmentFilter={departmentFilter}
                    onDepartmentChange={(v) => { setDepartmentFilter(v); setCurrentPage(1); }}
                    priorityFilter={priorityFilter}
                    onPriorityChange={(v) => { setPriorityFilter(v); setCurrentPage(1); }}
                    filterOptions={filterOptions}
                    totalCount={filteredPolicies.length}
                    onClearAll={handleClearFilters}
                />

                {/* Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <PoliciesTable
                        policies={paginatedPolicies}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSort={handleSort}
                        currentSort={sort}
                    />

                    {/* Pagination */}
                    {filteredPolicies.length > 0 && (
                        <div className="border-t border-gray-200 px-4 pb-3">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={filteredPolicies.length}
                                itemsPerPage={pageSize}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                            />
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredPolicies.length === 0 && (
                        <div className="text-center py-12 px-4">
                            <div className="text-gray-500">
                                <div className="text-lg font-medium mb-2">No policies found</div>
                                <div className="text-sm mb-4">
                                    {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                                        ? 'Try adjusting your search or filters.'
                                        : 'Get started by uploading your first policy.'}
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                    {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-blue-600 hover:text-blue-700 underline text-sm"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                    <button
                                        onClick={handleUploadPolicy}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        Upload New Policy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Modal */}
                <DeletePolicyModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setPolicyToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    policy={policyToDelete}
                    isDeleting={isDeleting}
                />
            </div>
    );
}

export default function PoliciesPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    <span className="ml-2 text-gray-600">Loading policies...</span>
                </div>
            }
        >
            <PoliciesListContent />
        </Suspense>
    );
}
