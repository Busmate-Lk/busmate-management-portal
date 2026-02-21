'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, AlertCircle, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/shared/layout';
import { BusForm } from '@/components/mot/buses/bus-form';
import { 
  BusManagementService, 
  BusRequest,
  BusResponse,
  OperatorManagementService,
  OperatorResponse
} from '../../../../../generated/api-clients/route-management';

export default function AddBusPage() {
  const router = useRouter();
  
  // State
  const [operators, setOperators] = useState<OperatorResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [operatorsLoading, setOperatorsLoading] = useState(true);

  // Load operators for dropdown
  const loadOperators = useCallback(async () => {
    try {
      setOperatorsLoading(true);
      const operatorsList = await OperatorManagementService.getAllOperatorsAsList();
      setOperators(operatorsList || []);
    } catch (err) {
      console.error('Error loading operators:', err);
      setError('Failed to load operators list. Please try again.');
    } finally {
      setOperatorsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOperators();
  }, [loadOperators]);

  // Handle form submission
  const handleSubmit = async (busData: BusRequest): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await BusManagementService.createBus(busData);
      
      // Redirect to the newly created bus details page
      if (response.id) {
        router.push(`/mot/buses/${response.id}`);
      } else {
        router.push('/mot/buses');
      }
    } catch (err) {
      console.error('Error creating bus:', err);
      setError(err instanceof Error ? err.message : 'Failed to create bus. Please try again.');
      throw err; // Re-throw to let form handle the error state
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.back();
    }
  };

  return (
    <Layout
      activeItem="buses"
      pageTitle="Add New Bus"
      pageDescription="Register a new bus in the fleet management system"
      role="mot"
    >
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button 
            onClick={() => router.push('/mot')}
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <button 
            onClick={() => router.push('/mot/buses')}
            className="hover:text-blue-600 transition-colors"
          >
            Bus Management
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Add New Bus</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Bus</h1>
            <p className="text-gray-600 mt-1">
              Fill in the details below to register a new bus in the system
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Error Creating Bus</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-sm text-red-600 hover:text-red-800 underline mt-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Bus Information</h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter the bus registration and operational details
            </p>
          </div>

          <div className="p-6">
            <BusForm
              operators={operators}
              operatorsLoading={operatorsLoading}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              submitButtonText="Create Bus"
              mode="create"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}