"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { ComposeMessage } from "@/components/admin/broadcast"

export default function ComposeNotificationPage() {
  // Set page metadata with breadcrumbs
  useSetPageMetadata({
    title: "Compose Notification",
    description: "Create and send notifications to users",
    activeItem: "notifications",
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: "Notifications", href: "/admin/notifications" },
      { label: "Compose" },
    ]
  })

  return <ComposeMessage />
}
