'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/shared/layout';
import StaffForm from '@/components/mot/staff/StaffForm';
import type { StaffMember } from '@/data/mot/staff';

export default function AddNewStaffPage() {
  const router = useRouter();

  const handleSuccess = (staff: StaffMember) => {
    // Redirect to the newly created staff member's details page
    if (staff?.id) {
      router.push(`/mot/staff-management/${staff.id}`);
    } else {
      router.push('/mot/staff-management');
    }
  };

  const handleCancel = () => {
    router.push('/mot/staff-management');
  };

  return (
    <Layout
      activeItem="staff"
      pageTitle="Add New Staff Member"
      pageDescription="Create a new staff member with assignment and operational information"
      role="mot"
    >
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start gap-4">
          <button
            onClick={() => router.push('/mot/staff-management')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Staff Management
          </button>
        </div>

        {/* Form */}
        <StaffForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </Layout>
  );
}
