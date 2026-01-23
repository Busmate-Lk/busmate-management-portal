'use client';

import { ArrowLeft } from 'lucide-react';
// import { MOTLayout } from "@/components/mot/layout";
import { PolicyHeader } from '@/components/mot/policy-header';
import { PolicyContent } from '@/components/mot/policy-content';
import { PolicySidebar } from '@/components/mot/policy-sidebar';
import { PolicyActionButtons } from '@/components/mot/policy-action-buttons';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import {
  DeleteConfirmationModal,
  DeactivationConfirmationModal,
} from '../../../../../../components/mot/confirmation-modals';
import { Layout } from "@/components/shared/layout";

export default function PolicyDetails() {
  const router = useRouter();
  const params = useParams();
  const policyId = params?.id || 'POL001';

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Mock policy data based on ID
  const getPolicyData = (id: string) => {
    const policies = {
      POL001: {
        id: 'POL001',
        title: 'Bus Operational Guidelines 2024',
        type: 'Operational',
        version: 'v2.1',
        status: 'Published',
        publishedDate: '2024-01-15',
        lastModified: '2024-01-20',
        effectiveDate: '2024-02-01',
        author: 'Transport Authority',
        description:
          'Comprehensive guidelines for bus operations, safety protocols, and service standards.',
        tags: ['transport', 'operations', 'safety', 'guidelines', '2024'],
      },
      POL002: {
        id: 'POL002',
        title: 'Safety Standards for Public Transport',
        type: 'Safety',
        version: 'v1.3',
        status: 'Published',
        publishedDate: '2024-02-01',
        lastModified: '2024-02-05',
        effectiveDate: '2024-02-15',
        author: 'Safety Department',
        description:
          'Mandatory safety standards and protocols for all public transport vehicles.',
        tags: ['safety', 'standards', 'transport', 'compliance'],
      },
      POL003: {
        id: 'POL003',
        title: 'Driver Licensing Requirements',
        type: 'Licensing',
        version: 'v1.0',
        status: 'Draft',
        publishedDate: '2024-03-10',
        lastModified: '2024-03-12',
        effectiveDate: '2024-04-01',
        author: 'HR Department',
        description:
          'Updated requirements and procedures for driver licensing and certification.',
        tags: ['licensing', 'drivers', 'requirements', 'certification'],
      },
    };
    return policies[id as keyof typeof policies] || policies.POL001;
  };

  const policy = getPolicyData(policyId as string);

  const handleEdit = () => {
    router.push(`/mot/edit-policy/${policy.id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    alert('Sharing functionality would be implemented here');
  };

  const handleDownload = () => {
    alert('Download functionality would be implemented here');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsDeleting(false);
    setShowDeleteModal(false);
    alert('Policy deleted successfully!');
    router.push('/mot/policy-update');
  };

  const handleDeactivate = async () => {
    setIsDeactivating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsDeactivating(false);
    setShowDeactivateModal(false);
    alert('Policy archived successfully!');
    router.push('/mot/policy-update');
  };

  const handleArchive = () => {
    setShowDeactivateModal(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  return (
    <Layout
      role="mot"
      activeItem="policy"
      pageTitle="Policy Details"
      pageDescription="View detailed information about the policy document"
      breadcrumbs={[
        { label: 'MOT', href: '/mot' },
        { label: 'Policy Management', href: '/mot/policy-update' },
        { label: policy.title }
      ]}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          onClick={() => router.push('/mot/policy-update')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Policy Management
        </button>

        <PolicyHeader
          policy={policy}
          onEdit={handleEdit}
          onPrint={handlePrint}
          onShare={handleShare}
          onDownload={handleDownload}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <PolicyContent description={policy.description} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PolicySidebar policy={policy} />
            <PolicyActionButtons
              onArchive={handleArchive}
              onDelete={handleDeleteClick}
            />
          </div>
        </div>

        {/* Modals */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title="Delete Policy"
          itemName={policy.title}
        />

        <DeactivationConfirmationModal
          isOpen={showDeactivateModal}
          onClose={() => setShowDeactivateModal(false)}
          onConfirm={handleDeactivate}
          isLoading={isDeactivating}
          title="Archive Policy"
          itemName={policy.title}
        />
      </div>
    </Layout>
  );
}
