'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Trash2, 
  ChevronRight
} from 'lucide-react';
import { Layout } from '@/components/shared/layout';
import { RouteGroupSummaryCard } from '@/components/mot/routes/RouteGroupSummaryCard';
import { RoutesTabsSection } from '@/components/mot/routes/RoutesTabsSection';
import DeleteRouteConfirmation from '@/components/mot/routes/DeleteRouteConfirmation';
import { RouteManagementService } from '../../../../../../../generated/api-clients/route-management';
import type { RouteGroupResponse, RouteResponse } from '../../../../../../../generated/api-clients/route-management';

export default function RouteGroupDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const routeGroupId = params.routeGroupId as string;

  // State
  const [routeGroup, setRouteGroup] = useState<RouteGroupResponse | null>(null);
  const [routes, setRoutes] = useState<RouteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔌 API INTEGRATION POINT 1: Fetch Route Group Details
  const loadRouteGroupDetails = useCallback(async () => {
    if (!routeGroupId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch route group data which includes routes
      const routeGroupData = await RouteManagementService.getRouteGroupById(routeGroupId);
      setRouteGroup(routeGroupData);

      // Set routes from the route group data (routes are included in the response)
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

  // const handleAddRoute = () => {
  //   router.push(`/mot/route-form?groupId=${routeGroupId}`);
  // };

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
      
      // Navigate back to route groups list after successful deletion
      router.push('/mot/routes');
      
    } catch (error) {
      console.error('Error deleting route group:', error);
      setError('Failed to delete route group. Please try again.');
      // Keep the modal open on error so user can see what happened
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout
        activeItem="routes"
        pageTitle="Loading..."
        pageDescription="Loading route group details"
        role="mot"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading route group details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error || !routeGroup) {
    return (
      <Layout
        activeItem="routes"
        pageTitle="Error"
        pageDescription="Failed to load route group"
        role="mot"
      >
        <div className="text-center py-12">
          <div className="text-red-600 text-lg mb-4">
            {error || 'Route group not found'}
          </div>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      activeItem="routes"
      pageTitle={routeGroup.name || 'Route Group Details'}
      pageDescription="Detailed view of route group and its routes"
      role="mot"
      breadcrumbs={[
        { label: 'MOT', href: '/mot' },
        { label: 'Routes', href: '/mot/routes' },
        { label: routeGroup.name || 'Route Group Details' }
      ]}
    >
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-600 text-sm">{error}</div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* 1. Header Section - Breadcrumbs + Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Group
            </button>
            {/* <button
              onClick={handleAddRoute}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Route
            </button> */}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* 2. Route Group Summary Card */}
        <RouteGroupSummaryCard routeGroup={routeGroup} routes={routes} />

        {/* 3. Routes Tabs Section */}
        <RoutesTabsSection routes={routes} />

        {/* Delete Confirmation Modal */}
        <DeleteRouteConfirmation
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          routeGroup={routeGroup}
          isDeleting={isDeleting}
        />
      </div>
    </Layout>
  );
}