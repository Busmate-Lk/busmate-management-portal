'use client';

import React, { useState } from 'react';
import { 
  RouteIcon, 
  Wrench, 
  User, 
  MapPin, 
  DollarSign, 
  BarChart3, 
  FileText,
  Calendar,
  Settings,
  Activity,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import type { BusResponse, TripResponse } from '../../../../generated/api-clients/route-management';

interface TabType {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface OperatorBusTabsSectionProps {
  bus: BusResponse;
  trips: TripResponse[];
  tripsLoading: boolean;
  onRefresh: () => Promise<void>;
}

export function OperatorBusTabsSection({ 
  bus, 
  trips,
  tripsLoading,
  onRefresh 
}: OperatorBusTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Trip filters (for when trips are available)
  const [tripSearch, setTripSearch] = useState('');
  const [tripStatusFilter, setTripStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'tripDate' | 'scheduledDepartureTime' | 'status'>('tripDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const tabs: TabType[] = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: <BarChart3 className="w-4 h-4" />
    },
    { 
      id: 'schedule', 
      label: 'Schedule & Routes', 
      icon: <RouteIcon className="w-4 h-4" />, 
      count: trips.length
    },
    { 
      id: 'maintenance', 
      label: 'Maintenance', 
      icon: <Wrench className="w-4 h-4" />,
      count: 2 // Mock maintenance records
    },
    { 
      id: 'drivers', 
      label: 'Driver Assignments', 
      icon: <User className="w-4 h-4" />,
      count: 1 // Mock driver assignments
    },
    { 
      id: 'tracking', 
      label: 'Live Tracking', 
      icon: <MapPin className="w-4 h-4" />
    },
    { 
      id: 'revenue', 
      label: 'Revenue & Analytics', 
      icon: <DollarSign className="w-4 h-4" />
    },
    { 
      id: 'documents', 
      label: 'Documents & Permits', 
      icon: <FileText className="w-4 h-4" />,
      count: 3 // Mock document count
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'N/A';
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid time';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return '';
    
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    switch (status.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'completed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Trips</p>
              <p className="text-2xl font-bold text-blue-900">{trips.length}</p>
            </div>
            <RouteIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Status</p>
              <p className="text-2xl font-bold text-green-900">
                {bus.status === 'ACTIVE' ? 'Active' : 'Inactive'}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Maintenance Due</p>
              <p className="text-2xl font-bold text-orange-900">5 days</p>
            </div>
            <Wrench className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Capacity</p>
              <p className="text-2xl font-bold text-purple-900">{bus.capacity || 0}</p>
            </div>
            <User className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <RouteIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Bus added to route Colombo - Kandy</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Driver assigned: John Doe</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Wrench className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Maintenance scheduled</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Schedule & Routes</h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {tripsLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading schedule data...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled trips</h3>
          <p className="text-gray-500">This bus is not currently assigned to any routes.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Assign to Route
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">Showing {trips.length} scheduled trips</p>
          </div>
          <div className="divide-y divide-gray-200">
            {trips.map((trip, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Trip #{index + 1}</h4>
                    <p className="text-sm text-gray-500">Scheduled for today</p>
                  </div>
                  <span className={getStatusBadge('active')}>Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderMaintenanceTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Maintenance Records</h3>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          Schedule Maintenance
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Wrench className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Regular Service Due</h4>
                <p className="text-sm text-gray-500">Next maintenance scheduled in 5 days</p>
                <p className="text-xs text-orange-600 font-medium">Action Required</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Last Service Completed</h4>
                <p className="text-sm text-gray-500">Oil change and tire rotation</p>
                <p className="text-xs text-gray-500">Completed 3 weeks ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDriversTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Driver Assignments</h3>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Assign Driver
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">John Doe</h4>
              <p className="text-sm text-gray-500">Primary Driver</p>
              <p className="text-xs text-green-600 font-medium">Currently Assigned</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">License: DL123456</p>
              <p className="text-xs text-gray-500">Exp: Dec 2025</p>
            </div>
          </div>
          
          <div className="text-center py-4">
            <p className="text-gray-500">No backup driver assigned</p>
            <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">
              Assign Backup Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrackingTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Live Tracking</h3>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Online
        </span>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Live GPS Tracking</h3>
          <p className="text-gray-500 mb-6">View real-time location and route progress</p>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Open Live Map
          </button>
        </div>
      </div>
    </div>
  );

  const renderRevenueTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Revenue & Analytics</h3>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs. 45,000</p>
              <p className="text-sm text-green-600">+12% from last week</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Passengers</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-blue-600">+8% from last week</p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Occupancy</p>
              <p className="text-2xl font-bold text-gray-900">78%</p>
              <p className="text-sm text-purple-600">+5% from last week</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Documents & Permits</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Upload Document
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="divide-y divide-gray-200">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Insurance Certificate</h4>
                <p className="text-sm text-gray-500">Valid until: Dec 31, 2025</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
              Valid
            </span>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Revenue License</h4>
                <p className="text-sm text-gray-500">Valid until: Jun 30, 2025</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
              Valid
            </span>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-orange-600" />
              <div>
                <h4 className="font-medium text-gray-900">Fitness Certificate</h4>
                <p className="text-sm text-gray-500">Expires: Mar 15, 2025</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
              Expiring Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'schedule':
        return renderScheduleTab();
      case 'maintenance':
        return renderMaintenanceTab();
      case 'drivers':
        return renderDriversTab();
      case 'tracking':
        return renderTrackingTab();
      case 'revenue':
        return renderRevenueTab();
      case 'documents':
        return renderDocumentsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}