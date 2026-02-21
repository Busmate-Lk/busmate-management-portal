"use client"

import { useParams } from "next/navigation"
import { useSetPageMetadata } from "@/context/PageMetadata"
import { FleetProfile } from "@/components/admin/profile"

export default function FleetProfilePage() {
  const params = useParams()
  const fleetId = params.id as string

  // Set page metadata with breadcrumbs
  useSetPageMetadata({
    title: "Fleet Operator Profile",
    description: "View and manage fleet operator account details",
    activeItem: "users",
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: "Users", href: "/admin/users" },
      { label: "Fleet Operator Profile" },
    ]
  })

  return <FleetProfile fleetId={fleetId} />
}
