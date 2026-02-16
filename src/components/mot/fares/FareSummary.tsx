'use client';

import { Fare } from '@/data/fares';
import { DollarSign, MapPin, Calendar, User, AlertCircle } from 'lucide-react';

interface FareSummaryProps {
    fare: Fare;
}

export function FareSummary({ fare }: FareSummaryProps) {
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            Active: 'bg-green-100 text-green-800',
            Inactive: 'bg-gray-100 text-gray-800',
            Pending: 'bg-yellow-100 text-yellow-800',
            Expired: 'bg-red-100 text-red-800',
        };
        const cls = styles[status] || 'bg-gray-100 text-gray-800';
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
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
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
                {type}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{fare.route}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Fare ID: <strong>{fare.id}</strong></span>
                            <span>•</span>
                            <span>Operator: <strong>{fare.operator}</strong></span>
                            <span>•</span>
                            <span>Region: <strong>{fare.region}</strong></span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {getBusTypeBadge(fare.busType)}
                        {getStatusBadge(fare.status)}
                    </div>
                </div>
            </div>

            {/* Key metrics */}
            <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Base Fare</p>
                            <p className="text-xl font-bold text-blue-600">Rs. {fare.baseFare.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Per KM Rate</p>
                            <p className="text-xl font-bold text-green-600">Rs. {fare.perKmRate.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Facility Type</p>
                            <p className="text-xl font-bold text-purple-600">{fare.facilityType}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Effective From</p>
                            <p className="text-xl font-bold text-orange-600">{formatDate(fare.effectiveFrom)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
