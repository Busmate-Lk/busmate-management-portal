'use client';

import { Bus, Calendar, MapPin, Settings, Wrench, User, Edit, AlertTriangle, CheckCircle, Link } from 'lucide-react';
import type { BusResponse } from '../../../../generated/api-clients/route-management';

interface OperatorBusSummaryProps {
  bus: BusResponse;
  onEdit?: () => void;
  onScheduleMaintenance?: () => void;
  onAssignDriver?: () => void;
  onAssignPermit?: () => void;
  onViewLocation?: () => void;
}

export function OperatorBusSummary({ 
  bus, 
  onEdit,
  onScheduleMaintenance,
  onAssignDriver,
  onAssignPermit,
  onViewLocation
}: OperatorBusSummaryProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return '';
    
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1';
    switch (status.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <AlertTriangle className="w-4 h-4" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Parse facilities and show only enabled ones (true values)
  const parseFacilities = (facilities: any): string[] => {
    if (!facilities) return [];
    
    try {
      let facilitiesObj: { [key: string]: boolean } = {};
      
      if (typeof facilities === 'string') {
        facilitiesObj = JSON.parse(facilities);
      } else if (typeof facilities === 'object' && facilities !== null) {
        facilitiesObj = facilities;
      }
      
      // Return only facilities that are true
      return Object.entries(facilitiesObj)
        .filter(([key, value]) => Boolean(value))
        .map(([key, value]) => formatFacilityName(key));
    } catch (error) {
      console.warn('Error parsing facilities:', error);
      return [];
    }
  };

  // Format facility key to readable name
  const formatFacilityName = (key: string): string => {
    const facilityLabels: { [key: string]: string } = {
      'ac': 'Air Conditioning',
      'wifi': 'WiFi',
      'cctv': 'CCTV Cameras',
      'gps': 'GPS Tracking',
      'audio_system': 'Audio System',
      'charging_ports': 'Charging Ports',
      'wheelchair_accessible': 'Wheelchair Accessible',
      'air_suspension': 'Air Suspension',
      'toilet': 'Toilet',
      'tv_screens': 'TV Screens',
      'reading_lights': 'Reading Lights',
      'seat_belts': 'Seat Belts',
      'emergency_exits': 'Emergency Exits',
      'fire_extinguisher': 'Fire Extinguisher'
    };
    
    return facilityLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const enabledFacilities = parseFacilities(bus.facilities);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {bus.plateNumber || bus.ntcRegistrationNumber || 'Unknown Bus'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={getStatusBadge(bus.status)}>
                  {getStatusIcon(bus.status)}
                  {bus.status ? bus.status.charAt(0) + bus.status.slice(1).toLowerCase() : 'Unknown'}
                </span>
                {bus.ntcRegistrationNumber && bus.plateNumber && (
                  <span className="text-sm text-gray-500">
                    NTC: {bus.ntcRegistrationNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {onViewLocation && (
              <button
                onClick={onViewLocation}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="View Location"
              >
                <MapPin className="w-5 h-5" />
              </button>
            )}
            {onAssignDriver && (
              <button
                onClick={onAssignDriver}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Assign Driver"
              >
                <User className="w-5 h-5" />
              </button>
            )}
            {onAssignPermit && (
              <button
                onClick={onAssignPermit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Assign to Permit"
              >
                <Link className="w-5 h-5" />
              </button>
            )}
            {onScheduleMaintenance && (
              <button
                onClick={onScheduleMaintenance}
                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                title="Schedule Maintenance"
              >
                <Wrench className="w-5 h-5" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Bus"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bus Details Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            Basic Information
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Registration Number</label>
              <p className="text-sm text-gray-900 font-medium">{bus.ntcRegistrationNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Plate Number</label>
              <p className="text-sm text-gray-900 font-medium">{bus.plateNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Model</label>
              <p className="text-sm text-gray-900">{bus.model || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Operator ID</label>
              <p className="text-sm text-gray-900 font-mono text-xs">{bus.operatorId || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created By</label>
              <p className="text-sm text-gray-900">{bus.createdBy || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Capacity & Operational Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bus className="w-5 h-5 text-gray-600" />
            Operational Details
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Seating Capacity</label>
              <p className="text-sm text-gray-900 font-medium">{bus.capacity || 'N/A'} passengers</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Operator Name</label>
              <p className="text-sm text-gray-900">{bus.operatorName || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated By</label>
              <p className="text-sm text-gray-900">{bus.updatedBy || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Status</label>
              <div className="mt-1">
                <span className={getStatusBadge(bus.status)}>
                  {getStatusIcon(bus.status)}
                  {bus.status ? bus.status.charAt(0) + bus.status.slice(1).toLowerCase() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Registration & Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            Registration & Dates
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Added to Fleet</label>
              <p className="text-sm text-gray-900">{formatDate(bus.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-sm text-gray-900">{formatDate(bus.updatedAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Bus ID</label>
              <p className="text-sm text-gray-900 font-mono text-xs">{bus.id || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      {enabledFacilities.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Bus Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {enabledFacilities.map((facility, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}