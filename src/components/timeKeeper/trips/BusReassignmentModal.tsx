'use client';

import React, { useState } from 'react';
import { X, AlertCircle, BusFront, ArrowRightLeft } from 'lucide-react';
import { TripResponse } from '@/lib/api-client/route-management';

interface BusReassignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripResponse;
  availableBuses: Array<{ id: string; registrationNumber: string }>;
  onConfirm: (
    tripId: string,
    newBusId: string | null,
    reason: string
  ) => Promise<void>;
}

export function BusReassignmentModal({
  isOpen,
  onClose,
  trip,
  availableBuses,
  onConfirm,
}: BusReassignmentModalProps) {
  const [selectedAction, setSelectedAction] = useState<'remove' | 'reassign'>(
    'reassign'
  );
  const [selectedBusId, setSelectedBusId] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (selectedAction === 'reassign' && !selectedBusId) {
      setError('Please select a bus to reassign');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for this change');
      return;
    }

    try {
      setIsSubmitting(true);
      const busId = selectedAction === 'reassign' ? selectedBusId : null;
      await onConfirm(trip.id!, busId, reason);

      // Reset form
      setSelectedAction('reassign');
      setSelectedBusId('');
      setReason('');
    } catch (err: any) {
      setError(err?.message || 'Failed to update bus assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
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
      const timePart = timeString.includes('T')
        ? timeString.split('T')[1]
        : timeString;
      const [hours, minutes] = timePart.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return 'Invalid time';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-orange-100 p-2 rounded-lg mr-3">
              <ArrowRightLeft className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Bus Assignment
              </h3>
              <p className="text-sm text-gray-500">
                Remove or reassign bus for this trip
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Trip Details */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Trip Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Route:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {trip.routeName}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatDate(trip.tripDate)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Departure:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatTime(trip.scheduledDepartureTime)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Arrival:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {formatTime(trip.scheduledArrivalTime)}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Current Bus:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {trip.busPlateNumber || 'Not assigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Selection */}
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What would you like to do?
              </label>
              <div className="space-y-2">
                <label
                  className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50
                  {selectedAction === 'reassign' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
                >
                  <input
                    type="radio"
                    name="action"
                    value="reassign"
                    checked={selectedAction === 'reassign'}
                    onChange={(e) =>
                      setSelectedAction(e.target.value as 'reassign')
                    }
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">
                      Reassign to another bus
                    </div>
                    <div className="text-sm text-gray-500">
                      Select a different bus for this trip
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50
                  ${
                    selectedAction === 'remove'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="action"
                    value="remove"
                    checked={selectedAction === 'remove'}
                    onChange={(e) =>
                      setSelectedAction(e.target.value as 'remove')
                    }
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">
                      Remove bus assignment
                    </div>
                    <div className="text-sm text-gray-500">
                      Remove the current bus without assigning a new one
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Bus Selection (only shown when reassigning) */}
            {selectedAction === 'reassign' && (
              <div>
                <label
                  htmlFor="bus-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select New Bus
                </label>
                <select
                  id="bus-select"
                  value={selectedBusId}
                  onChange={(e) => setSelectedBusId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  required={selectedAction === 'reassign'}
                >
                  <option value="">-- Select a bus --</option>
                  {availableBuses
                    .filter(
                      (bus) => bus.registrationNumber !== trip.busPlateNumber
                    )
                    .map((bus) => (
                      <option key={bus.id} value={bus.id}>
                        {bus.registrationNumber}
                      </option>
                    ))}
                </select>
                {availableBuses.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    No other buses available at this time
                  </p>
                )}
              </div>
            )}

            {/* Reason */}
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reason for Change <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
                placeholder="Please provide a detailed reason for this bus assignment change..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                rows={4}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                This will be logged for record-keeping purposes
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            {/* Warning Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important:</p>
                <p>
                  {selectedAction === 'remove'
                    ? 'Removing the bus will leave this trip without an assigned vehicle. Make sure to assign a bus before the scheduled departure time.'
                    : 'Ensure the new bus is available and suitable for this route before confirming the reassignment.'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                (selectedAction === 'reassign' && !selectedBusId) ||
                !reason.trim()
              }
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  selectedAction === 'remove'
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : selectedAction === 'remove' ? (
                'Remove Bus'
              ) : (
                'Reassign Bus'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
