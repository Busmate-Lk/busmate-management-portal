'use client';

import React from 'react';
import { Users, Clock, Search } from 'lucide-react';
import type { StaffType } from '@/data/mot/staff';

type TabValue = 'all' | StaffType;

interface StaffTypeTabsProps {
    activeTab: TabValue;
    onTabChange: (tab: TabValue) => void;
    counts: {
        all: number;
        timekeeper: number;
        inspector: number;
    };
}

export function StaffTypeTabs({ activeTab, onTabChange, counts }: StaffTypeTabsProps) {
    const tabs: { value: TabValue; label: string; icon: React.ElementType; count: number }[] = [
        { value: 'all', label: 'All Staff', icon: Users, count: counts.all },
        { value: 'timekeeper', label: 'Timekeepers', icon: Clock, count: counts.timekeeper },
        { value: 'inspector', label: 'Inspectors', icon: Search, count: counts.inspector },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1.5">
            <div className="flex gap-1">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => onTabChange(tab.value)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            <span
                                className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[22px] text-center ${isActive
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
