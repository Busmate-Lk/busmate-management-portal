'use client';

import { useState } from 'react';
import { 
  Route as RouteIcon, 
  Bus, 
  Calendar,
  Activity,
  RefreshCw,
  Eye,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import type { 
  PassengerServicePermitResponse, 
  OperatorResponse, 
  RouteGroupResponse,
  BusResponse 
} from '../../../../generated/api-clients/route-management';

interface TabType {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface OperatorPermitTabsSectionProps {
  permit: PassengerServicePermitResponse;
  operator: OperatorResponse | null;
  routeGroup: RouteGroupResponse | null;
  assignedBuses: BusResponse[];
  operatorLoading: boolean;
  routeGroupLoading: boolean;
  busesLoading: boolean;
  onRefresh: () => Promise<void>;
}

export function OperatorPermitTabsSection({ 
  permit, 
  operator, 
  routeGroup, 
  assignedBuses,
  operatorLoading,
  routeGroupLoading,
  busesLoading,
  onRefresh 
}: OperatorPermitTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('routes');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tabs: TabType[] = [
    { 
      id: 'routes', 
      label: 'Route Information', 
      icon: <RouteIcon className="w-4 h-4" />,
      count: routeGroup?.routes?.length || 0
    },
    { 
      id: 'fleet', 
      label: 'Fleet Assignment', 
      icon: <Bus className="w-4 h-4" />, 
      count: assignedBuses.length 
    },
    { 
      id: 'schedules', 
      label: 'Service Schedules', 
      icon: <Calendar className="w-4 h-4" />,
      count: 0 // TODO: Get from API
    },
    { 
      id: 'operations', 
      label: 'Operations Overview', 
      icon: <Activity className="w-4 h-4" />,
      count: 0 // TODO: Get from API
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    switch (status.toLowerCase()) {
      case 'active':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>;
      case 'inactive':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Inactive</span>;
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const renderRoutesTab = () => (
    <div className="space-y-6">
      {routeGroupLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading route information...</span>
        </div>
      ) : routeGroup ? (
        <>
          {/* Route Group Overview */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <RouteIcon className="w-5 h-5 text-blue-600" />
              Route Group Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Group Name:</span>
                  <span className="font-medium text-gray-900">{routeGroup.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Group ID:</span>
                  <span className="font-medium text-gray-900">{routeGroup.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-medium text-gray-900">{routeGroup.description || 'N/A'}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Routes:</span>
                  <span className="font-medium text-gray-900">{routeGroup.routes?.length || 0}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-gray-900">{formatDate(routeGroup.createdAt)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status:</span>
                  {getStatusBadge('active')}
                </div>
              </div>
            </div>
          </div>

          {/* Routes List */}
          {routeGroup.routes && routeGroup.routes.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">Authorized Routes</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Routes you are authorized to operate under this permit
                </p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {routeGroup.routes.map((route: any, index: number) => (
                  <div key={route.id || index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded">
                            <RouteIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{route.name || `Route ${index + 1}`}</h5>
                            <p className="text-sm text-gray-600">
                              {route.description || 'No description available'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 ml-11">
                          <div className="text-sm">
                            <span className="text-gray-500">Direction:</span>
                            <p className="font-medium">{route.direction || 'N/A'}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Distance:</span>
                            <p className="font-medium">{route.distance ? `${route.distance} km` : 'N/A'}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Duration:</span>
                            <p className="font-medium">{route.duration ? `${route.duration} min` : 'N/A'}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">Stops:</span>
                            <p className="font-medium">{route.stops?.length || 0} stops</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <RouteIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No route information available</p>
        </div>
      )}
    </div>
  );

  const renderFleetTab = () => (
    <div className="space-y-6">
      {busesLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading fleet information...</span>
        </div>
      ) : assignedBuses.length > 0 ? (
        <>
          {/* Fleet Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bus className="w-5 h-5 text-blue-600" />
              Fleet Assignment Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{assignedBuses.length}</div>
                <div className="text-sm text-blue-600 font-medium">Total Assigned</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {assignedBuses.filter(bus => bus.status === 'active').length}
                </div>
                <div className="text-sm text-green-600 font-medium">Active Buses</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {permit.maximumBusAssigned || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Max Allowed</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {Math.max(0, (permit.maximumBusAssigned || 0) - assignedBuses.length)}
                </div>
                <div className="text-sm text-amber-600 font-medium">Available Slots</div>
              </div>
            </div>
          </div>

          {/* Bus List */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Assigned Buses</h4>
              <p className="text-sm text-gray-600 mt-1">
                Buses currently assigned to this permit
              </p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {assignedBuses.map((bus, index) => (
                <div key={bus.id || index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded">
                          <Bus className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {bus.ntcRegistrationNumber || 'No Registration'}
                          </h5>
                          <p className="text-sm text-gray-600">
                            Capacity: {bus.capacity || 'N/A'} passengers
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 ml-11">
                        <div className="text-sm">
                          <span className="text-gray-500">Status:</span>
                          <div className="mt-1">{getStatusBadge(bus.status)}</div>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Manufacturer:</span>
                          <p className="font-medium">{(bus as any).manufacturer || 'N/A'}</p>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Model:</span>
                          <p className="font-medium">{bus.model || 'N/A'}</p>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Year:</span>
                          <p className="font-medium">{(bus as any).yearOfManufacture || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Bus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No buses assigned to this permit</p>
        </div>
      )}
    </div>
  );

  const renderSchedulesTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Service Schedules
        </h3>
        
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Schedule management coming soon</p>
          <p className="text-sm text-gray-500">
            View and manage service schedules for this permit
          </p>
        </div>
      </div>
    </div>
  );

  const renderOperationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Operations Overview
        </h3>
        
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Operations analytics coming soon</p>
          <p className="text-sm text-gray-500">
            Track trip performance, passenger statistics, and operational metrics
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
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
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'routes' && renderRoutesTab()}
        {activeTab === 'fleet' && renderFleetTab()}
        {activeTab === 'schedules' && renderSchedulesTab()}
        {activeTab === 'operations' && renderOperationsTab()}
      </div>
    </div>
  );
}
