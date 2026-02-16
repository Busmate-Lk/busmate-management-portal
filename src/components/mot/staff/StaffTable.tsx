'use client';

import React from 'react';
import {
    ChevronUp,
    ChevronDown,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle,
    MapPin,
    Users,
    Clock,
    Search,
} from 'lucide-react';

interface StaffTableData {
    id: string;
    fullName: string;
    phone?: string;
    email?: string;
    assignedLocation?: string;
    province?: string;
    staffType?: string;
    nic?: string;
    status?: string;
    createdAt?: string;
}

interface StaffTableProps {
    staff: StaffTableData[];
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string, name: string) => void;
    onSort: (sortBy: string, sortDir: 'asc' | 'desc') => void;
    activeFilters: Record<string, any>;
    loading: boolean;
    currentSort: { field: string; direction: 'asc' | 'desc' };
}

export function StaffTable({
    staff,
    onView,
    onEdit,
    onDelete,
    onSort,
    activeFilters,
    loading,
    currentSort,
}: StaffTableProps) {
    const getSortIcon = (field: string) => {
        if (currentSort.field !== field)
            return <ChevronUp className="w-4 h-4 text-gray-300" />;
        return currentSort.direction === 'asc' ? (
            <ChevronUp className="w-4 h-4 text-blue-600" />
        ) : (
            <ChevronDown className="w-4 h-4 text-blue-600" />
        );
    };

    const handleSort = (field: string) => {
        const newDirection =
            currentSort.field === field && currentSort.direction === 'asc'
                ? 'desc'
                : 'asc';
        onSort(field, newDirection);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        try {
            return new Date(dateString).toLocaleDateString('en-LK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'inactive':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'inactive':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getStaffTypeIcon = (type?: string) => {
        switch (type) {
            case 'timekeeper':
                return <Clock className="w-4 h-4 text-indigo-600" />;
            case 'inspector':
                return <Search className="w-4 h-4 text-purple-600" />;
            default:
                return <Users className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStaffTypeColor = (type?: string) => {
        switch (type) {
            case 'timekeeper':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'inspector':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    // Loading state
    if (loading && staff.length === 0) {
        return (
            <div className="p-10 text-center">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Loading staff members...</p>
            </div>
        );
    }

    // Empty state
    if (staff.length === 0) {
        const hasFilters = Object.values(activeFilters).some(Boolean);
        return (
            <div className="p-10 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No staff members found
                </h3>
                <p className="text-gray-500 text-sm">
                    {hasFilters
                        ? 'No staff members match your current filters.'
                        : 'No staff members have been added yet.'}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {[
                                { label: 'Full Name', field: 'fullName' },
                                { label: 'Contact', field: undefined },
                                { label: 'Type', field: undefined },
                                { label: 'Assignment', field: undefined },
                                { label: 'Status', field: undefined },
                                { label: 'Joined', field: 'createdAt' },
                                { label: 'Actions', field: undefined },
                            ].map((col, idx) => (
                                <th
                                    key={idx}
                                    onClick={col.field ? () => handleSort(col.field!) : undefined}
                                    className={`px-6 py-3.5 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs ${col.field
                                            ? 'cursor-pointer hover:bg-gray-100 transition'
                                            : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-1">
                                        <span>{col.label}</span>
                                        {col.field && getSortIcon(col.field)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {staff.map((member) => (
                            <tr key={member.id} className="hover:bg-blue-50/30 transition">
                                {/* Full Name */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                                            {member.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{member.fullName}</p>
                                            <p className="text-xs text-gray-500">{member.nic || '—'}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Contact */}
                                <td className="px-6 py-4 text-gray-700">
                                    <div>{member.phone || 'N/A'}</div>
                                    <div className="text-xs text-gray-500">{member.email || 'N/A'}</div>
                                </td>

                                {/* Staff Type */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${getStaffTypeColor(
                                            member.staffType
                                        )}`}
                                    >
                                        {getStaffTypeIcon(member.staffType)}
                                        {member.staffType || 'Unknown'}
                                    </span>
                                </td>

                                {/* Assignment */}
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                        <div>
                                            <div className="font-medium text-gray-800 text-sm">
                                                {member.assignedLocation || '—'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {member.province || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${getStatusColor(
                                            member.status
                                        )}`}
                                    >
                                        {getStatusIcon(member.status)}
                                        {member.status || 'Unknown'}
                                    </span>
                                </td>

                                {/* Joined Date */}
                                <td className="px-6 py-4 text-gray-500 text-sm">
                                    {formatDate(member.createdAt)}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => onView(member.id)}
                                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                                            title="View"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(member.id)}
                                            className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-600 transition"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(member.id, member.fullName)}
                                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition"
                                            title="Delete"
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

            {/* Inline loading indicator */}
            {loading && staff.length > 0 && (
                <div className="px-6 py-3 bg-blue-50 border-t border-blue-100 flex items-center gap-2 text-blue-700 text-xs">
                    <div className="animate-spin h-3 w-3 border-b-2 border-blue-600 rounded-full" />
                    <span>Updating data...</span>
                </div>
            )}
        </>
    );
}
