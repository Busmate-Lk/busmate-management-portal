'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { Layout } from '@/components/shared/layout';
import BusStopForm from '@/components/mot/bus-stops/bus-stop-form';
import { StopResponse } from '../../../../../../generated/api-clients/route-management';

export default function AddNewBusStopPage() {
  const router = useRouter();

  const handleSuccess = (busStop: StopResponse) => {
    // Redirect to the newly created bus stop details page
    router.push(`/mot/bus-stops/${busStop.id}`);
  };

  const handleCancel = () => {
    router.push('/mot/bus-stops');
  };

  return (
    <Layout
      activeItem="bus-stops"
      pageTitle="Add New Bus Stop"
      pageDescription="Create a new bus stop with location and facility information"
      role="mot"
    >
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start gap-4">
          <button
            onClick={() => router.push('/mot/bus-stops')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Bus Stops
          </button>
          {/* <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Plus className="w-6 h-6 mr-2" />
              Add New Bus Stop
            </h1>
            <p className="text-gray-600 mt-1">
              Create a new bus stop by providing location details and facilities information.
            </p>
          </div> */}
        </div>

        {/* Form */}
        <BusStopForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
}