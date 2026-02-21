'use client';

import { useSetPageMetadata } from "@/context/PageContext"
import { OperatorProfile } from "@/components/operator/profile"

export default function ProfilePage() {
  useSetPageMetadata({
    title: 'Fleet Operator Profile',
    description: 'Manage your operator account settings, business information, and fleet preferences',
    activeItem: 'profile',
    showBreadcrumbs: true,
    breadcrumbs: [{ label: 'Profile' }],
    padding: 0,
  })

  return (
    <div className="p-6">
      <OperatorProfile />
    </div>
  )
}
