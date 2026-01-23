'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { ScheduleForm } from '@/components/mot/schedule-form/ScheduleForm';
import { ScheduleManagementService } from '../../../../../../generated/api-clients/route-management';
import { Layout } from '@/components/shared/layout';

export default function AddSchedulePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (scheduleData: any) => {
        setIsLoading(true);
        try {
            const response = await ScheduleManagementService.createScheduleFull(scheduleData);
            // Show success message (you can integrate with a toast system)
            console.log('Schedule created successfully:', response);

            // Redirect to schedule management page
            router.push('/mot/schedules');
        } catch (error) {
            console.error('Error creating schedule:', error);
            // Show error message
            throw error; // Re-throw to let the form handle it
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/mot/schedules');
    };

    return (
        <Layout
            role="mot"
            activeItem="schedules"
            pageTitle="Add New Schedule"
            pageDescription="Create a new schedule template with route stops and timing"
        >
                {/* Content */}
                    {/* <div className="bg-white rounded-lg shadow mx-auto px-4 sm:px-6 lg:px-8 py-8"> */}
                        <ScheduleForm
                            mode="create"
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={isLoading}
                        />
                    {/* </div> */}
        </Layout>
    );
}