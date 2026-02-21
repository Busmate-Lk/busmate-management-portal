"use client"

import { useParams } from "next/navigation"
import { useSetPageMetadata } from "@/context/PageMetadata"
import { ConductorProfile } from "@/components/admin/profile"

export default function ConductorProfilePage() {
  const params = useParams()
  const userId = params.id as string

  // Set page metadata with breadcrumbs
  useSetPageMetadata({
    title: "Conductor Profile",
    description: "View and manage conductor account details",
    activeItem: "users",
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: "Users", href: "/admin/users" },
      { label: "Conductor Profile" },
    ]
  })

  return <ConductorProfile userId={userId} />
}
