'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit } from 'lucide-react';
import { Layout } from '@/components/shared/layout';
import OperatorForm from '@/components/mot/users/operator/operator-form';
import { OperatorResponse } from '../../../../../../../../generated/api-clients/route-management';

export default function EditOperatorPage() {
  const router = useRouter();
  const params = useParams();
  const operatorId = params.operatorId as string;

  const handleSuccess = (operator: OperatorResponse) => {
    // Redirect back to the operator details page
    router.push(`/mot/users/operators/${operator.id}`);
  };

  const handleCancel = () => {
    router.push(`/mot/users/operators/${operatorId}`);
  };

  return (
    <Layout
      activeItem="operators"
      pageTitle="Edit Operator"
      pageDescription="Update operator information and operational details"
      role="mot"
    >
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start gap-4">
          <button
            onClick={() => router.push(`/mot/users/operators/${operatorId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Operator Details
          </button>
        </div>

        {/* Form */}
        <OperatorForm
          operatorId={operatorId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
}