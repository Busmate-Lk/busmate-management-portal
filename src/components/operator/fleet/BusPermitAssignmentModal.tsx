'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, Calendar, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { BusOperatorOperationsService, BusPermitAssignmentService } from '../../../../generated/api-clients/route-management';
import type { PassengerServicePermitResponse, BusPassengerServicePermitAssignmentRequest } from '../../../../generated/api-clients/route-management';
import { useAuth } from '@/context/AuthContext';

interface BusPermitAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  busId: string;
  busRegistration: string;
  onAssignmentCreated?: () => void;
}

export function BusPermitAssignmentModal({
  isOpen,
  onClose,
  busId,
  busRegistration,
  onAssignmentCreated
}: BusPermitAssignmentModalProps) {
  const { user } = useAuth();
  const operatorId = user?.id || '11111111-1111-1111-1111-111111111112';

  // State
  const [permits, setPermits] = useState<PassengerServicePermitResponse[]>([]);
  const [selectedPermit, setSelectedPermit] = useState<PassengerServicePermitResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default dates
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const oneYearLater = new Date(today);
      oneYearLater.setFullYear(today.getFullYear() + 1);

      setStartDate(today.toISOString().split('T')[0]);
      setEndDate(oneYearLater.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  // Load permits
  const loadPermits = useCallback(async () => {
    if (!operatorId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await BusOperatorOperationsService.getOperatorPermits(
        operatorId,
        0, // page
        100, // size - get all available permits
        'permitNumber', // sortBy
        'asc', // sortDir
        'active', // only active permits
        undefined, // permitType
        searchTerm || undefined // searchText
      );

      if (response.content) {
        setPermits(response.content);
      } else {
        setPermits([]);
      }
    } catch (err) {
      console.error('Error loading permits:', err);
      setError('Failed to load permits. Please try again.');
      setPermits([]);
    } finally {
      setIsLoading(false);
    }
  }, [operatorId, searchTerm]);

  // Load permits when modal opens or search changes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        loadPermits();
      }, searchTerm ? 300 : 0); // Debounce search

      return () => clearTimeout(timer);
    }
  }, [isOpen, loadPermits]);

  // Handle assignment creation
  const handleCreateAssignment = async () => {
    if (!selectedPermit || !startDate) {
      setError('Please select a permit and start date.');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      const assignmentRequest: BusPassengerServicePermitAssignmentRequest = {
        busId,
        passengerServicePermitId: selectedPermit.id!,
        startDate,
        endDate: endDate || undefined,
        requestStatus: 'ACCEPTED', // Auto-approve
        status: 'active'
      };

      await BusPermitAssignmentService.createAssignment(assignmentRequest);

      // Success - close modal and notify parent
      onAssignmentCreated?.();
      handleClose();

    } catch (err) {
      console.error('Error creating assignment:', err);
      setError('Failed to create assignment. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setSelectedPermit(null);
    setSearchTerm('');
    setError(null);
    setPermits([]);
    onClose();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Get permit status badge
  const getPermitStatusBadge = (status?: string) => {
    if (!status) return '';
    
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    switch (status.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'expired':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'suspended':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Filter permits based on search
  const filteredPermits = permits.filter(permit =>
    permit.permitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permit.permitType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permit.routeGroupName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Assign Bus to Permit
              </h2>
              <p className="text-sm text-gray-600">
                Bus: {busRegistration}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Search Permits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search and Select Permit
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by permit number, type, or route group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Permits List */}
          <div>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Loading permits...</p>
              </div>
            ) : filteredPermits.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No permits found</h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? "No permits match your search criteria."
                    : "No active permits available for assignment."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredPermits.map((permit) => (
                  <div
                    key={permit.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPermit?.id === permit.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPermit(permit)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {permit.permitNumber}
                          </span>
                          <span className={getPermitStatusBadge(permit.status)}>
                            {permit.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Type: {permit.permitType || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Route Group: {permit.routeGroupName || 'N/A'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Issue: {formatDate(permit.issueDate || '')}</span>
                          <span>Expiry: {formatDate(permit.expiryDate || '')}</span>
                        </div>
                      </div>
                      {selectedPermit?.id === permit.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assignment Dates */}
          {selectedPermit && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Assignment Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for open-ended assignment
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateAssignment}
            disabled={!selectedPermit || !startDate || isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
            {isCreating ? 'Creating Assignment...' : 'Create Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
}