'use client';

import { AlertTriangle } from 'lucide-react';
import { Fare } from '@/data/fares';

interface DeleteFareModalProps {
    fare: Fare;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteFareModal({ fare, onConfirm, onCancel }: DeleteFareModalProps) {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onCancel} />

                {/* Modal */}
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto z-10">
                    <div className="p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            Delete Fare Structure
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-4">
                            Are you sure you want to delete fare structure{' '}
                            <strong>{fare.id}</strong> for route{' '}
                            <strong>{fare.route}</strong>? This action cannot be undone.
                        </p>
                        <div className="bg-red-50 rounded-lg p-3 mb-6">
                            <p className="text-xs text-red-700">
                                Associated distance bands and audit records will also be permanently removed.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
