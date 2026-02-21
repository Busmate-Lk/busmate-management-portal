'use client';

import Link from 'next/link';
import { Eye, Car, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Driver } from '@/data/operator/staff';

interface DriversTableProps {
  drivers: Driver[];
}

function StatusBadge({ status }: { status: Driver['status'] }) {
  const map = {
    ACTIVE:    { label: 'Active',    cls: 'bg-green-100 text-green-800 border-green-200',  icon: <CheckCircle className="w-3 h-3" /> },
    INACTIVE:  { label: 'Inactive',  cls: 'bg-gray-100 text-gray-700 border-gray-200',     icon: <XCircle className="w-3 h-3" /> },
    ON_LEAVE:  { label: 'On Leave',  cls: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <AlertCircle className="w-3 h-3" /> },
    SUSPENDED: { label: 'Suspended', cls: 'bg-red-100 text-red-800 border-red-200',         icon: <XCircle className="w-3 h-3" /> },
  } as const;
  const { label, cls, icon } = map[status] ?? map.INACTIVE;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {icon}{label}
    </span>
  );
}

function ShiftBadge({ shift }: { shift: Driver['shiftStatus'] }) {
  const map = {
    AVAILABLE: { label: 'Available', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    ASSIGNED:  { label: 'Assigned',  cls: 'bg-orange-100 text-orange-800 border-orange-200' },
    OFF_DUTY:  { label: 'Off Duty',  cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  } as const;
  const { label, cls } = map[shift] ?? map.OFF_DUTY;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>{label}</span>;
}

export function DriversTable({ drivers }: DriversTableProps) {
  if (drivers.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No drivers found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Driver', 'Employee ID', 'NIC', 'Phone', 'License', 'Route', 'Status', 'Shift', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {drivers.map(driver => (
              <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                {/* Driver name + avatar */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold shrink-0">
                      {driver.avatarInitials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{driver.fullName}</p>
                      <p className="text-xs text-gray-500">{driver.yearsOfExperience} yrs exp.</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{driver.employeeId}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">{driver.nic}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{driver.phone}</td>

                {/* License */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-xs font-mono text-gray-700">{driver.license.licenseNumber}</p>
                  <p className="text-xs text-gray-400">Exp: {new Date(driver.license.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</p>
                </td>

                {/* Assigned route */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {driver.assignedRoute ? (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-800">{driver.assignedRoute}</p>
                        <p className="text-xs text-gray-500 truncate max-w-32">{driver.assignedRouteName}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Unassigned</span>
                  )}
                </td>

                <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={driver.status} /></td>
                <td className="px-4 py-3 whitespace-nowrap"><ShiftBadge shift={driver.shiftStatus} /></td>

                {/* Actions – view only */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`/operator/staff-management/${driver.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
