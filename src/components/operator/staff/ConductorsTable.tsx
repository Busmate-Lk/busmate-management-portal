'use client';

import Link from 'next/link';
import { Eye, UserCheck, MapPin, CheckCircle, XCircle, AlertCircle, Languages } from 'lucide-react';
import type { Conductor } from '@/data/operator/staff';

interface ConductorsTableProps {
  conductors: Conductor[];
}

function StatusBadge({ status }: { status: Conductor['status'] }) {
  const map = {
    ACTIVE:    { label: 'Active',    cls: 'bg-green-100 text-green-800 border-green-200',    icon: <CheckCircle className="w-3 h-3" /> },
    INACTIVE:  { label: 'Inactive',  cls: 'bg-gray-100 text-gray-700 border-gray-200',       icon: <XCircle className="w-3 h-3" /> },
    ON_LEAVE:  { label: 'On Leave',  cls: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <AlertCircle className="w-3 h-3" /> },
    SUSPENDED: { label: 'Suspended', cls: 'bg-red-100 text-red-800 border-red-200',           icon: <XCircle className="w-3 h-3" /> },
  } as const;
  const { label, cls, icon } = map[status] ?? map.INACTIVE;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {icon}{label}
    </span>
  );
}

function ShiftBadge({ shift }: { shift: Conductor['shiftStatus'] }) {
  const map = {
    AVAILABLE: { label: 'Available', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    ASSIGNED:  { label: 'Assigned',  cls: 'bg-orange-100 text-orange-800 border-orange-200' },
    OFF_DUTY:  { label: 'Off Duty',  cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  } as const;
  const { label, cls } = map[shift] ?? map.OFF_DUTY;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>{label}</span>;
}

export function ConductorsTable({ conductors }: ConductorsTableProps) {
  if (conductors.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No conductors found</p>
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
              {['Conductor', 'Employee ID', 'NIC', 'Phone', 'Certificate', 'Route', 'Languages', 'Status', 'Shift', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {conductors.map(conductor => (
              <tr key={conductor.id} className="hover:bg-gray-50 transition-colors">
                {/* Conductor name + avatar */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold shrink-0">
                      {conductor.avatarInitials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{conductor.fullName}</p>
                      <p className="text-xs text-gray-500">{conductor.gender === 'FEMALE' ? 'Female' : conductor.gender === 'MALE' ? 'Male' : conductor.gender}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{conductor.employeeId}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">{conductor.nic}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{conductor.phone}</td>

                {/* Certificate */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-xs font-mono text-gray-700">{conductor.certificateNumber}</p>
                  <p className="text-xs text-gray-400">Exp: {new Date(conductor.certificationExpiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</p>
                </td>

                {/* Assigned route */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {conductor.assignedRoute ? (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-800">{conductor.assignedRoute}</p>
                        <p className="text-xs text-gray-500 truncate max-w-32">{conductor.assignedRouteName}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Unassigned</span>
                  )}
                </td>

                {/* Languages */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {conductor.languagesSpoken.slice(0, 2).map(lang => (
                      <span key={lang} className="px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-100">
                        {lang}
                      </span>
                    ))}
                    {conductor.languagesSpoken.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
                        +{conductor.languagesSpoken.length - 2}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={conductor.status} /></td>
                <td className="px-4 py-3 whitespace-nowrap"><ShiftBadge shift={conductor.shiftStatus} /></td>

                {/* Actions – view only */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`/operator/staffManagement/${conductor.id}`}
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
