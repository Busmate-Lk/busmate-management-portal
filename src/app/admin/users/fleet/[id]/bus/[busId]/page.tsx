"use client"

import { useParams } from "next/navigation"
import { useSetPageMetadata } from "@/context/PageMetadata"
import { BusDetails } from "@/components/admin/shared"

export default function BusDetailsPage() {
  const params = useParams()
  const fleetId = params.id as string
  const busId = params.busId as string

  // Set page metadata with breadcrumbs
  useSetPageMetadata({
    title: "Bus Details",
    description: "View and manage bus information",
    activeItem: "users",
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: "Users", href: "/admin/users" },
      { label: "Fleet Profile", href: `/admin/users/fleet/${fleetId}` },
      { label: "Bus Details" },
    ]
  })

  return <BusDetails busId={busId} fleetId={fleetId} />
}
