'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';
import { Layout } from '@/components/shared/layout';
import { getFareById } from '@/data/mot/fares';
import { FareSummary } from '@/components/mot/fares/FareSummary';
import { FareTabsSection } from '@/components/mot/fares/FareTabsSection';
import { DeleteFareModal } from '@/components/mot/fares/DeleteFareModal';
import { ChevronRight, Edit, Trash2, ArrowLeft } from 'lucide-react';

export default function FareDetailPage() {
    const router = useRouter();
    const params = useParams();
    const fareId = params.fareId as string;

    const fare = useMemo(() => getFareById(fareId), [fareId]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleEdit = useCallback(() => {
        router.push(`/mot/fares/${fareId}/edit`);
    }, [router, fareId]);

    const handleDelete = useCallback(() => {
        setShowDeleteModal(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        // TODO: Replace with API call
        alert(`Fare ${fareId} deleted (simulated)`);
        setShowDeleteModal(false);
        router.push('/mot/fares');
    }, [fareId, router]);

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
        <Layout activeItem="fares" pageTitle={`Fare ${fare.id}`} pageDescription={fare.route} role="mot">
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
                    <span className="text-gray-900 font-medium">{fare.id}</span>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push('/mot/fares')}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Fares
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <FareSummary fare={fare} />

                {/* Tabs Section */}
                <FareTabsSection fare={fare} />
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <DeleteFareModal
                    fare={fare}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </Layout>
    );
}
