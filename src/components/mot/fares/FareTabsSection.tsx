'use client';

import { useState } from 'react';
import { Fare } from '@/data/mot/fares';
import { User, Calendar, FileText, MapPin, AlertTriangle, CheckCircle, Phone } from 'lucide-react';

interface FareTabsSectionProps {
    fare: Fare;
}

export function FareTabsSection({ fare }: FareTabsSectionProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'distance-bands' | 'audit'>('overview');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const tabs = [
        { key: 'overview' as const, label: 'Overview' },
        { key: 'distance-bands' as const, label: 'Distance Bands' },
        { key: 'audit' as const, label: 'Audit Info' },
    ];

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            {/* Tab headers */}
            <div className="border-b border-gray-200 px-6">
                <nav className="flex gap-6 -mb-px">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Operator Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-green-600" />
                                Operator Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Operator</p>
                                    <p className="text-sm font-medium text-gray-900">{fare.operator}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Operator Type</p>
                                    <p className="text-sm font-medium text-gray-900">{fare.operatorType}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Province</p>
                                    <p className="text-sm font-medium text-gray-900">{fare.province}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Region</p>
                                    <p className="text-sm font-medium text-gray-900">{fare.region}</p>
                                </div>
                            </div>
                        </div>

                        {/* Validity */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                Validity Period
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Effective From</p>
                                    <p className="text-sm font-medium text-gray-900">{formatDate(fare.effectiveFrom)}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Effective To</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {fare.effectiveTo ? formatDate(fare.effectiveTo) : 'Ongoing (No end date)'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {fare.notes && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    Notes
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700 leading-relaxed">{fare.notes}</p>
                                </div>
                            </div>
                        )}

                        {/* SLTB Guidelines */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                SLTB Guidelines
                            </h3>
                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                                <p className="font-medium text-yellow-800">Ministry Approval Required</p>
                                <p className="text-yellow-700 text-xs mt-1">
                                    All fare changes require Ministry of Transport approval before implementation
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <p className="text-sm text-gray-700">Base fare: Rs. 30-50 range</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <p className="text-sm text-gray-700">Per km: Rs. 2.50-4.00 range</p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-yellow-200 mt-4">
                                <div className="flex items-center gap-2 text-blue-600">
                                    <Phone className="w-4 h-4" />
                                    <p className="text-sm">Transport Hotline: 1958</p>
                                </div>
                                <div className="flex items-center gap-2 text-blue-600 mt-1">
                                    <MapPin className="w-4 h-4" />
                                    <p className="text-sm">National Transport Commission, Colombo 00500</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Distance Bands Tab */}
                {activeTab === 'distance-bands' && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distance-Based Fare Bands</h3>
                        {fare.distanceBands.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Band
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Distance Range (km)
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fare (Rs.)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {fare.distanceBands.map((band, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    Band {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {band.min} - {band.max} km
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                    Rs. {band.fare.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No distance bands configured for this fare structure.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Audit Info Tab */}
                {activeTab === 'audit' && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Created Date</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(fare.createdDate)}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Last Updated</p>
                                <p className="text-sm font-medium text-gray-900">{formatDate(fare.lastUpdated)}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                                <p className="text-sm text-gray-500">Created By</p>
                                <p className="text-sm font-medium text-gray-900">{fare.createdBy}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
