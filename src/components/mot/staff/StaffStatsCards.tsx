'use client';

import React from 'react';
import {
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    MapPin,
} from 'lucide-react';

interface StaffStatsCardsProps {
    stats: {
        totalStaff: { count: number; change?: string };
        activeStaff: { count: number; change?: string };
        inactiveStaff: { count: number; change?: string };
        totalTimekeepers: { count: number; change?: string };
        totalInspectors: { count: number; change?: string };
        provincesCount: { count: number; change?: string };
    };
}

export function StaffStatsCards({ stats }: StaffStatsCardsProps) {
    const cards = [
        {
            label: 'Total Staff',
            count: stats.totalStaff.count,
            change: stats.totalStaff.change,
            icon: Users,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            changeColor: 'text-green-600',
        },
        {
            label: 'Active',
            count: stats.activeStaff.count,
            change: stats.activeStaff.change,
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            changeColor: 'text-green-600',
        },
        {
            label: 'Inactive',
            count: stats.inactiveStaff.count,
            change: stats.inactiveStaff.change,
            icon: XCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            changeColor: 'text-red-600',
        },
        {
            label: 'Timekeepers',
            count: stats.totalTimekeepers.count,
            change: stats.totalTimekeepers.change,
            icon: Clock,
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            changeColor: 'text-green-600',
        },
        {
            label: 'Inspectors',
            count: stats.totalInspectors.count,
            change: stats.totalInspectors.change,
            icon: Search,
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            changeColor: 'text-green-600',
        },
        {
            label: 'Provinces',
            count: stats.provincesCount.count,
            change: stats.provincesCount.change,
            icon: MapPin,
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            changeColor: 'text-green-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className={`${card.bgColor} ${card.borderColor} rounded-xl shadow-sm border-2 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                    <div className="flex items-center">
                        <div className={`${card.iconBg} ${card.iconColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">{card.label}</p>
                            <p className="text-3xl font-bold text-gray-900 mb-1">
                                {card.count.toLocaleString()}
                            </p>
                            {card.change && (
                                <p className={`text-sm font-medium ${card.changeColor}`}>
                                    {card.change}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
