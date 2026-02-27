'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, Car, UserCheck } from 'lucide-react';
import { useSetPageMetadata } from '@/context/PageContext';
import { StaffStatsCards } from '@/components/operator/staff/StaffStatsCards';
import { StaffFilters } from '@/components/operator/staff/StaffFilters';
import { DriversTable } from '@/components/operator/staff/DriversTable';
import { ConductorsTable } from '@/components/operator/staff/ConductorsTable';
import {
  getAllStaff,
  getStaffStats,
  type StaffMember,
  type Driver,
  type Conductor,
  type StaffStats,
} from '@/data/operator/staff';

type TabId = 'all' | 'drivers' | 'conductors';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'all',        label: 'All Staff',   icon: <Users className="w-4 h-4" /> },
  { id: 'drivers',    label: 'Drivers',      icon: <Car className="w-4 h-4" /> },
  { id: 'conductors', label: 'Conductors',   icon: <UserCheck className="w-4 h-4" /> },
];

export default function StaffManagementPage() {
  useSetPageMetadata({
    title: 'Staff Management',
    description: 'View drivers and conductors employed by your organization',
    activeItem: 'staff',
    showBreadcrumbs: true,
    breadcrumbs: [{ label: 'Staff Management' }],
    padding: 0,
  });

  const [activeTab,    setActiveTab]    = useState<TabId>('all');
  const [searchTerm,   setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter,  setShiftFilter]  = useState('all');

  const [allStaff, setAllStaff] = useState<StaffMember[]>([]);
  const [stats,    setStats]    = useState<StaffStats | null>(null);
  const [loading,  setLoading]  = useState(true);

  // Load mock data
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [staffData, statsData] = await Promise.all([getAllStaff(), getStaffStats()]);
      if (mounted) {
        setAllStaff(staffData);
        setStats(statsData);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Apply filters
  const filteredStaff = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return allStaff.filter(s => {
      const roleMatch =
        activeTab === 'all'
        || (activeTab === 'drivers'    && s.role === 'DRIVER')
        || (activeTab === 'conductors' && s.role === 'CONDUCTOR');

      const searchMatch =
        !q
        || s.fullName.toLowerCase().includes(q)
        || s.nic.toLowerCase().includes(q)
        || s.phone.toLowerCase().includes(q)
        || s.employeeId.toLowerCase().includes(q);

      const statusMatch = statusFilter === 'all' || s.status === statusFilter;
      const shiftMatch  = shiftFilter  === 'all' || s.shiftStatus === shiftFilter;

      return roleMatch && searchMatch && statusMatch && shiftMatch;
    });
  }, [allStaff, activeTab, searchTerm, statusFilter, shiftFilter]);

  const drivers    = filteredStaff.filter(s => s.role === 'DRIVER')    as Driver[];
  const conductors = filteredStaff.filter(s => s.role === 'CONDUCTOR') as Conductor[];

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setShiftFilter('all');
  }, []);

  // Tab counts based on unfiltered data for context
  const tabCounts = useMemo(() => ({
    all:        allStaff.length,
    drivers:    allStaff.filter(s => s.role === 'DRIVER').length,
    conductors: allStaff.filter(s => s.role === 'CONDUCTOR').length,
  }), [allStaff]);

  return (
    <div className="p-6 space-y-6">
        {/* Stats cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-5 w-12 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <StaffStatsCards stats={stats} />
        ) : null}

        {/* Tabs + Filters */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Tab navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex px-4 pt-3" aria-label="Staff tabs">
              {TABS.map(tab => {
                const count = tabCounts[tab.id];
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Filter bar */}
          <div className="p-4 border-b border-gray-100">
            <StaffFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              shiftFilter={shiftFilter}
              setShiftFilter={setShiftFilter}
              totalCount={tabCounts[activeTab]}
              filteredCount={
                activeTab === 'all'
                  ? filteredStaff.length
                  : activeTab === 'drivers'
                  ? drivers.length
                  : conductors.length
              }
              onClearAll={handleClearFilters}
            />
          </div>

          {/* Table content */}
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <span className="ml-3 text-gray-500">Loading staff…</span>
              </div>
            ) : activeTab === 'all' ? (
              /* Show both tables when "All Staff" tab is active */
              <div className="space-y-6">
                {/* Drivers section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Car className="w-4 h-4 text-green-600" />
                    <h3 className="text-sm font-semibold text-gray-700">
                      Drivers <span className="text-gray-400 font-normal">({drivers.length})</span>
                    </h3>
                  </div>
                  <DriversTable drivers={drivers} />
                </div>

                {/* Conductors section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-gray-700">
                      Conductors <span className="text-gray-400 font-normal">({conductors.length})</span>
                    </h3>
                  </div>
                  <ConductorsTable conductors={conductors} />
                </div>
              </div>
            ) : activeTab === 'drivers' ? (
              <DriversTable drivers={drivers} />
            ) : (
              <ConductorsTable conductors={conductors} />
            )}
          </div>
        </div>

        {/* Read-only notice */}
        <p className="text-xs text-gray-400 text-center">
          Staff records are managed by BusMate administration. This view is read-only.
          Contact support if you need to update staff information.
        </p>
    </div>
  );
}
