'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useSetPageMetadata } from '@/context/PageContext';
import {
  RouteGroupInfoCard,
  RouteDetailsPanel
} from '@/components/mot/routes/route-group-details';
import DeleteRouteConfirmation from '@/components/mot/routes/DeleteRouteConfirmation';
import { RouteManagementService } from '../../../../../../generated/api-clients/route-management';
import type { RouteGroupResponse, RouteResponse } from '../../../../../../generated/api-clients/route-management';

export default function RouteGroupDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const routeGroupId = params.routeGroupId as string;

  useSetPageMetadata({
    title: routeGroup?.name || 'Route Group Details',
    description: routeGroup?.description || 'Manage route group details and routes',
    activeItem: 'routes',
    showBreadcrumbs: true,
    breadcrumbs: [{ label: 'Routes', href: '/mot/routes' }, { label: routeGroup?.name || 'Route Group' }],
  });

  // State
  const [routeGroup, setRouteGroup] = useState<RouteGroupResponse | null>(null);
  const [routes, setRoutes] = useState<RouteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Route Group Details
  const loadRouteGroupDetails = useCallback(async () => {
    if (!routeGroupId) return;

    try {
      setIsLoading(true);
      setError(null);

      const routeGroupData = await RouteManagementService.getRouteGroupById(routeGroupId);
      setRouteGroup(routeGroupData);
      setRoutes(routeGroupData.routes || []);

    } catch (err) {
      console.error('Error loading route group details:', err);
      setError('Failed to load route group details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [routeGroupId]);

  useEffect(() => {
    loadRouteGroupDetails();
  }, [loadRouteGroupDetails]);

  // Handlers
  const handleEdit = () => {
    router.push(`/mot/routes/${routeGroupId}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!routeGroup?.id) return;

    try {
      setIsDeleting(true);
      await RouteManagementService.deleteRouteGroup(routeGroup.id);
      router.push('/mot/routes');
    } catch (error) {
      console.error('Error deleting route group:', error);
      setError('Failed to delete route group. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mb-4" />
        <p className="text-gray-500 font-medium">Loading route group...</p>
      </div>
    );
  }

  // Error state
  if (error || !routeGroup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {error || 'Route group not found'}
        </h3>
        <p className="text-gray-500 mb-6 text-center max-w-md text-sm">
          We couldn&apos;t load the route group details. This might be due to a network issue or the route group may have been deleted.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={loadRouteGroupDetails}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => router.push('/mot/routes')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Back to Routes
          </button>
        </div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Route Group Info Card with Statistics */}
        <RouteGroupInfoCard
          routeGroup={routeGroup}
          routes={routes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />

        {/* Routes Details Panel */}
        <RouteDetailsPanel routes={routes} />

        {/* Delete Confirmation Modal */}
        <DeleteRouteConfirmation
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          routeGroup={routeGroup}
          isDeleting={isDeleting}
        />
      </div>
  );
}