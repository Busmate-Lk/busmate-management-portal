'use client';

import { FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { DataTable, DataTableColumn, SortState } from '@/components/shared/DataTable';
import { Policy } from '@/data/mot/policies';

interface PoliciesTableProps {
    policies: Policy[];
    onView: (policyId: string) => void;
    onEdit: (policyId: string) => void;
    onDelete: (policy: Policy) => void;
    onSort: (field: string, direction: 'asc' | 'desc') => void;
    currentSort: { field: string; direction: 'asc' | 'desc' };
    loading?: boolean;
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'published':
            return 'bg-green-100 text-green-800';
        case 'draft':
            return 'bg-yellow-100 text-yellow-800';
        case 'under review':
            return 'bg-blue-100 text-blue-800';
        case 'archived':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
        case 'high':
            return 'bg-red-100 text-red-700';
        case 'medium':
            return 'bg-orange-100 text-orange-700';
        case 'low':
            return 'bg-gray-100 text-gray-600';
        default:
            return 'bg-gray-100 text-gray-600';
    }
};

export function PoliciesTable({
    policies,
    onView,
    onEdit,
    onDelete,
    onSort,
    currentSort,
    loading,
}: PoliciesTableProps) {
    const columns: DataTableColumn<Policy>[] = [
        {
            key: 'title',
            header: 'Policy Title',
            sortable: true,
            render: (policy) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 text-sm">{policy.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{policy.department}</div>
                    </div>
                </div>
            ),
        },
        {
            key: 'type',
            header: 'Type',
            render: (policy) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {policy.type}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (policy) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                    {policy.status}
                </span>
            ),
        },
        {
            key: 'priority',
            header: 'Priority',
            render: (policy) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(policy.priority)}`}>
                    {policy.priority}
                </span>
            ),
        },
        {
            key: 'version',
            header: 'Version',
            render: (policy) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono text-gray-600 bg-gray-100">
                    {policy.version}
                </span>
            ),
        },
        {
            key: 'lastModified',
            header: 'Last Modified',
            sortable: true,
            render: (policy) => (
                <span className="text-sm text-gray-600">{policy.lastModified}</span>
            ),
        },
        {
            key: 'author',
            header: 'Author',
            render: (policy) => (
                <span className="text-sm text-gray-600">{policy.author}</span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (policy) => (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => onView(policy.id)}
                        title="View Policy"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => onEdit(policy.id)}
                        title="Edit Policy"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => onDelete(policy)}
                        title="Delete Policy"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    const sortState: SortState | undefined = currentSort
        ? { field: currentSort.field, direction: currentSort.direction }
        : undefined;

    const handleSort = (newSort: SortState) => {
        onSort(newSort.field, newSort.direction);
    };

    return (
        <DataTable<Policy>
            columns={columns}
            data={policies}
            loading={loading}
            currentSort={sortState}
            onSort={handleSort}
            rowKey={(policy) => policy.id}
            emptyState={{
                title: 'No policies found',
                description: 'Try adjusting your search or filters, or upload a new policy.',
            }}
        />
    );
}
