'use client';

import { 
  FileText, 
  Building2, 
  Calendar, 
  User, 
  Bus, 
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Route as RouteIcon,
  Shield,
  Award,
  TrendingUp
} from 'lucide-react';
import type { 
  PassengerServicePermitResponse, 
  OperatorResponse, 
  RouteGroupResponse,
  BusResponse 
} from '../../../../generated/api-clients/route-management';

interface OperatorPermitSummaryProps {
  permit: PassengerServicePermitResponse;
  operator: OperatorResponse | null;
  routeGroup: RouteGroupResponse | null;
  assignedBuses: BusResponse[];
}

export function OperatorPermitSummary({ 
  permit, 
  operator, 
  routeGroup, 
  assignedBuses 
}: OperatorPermitSummaryProps) {
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

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status.toLowerCase()) {
      case 'active':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>;
      case 'inactive':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Inactive</span>;
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case 'expired':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Expired</span>;
      case 'cancelled':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</span>;
    }
  };

  const getPermitTypeBadge = (permitType?: string) => {
    if (!permitType) return null;
    
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (permitType.toUpperCase()) {
      case 'REGULAR':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Regular Service</span>;
      case 'SPECIAL':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Special Service</span>;
      case 'TEMPORARY':
        return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>Temporary</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{permitType}</span>;
    }
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expiry > now && expiry <= thirtyDaysFromNow;
  };

  const getValidityStatus = () => {
    if (!permit.expiryDate) return { text: 'No expiry date', color: 'text-gray-600', icon: FileText };
    
    if (isExpired(permit.expiryDate)) {
      return { text: 'Expired', color: 'text-red-600', icon: XCircle };
    }
    
    if (isExpiringSoon(permit.expiryDate)) {
      return { text: 'Expiring Soon', color: 'text-yellow-600', icon: AlertTriangle };
    }
    
    return { text: 'Valid', color: 'text-green-600', icon: CheckCircle };
  };

  const validityStatus = getValidityStatus();

  // Calculate operational statistics for operator view
  const operationalStats = {
    totalBusesAssigned: assignedBuses.length,
    activeBuses: assignedBuses.filter(bus => bus.status === 'active').length,
    maxBusesAllowed: permit.maximumBusAssigned || 0,
    busUtilization: permit.maximumBusAssigned ? 
      Math.round((assignedBuses.length / permit.maximumBusAssigned) * 100) : 0,
    routeCoverage: routeGroup?.routes?.length || 0,
  };

  const getComplianceStatus = () => {
    if (isExpired(permit.expiryDate)) {
      return { text: 'Non-Compliant', color: 'text-red-600 bg-red-50', icon: XCircle };
    }
    if (isExpiringSoon(permit.expiryDate)) {
      return { text: 'Action Required', color: 'text-yellow-600 bg-yellow-50', icon: AlertTriangle };
    }
    if (permit.status === 'active') {
      return { text: 'Compliant', color: 'text-green-600 bg-green-50', icon: CheckCircle };
    }
    return { text: 'Under Review', color: 'text-blue-600 bg-blue-50', icon: Clock };
  };

  const complianceStatus = getComplianceStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {permit.permitNumber || 'No Permit Number'}
                </h1>
                <p className="text-gray-600">Passenger Service Permit</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              {getStatusBadge(permit.status)}
              {getPermitTypeBadge(permit.permitType)}
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${complianceStatus.color}`}>
                <div className="flex items-center gap-1">
                  <complianceStatus.icon className="w-4 h-4" />
                  {complianceStatus.text}
                </div>
              </div>
            </div>
          </div>

          {/* Validity Status Card */}
          <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
            <div className="text-center">
              <validityStatus.icon className={`w-8 h-8 ${validityStatus.color} mx-auto mb-2`} />
              <div className="text-sm text-gray-600">Permit Status</div>
              <div className={`font-semibold ${validityStatus.color}`}>
                {validityStatus.text}
              </div>
              {permit.expiryDate && (
                <div className="text-xs text-gray-500 mt-1">
                  Expires: {formatDate(permit.expiryDate)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column - Permit Details */}
          <div className="space-y-6">
            
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Permit Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Permit Number:</span>
                  <span className="font-medium text-gray-900">{permit.permitNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Permit Type:</span>
                  <span className="font-medium text-gray-900">{permit.permitType || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Issue Date:</span>
                  <span className="font-medium text-gray-900">{formatDate(permit.issueDate)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Expiry Date:</span>
                  <span className={`font-medium ${isExpiringSoon(permit.expiryDate) || isExpired(permit.expiryDate) ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(permit.expiryDate)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Maximum Buses:</span>
                  <span className="font-medium text-gray-900">{permit.maximumBusAssigned || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Route Coverage */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <RouteIcon className="w-5 h-5 text-blue-600" />
                Route Coverage
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Route Group:</span>
                  <span className="font-medium text-gray-900">
                    {routeGroup?.name || 'Loading...'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Route Group ID:</span>
                  <span className="font-medium text-gray-900">
                    {routeGroup?.id || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Number of Routes:</span>
                  <span className="font-medium text-gray-900">
                    {operationalStats.routeCoverage} routes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Operational Statistics */}
          <div className="space-y-6">
            
            {/* Fleet Utilization */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-600" />
                Fleet Utilization
              </h3>
              
              {/* Utilization Chart */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Bus Utilization</span>
                  <span className="text-sm font-medium text-gray-900">
                    {operationalStats.busUtilization}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(operationalStats.busUtilization, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {operationalStats.totalBusesAssigned} of {operationalStats.maxBusesAllowed} buses assigned
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Assigned:</span>
                  <span className="font-medium text-gray-900">{operationalStats.totalBusesAssigned} buses</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Active Buses:</span>
                  <span className="font-medium text-green-600">{operationalStats.activeBuses} buses</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Remaining Capacity:</span>
                  <span className="font-medium text-gray-900">
                    {Math.max(0, operationalStats.maxBusesAllowed - operationalStats.totalBusesAssigned)} buses
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Indicators */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Performance Summary
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-xs text-green-600 font-medium">COMPLIANCE</div>
                  <div className="text-lg font-bold text-green-700">
                    {permit.status === 'active' && !isExpired(permit.expiryDate) ? 'Good' : 'Review'}
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-xs text-blue-600 font-medium">UTILIZATION</div>
                  <div className="text-lg font-bold text-blue-700">
                    {operationalStats.busUtilization >= 80 ? 'High' : 
                     operationalStats.busUtilization >= 50 ? 'Medium' : 'Low'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Items (if any) */}
        {(isExpiringSoon(permit.expiryDate) || isExpired(permit.expiryDate)) && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800">Action Required</h4>
                <p className="text-sm text-amber-700 mt-1">
                  {isExpired(permit.expiryDate) 
                    ? 'This permit has expired. Contact the Ministry of Transport to renew your permit immediately.'
                    : 'This permit is expiring soon. Please initiate the renewal process to avoid service disruption.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
