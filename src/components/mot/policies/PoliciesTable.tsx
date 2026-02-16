'use client';

import { FileText, Eye, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Policy } from '@/data/policies';

interface PoliciesTableProps {
    policies: Policy[];
    onView: (policyId: string) => void;
    onEdit: (policyId: string) => void;
    onDelete: (policy: Policy) => void;
    onSort: (field: string, direction: 'asc' | 'desc') => void;
    currentSort: { field: string; direction: 'asc' | 'desc' };
    loading?: boolean;
}

export function PoliciesTable({
    policies,
    onView,
    onEdit,
    onDelete,
    onSort,
    currentSort,
    loading,
}: PoliciesTableProps) {
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

    const handleSort = (field: string) => {
        const direction =
            currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
        onSort(field, direction);
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (currentSort.field !== field) {
            return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />;
        }
        return currentSort.direction === 'asc' ? (
            <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
        ) : (
            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
        );
    };

    if (loading) {
        return (
            <div className="p-6">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-4 animate-pulse border-b border-gray-100">
                        <div className="h-4 bg-gray-200 rounded flex-1" />
                        <div className="h-4 bg-gray-200 rounded w-20" />
                        <div className="h-4 bg-gray-200 rounded w-16" />
                        <div className="h-4 bg-gray-200 rounded w-24" />
                        <div className="h-4 bg-gray-200 rounded w-20" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                            <button
                                onClick={() => handleSort('title')}
                                className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
                            >
                                Policy Title
                                <SortIcon field="title" />
                            </button>
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                            <button
                                onClick={() => handleSort('status')}
                                className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
                            >
                                Status
                                <SortIcon field="status" />
                            </button>
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Priority</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Version</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                            <button
                                onClick={() => handleSort('lastModified')}
                                className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
                            >
                                Last Modified
                                <SortIcon field="lastModified" />
                            </button>
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Author</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {policies.map((policy) => (
                        <tr
                            key={policy.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => onView(policy.id)}
                        >
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 text-sm">{policy.title}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{policy.department}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                    {policy.type}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                        policy.status
                                    )}`}
                                >
                                    {policy.status}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                        policy.priority
                                    )}`}
                                >
                                    {policy.priority}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono text-gray-600 bg-gray-100">
                                    {policy.version}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{policy.lastModified}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{policy.author}</td>
                            <td className="py-3 px-4">
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
