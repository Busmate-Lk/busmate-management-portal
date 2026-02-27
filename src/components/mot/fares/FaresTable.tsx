'use client';

import { Eye, Edit, Trash2, Power } from 'lucide-react';
import { Fare } from '@/data/mot/fares';
import { DataTable, DataTableColumn, SortState } from '@/components/shared/DataTable';

interface FaresTableProps {
    fares: Fare[];
    onView: (fareId: string) => void;
    onEdit: (fareId: string) => void;
    onDelete: (fare: Fare) => void;
    onDeactivate?: (fare: Fare) => void;
    onSort: (field: string, direction: 'asc' | 'desc') => void;
    currentSort: SortState;
    loading?: boolean;
}

const statusColors: Record<string, string> = {
    Active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Expired: 'bg-red-50 text-red-600 border border-red-200',
    Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    Inactive: 'bg-gray-100 text-gray-600 border border-gray-200',
};

export function FaresTable({
    fares,
    onView,
    onEdit,
    onDelete,
    onDeactivate,
    onSort,
    currentSort,
    loading,
}: FaresTableProps) {
    const columns: DataTableColumn<Fare>[] = [
        {
            key: 'id',
            header: 'Fare ID',
            sortable: true,
            render: (fare) => (
                <span className="text-sm font-semibold text-gray-900">{fare.id}</span>
            ),
        },
        {
            key: 'route',
            header: 'Route / Operator',
            minWidth: 'min-w-[160px]',
            render: (fare) => (
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{fare.route}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{fare.operator}</p>
                </div>
            ),
        },
        {
            key: 'busType',
            header: 'Bus Type',
            cellClassName: 'whitespace-nowrap',
            render: (fare) => (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    {fare.busType}
                </span>
            ),
        },
        {
            key: 'baseFare',
            header: 'Base Fare',
            sortable: true,
            cellClassName: 'whitespace-nowrap',
            render: (fare) => (
                <span className="text-sm font-semibold text-gray-900">Rs. {fare.baseFare.toFixed(2)}</span>
            ),
        },
        {
            key: 'perKmRate',
            header: 'Per Km',
            sortable: true,
            cellClassName: 'whitespace-nowrap',
            render: (fare) => (
                <span className="text-sm text-gray-700">Rs. {fare.perKmRate.toFixed(2)}</span>
            ),
        },
        {
            key: 'effectiveFrom',
            header: 'Effective From',
            sortable: true,
            cellClassName: 'whitespace-nowrap',
            render: (fare) => (
                <span className="text-xs text-gray-500 tabular-nums">
                    {new Date(fare.effectiveFrom).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            cellClassName: 'whitespace-nowrap',
            render: (fare) => (
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusColors[fare.status] || 'bg-gray-100 text-gray-600 border border-gray-200'}`}
                >
                    {fare.status}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            headerClassName: 'text-center',
            cellClassName: 'text-center whitespace-nowrap',
            render: (fare) => (
                <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => onView(fare.id)}
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors duration-100"
                        title="View"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onEdit(fare.id)}
                        className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors duration-100"
                        title="Edit"
                    >
                        <Edit className="w-3.5 h-3.5" />
                    </button>
                    {fare.status === 'Active' && onDeactivate && (
                        <button
                            onClick={() => onDeactivate(fare)}
                            className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors duration-100"
                            title="Deactivate"
                        >
                            <Power className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(fare)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-100"
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <DataTable<Fare>
            columns={columns}
            data={fares}
            loading={loading}
            currentSort={currentSort}
            onSort={onSort}
            rowKey={(fare) => fare.id}
            showRefreshing
            emptyState={
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                        <span className="text-3xl">💰</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">No fare structures found</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                        No fare structures match the current filters. Try adjusting your search criteria.
                    </p>
                </div>
            }
        />
    );
}
