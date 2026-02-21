"use client"

import { useParams } from "next/navigation"
import { useSetPageMetadata } from "@/context/PageMetadata"
import { TimekeeperProfile } from "@/components/admin/profile"

export default function TimekeeperProfilePage() {
  const params = useParams()
  const userId = params.id as string

  // Set page metadata with breadcrumbs
  useSetPageMetadata({
    title: "Timekeeper Profile",
    description: "View and manage timekeeper account details",
    activeItem: "users",
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: "Users", href: "/admin/users" },
      { label: "Timekeeper Profile" },
    ]
  })

  return <TimekeeperProfile userId={userId} />
}
