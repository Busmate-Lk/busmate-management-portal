"use client"

import { useParams } from "next/navigation"
import { useSetPageMetadata } from "@/context/PageMetadata"
import { MotAdminProfile } from "@/components/admin/profile"

export default function MotProfilePage() {
  const params = useParams()
  const userId = params.id as string

  // Set page metadata with breadcrumbs
  useSetPageMetadata({
    title: "MOT Officer Profile",
    description: "View and manage MOT officer account details",
    activeItem: "users",
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: "Users", href: "/admin/users" },
      { label: "MOT Officer Profile" },
    ]
  })

  return <MotAdminProfile userId={userId} />
}
