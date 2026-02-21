"use client"

import { useParams } from "next/navigation"
import { useSetPageMetadata } from "@/context/PageMetadata"
import { PassengerProfile } from "@/components/admin/profile"

export default function PassengerProfilePage() {
  const params = useParams()
  const userId = params.id as string

  // Set page metadata with breadcrumbs
  useSetPageMetadata({
    title: "Passenger Profile",
    description: "View and manage passenger account details",
    activeItem: "users",
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: "Users", href: "/admin/users" },
      { label: "Passenger Profile" },
    ]
  })

  return <PassengerProfile userId={userId} />
}
