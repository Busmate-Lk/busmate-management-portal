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
    Active: 'bg-green-100 text-green-800',
    Expired: 'bg-red-100 text-red-800',
    Pending: 'bg-amber-100 text-amber-800',
    Inactive: 'bg-gray-100 text-gray-800',
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
                <span className="font-medium text-gray-900">{fare.id}</span>
            ),
        },
        {
            key: 'route',
            header: 'Route / Operator',
            render: (fare) => (
                <div>
                    <p className="font-medium text-gray-900">{fare.route}</p>
                    <p className="text-xs text-gray-500">{fare.operator}</p>
                </div>
            ),
        },
        {
            key: 'busType',
            header: 'Bus Type',
            render: (fare) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                    {fare.busType}
                </span>
            ),
        },
        {
            key: 'baseFare',
            header: 'Base Fare',
            sortable: true,
            render: (fare) => (
                <span className="font-medium text-gray-900">Rs. {fare.baseFare.toFixed(2)}</span>
            ),
        },
        {
            key: 'perKmRate',
            header: 'Per Km',
            sortable: true,
            render: (fare) => (
                <span className="text-gray-700">Rs. {fare.perKmRate.toFixed(2)}</span>
            ),
        },
        {
            key: 'effectiveFrom',
            header: 'Effective From',
            sortable: true,
            render: (fare) => (
                <span className="text-gray-600 text-sm">
                    {new Date(fare.effectiveFrom).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (fare) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[fare.status] || 'bg-gray-100 text-gray-800'}`}
                >
                    {fare.status}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (fare) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onView(fare.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onEdit(fare.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Edit"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    {fare.status === 'Active' && onDeactivate && (
                        <button
                            onClick={() => onDeactivate(fare)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                            title="Deactivate"
                        >
                            <Power className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(fare)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
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
            onSort={(sort) => onSort(sort.field, sort.direction)}
            rowKey={(fare) => fare.id}
            emptyState={{
                icon: '💰',
                title: 'No fare structures found',
                description: 'No fare structures match the current filters. Try adjusting your search criteria.',
            }}
        />
    );
}
