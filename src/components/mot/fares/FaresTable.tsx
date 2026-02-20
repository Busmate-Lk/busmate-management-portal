'use client';

import { Eye, Edit, Trash2, Power, ArrowUpDown } from 'lucide-react';
import { Fare } from '@/data/mot/fares';

interface FaresTableProps {
    fares: Fare[];
    onView: (fareId: string) => void;
    onEdit: (fareId: string) => void;
    onDelete: (fare: Fare) => void;
    onDeactivate?: (fare: Fare) => void;
    onSort: (field: string, direction: 'asc' | 'desc') => void;
    currentSort: { field: string; direction: 'asc' | 'desc' };
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export function FaresTable({
    fares,
    onView,
    onEdit,
    onDelete,
    onDeactivate,
    onSort,
    currentSort,
}: FaresTableProps) {
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            Active: 'bg-green-100 text-green-800',
            Inactive: 'bg-gray-100 text-gray-800',
            Pending: 'bg-yellow-100 text-yellow-800',
            Expired: 'bg-red-100 text-red-800',
        };
        const cls = styles[status] || 'bg-gray-100 text-gray-800';
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
                {status}
            </span>
        );
    };

    const getBusTypeBadge = (type: string) => {
        const styles: Record<string, string> = {
            AC: 'bg-blue-100 text-blue-800',
            'Non-AC': 'bg-gray-100 text-gray-800',
            'Semi-Luxury': 'bg-purple-100 text-purple-800',
        };
        const cls = styles[type] || 'bg-gray-100 text-gray-800';
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
                {type}
            </span>
        );
    };

    const handleSort = (field: string) => {
        const newDirection =
            currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
        onSort(field, newDirection);
    };

    const sortableHeader = (label: string, field: string) => (
        <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1">
                {label}
                <ArrowUpDown className="w-3 h-3" />
            </div>
        </th>
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        {sortableHeader('Fare ID', 'id')}
                        {sortableHeader('Route', 'route')}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bus Type
                        </th>
                        {sortableHeader('Base Fare (Rs.)', 'baseFare')}
                        {sortableHeader('Per KM Rate (Rs.)', 'perKmRate')}
                        {sortableHeader('Effective From', 'effectiveFrom')}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {fares.map((fare) => (
                        <tr key={fare.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {fare.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{fare.route}</p>
                                    <p className="text-sm text-gray-500">{fare.operator}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getBusTypeBadge(fare.busType)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Rs. {fare.baseFare.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Rs. {fare.perKmRate.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDate(fare.effectiveFrom)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(fare.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => onView(fare.id)}
                                        className="text-blue-600 hover:text-blue-700 transition-colors"
                                        title="View details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(fare.id)}
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                        title="Edit fare"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    {onDeactivate && fare.status === 'Active' && (
                                        <button
                                            onClick={() => onDeactivate(fare)}
                                            className="text-orange-600 hover:text-orange-700 transition-colors"
                                            title="Deactivate fare"
                                        >
                                            <Power className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onDelete(fare)}
                                        className="text-red-600 hover:text-red-700 transition-colors"
                                        title="Delete fare"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Empty state */}
            {fares.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Eye className="w-12 h-12 mx-auto opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No fare structures found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria or add a new fare structure.</p>
                </div>
            )}
        </div>
    );
}
