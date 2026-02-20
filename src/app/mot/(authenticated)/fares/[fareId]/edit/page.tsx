'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';
import { Layout } from '@/components/shared/layout';
import { getFareById, FareFormData } from '@/data/mot/fares';
import { FareForm } from '@/components/mot/fares/FareForm';
import { ChevronRight, AlertCircle } from 'lucide-react';

export default function EditFarePage() {
    const router = useRouter();
    const params = useParams();
    const fareId = params.fareId as string;

    const fare = useMemo(() => getFareById(fareId), [fareId]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initialData: Partial<FareFormData> | undefined = useMemo(() => {
        if (!fare) return undefined;
        return {
            busType: fare.busType,
            facilityType: fare.facilityType,
            route: fare.route,
            operator: fare.operator,
            operatorType: fare.operatorType,
            province: fare.province,
            baseFare: String(fare.baseFare),
            perKmRate: String(fare.perKmRate),
            effectiveFrom: fare.effectiveFrom,
            effectiveTo: fare.effectiveTo || '',
            notes: fare.notes,
        };
    }, [fare]);

    const handleSubmit = useCallback(
        async (data: FareFormData) => {
            try {
                setIsSubmitting(true);
                setError(null);

                // TODO: Replace with API call when backend is ready
                await new Promise((resolve) => setTimeout(resolve, 1000));

                alert('Fare structure updated successfully!');
                router.push(`/mot/fares/${fareId}`);
            } catch (err) {
                setError('Failed to update fare structure. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        },
        [router, fareId]
    );

    const handleCancel = useCallback(() => {
        if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            router.push(`/mot/fares/${fareId}`);
        }
    }, [router, fareId]);

    if (!fare) {
        return (
            <Layout activeItem="fares" pageTitle="Fare Not Found" pageDescription="" role="mot">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Fare Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The fare structure with ID &quot;{fareId}&quot; could not be found.
                    </p>
                    <button
                        onClick={() => router.push('/mot/fares')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Fares
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout activeItem="fares" pageTitle={`Edit Fare ${fare.id}`} pageDescription={`Editing fare structure for ${fare.route}`} role="mot">
            <div className="space-y-6">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <button onClick={() => router.push('/mot')} className="hover:text-blue-600 transition-colors">
                        Home
                    </button>
                    <ChevronRight className="w-4 h-4" />
                    <button onClick={() => router.push('/mot/fares')} className="hover:text-blue-600 transition-colors">
                        Fare Structures
                    </button>
                    <ChevronRight className="w-4 h-4" />
                    <button onClick={() => router.push(`/mot/fares/${fareId}`)} className="hover:text-blue-600 transition-colors">
                        {fare.id}
                    </button>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 font-medium">Edit</span>
                </div>

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Fare Structure</h1>
                    <p className="text-gray-600 mt-1">
                        Update fare structure {fare.id} for {fare.route}
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-red-800">Error Updating Fare</h3>
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

                {/* Form */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Fare Information</h2>
                        <p className="text-sm text-gray-600 mt-1">Update the fare structure details</p>
                    </div>
                    <div className="p-6">
                        <FareForm
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isSubmitting={isSubmitting}
                            submitButtonText="Update Fare"
                            mode="edit"
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
