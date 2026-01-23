'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { Layout } from '@/components/shared/layout';
import OperatorForm from '@/components/mot/users/operator/operator-form';
import { OperatorResponse } from '../../../../../../../generated/api-clients/route-management';

export default function AddNewOperatorPage() {
  const router = useRouter();

  const handleSuccess = (operator: OperatorResponse) => {
    // Redirect to the newly created operator details page
    router.push(`/mot/users/operators/${operator.id}`);
  };

  const handleCancel = () => {
    router.push('/mot/users/operators');
  };

  return (
    <Layout
      activeItem="operators"
      pageTitle="Add New Operator"
      pageDescription="Create a new bus operator with company and operational information"
      role="mot"
    >
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start gap-4">
          <button
            onClick={() => router.push('/mot/users/operators')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Operators
          </button>
        </div>

        {/* Form */}
        <OperatorForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
}