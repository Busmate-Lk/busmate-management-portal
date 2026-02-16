'use client';

import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/shared/layout';
import StaffForm from '@/components/mot/staff/StaffForm';
import type { StaffMember } from '@/data/staff';

export default function EditStaffPage() {
    const router = useRouter();
    const params = useParams();
    const staffId = params.staffId as string;

    const handleSuccess = (staff: StaffMember) => {
        // Redirect back to the staff details page
        router.push(`/mot/staff-management/${staff.id}`);
    };

    const handleCancel = () => {
        router.push(`/mot/staff-management/${staffId}`);
    };

    return (
        <Layout
            activeItem="staff"
            pageTitle="Edit Staff Member"
            pageDescription="Update staff member information"
            role="mot"
        >
            <div className="mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col items-start gap-4">
                    <button
                        onClick={() => router.push(`/mot/staff-management/${staffId}`)}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Staff Details
                    </button>
                </div>

                {/* Form */}
                <StaffForm
                    staffId={staffId}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </Layout>
    );
}
