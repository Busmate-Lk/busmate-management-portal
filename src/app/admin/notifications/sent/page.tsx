"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { MessageHistory } from "@/components/admin/broadcast"

export default function SentNotificationsPage() {
  // Set page metadata
  useSetPageMetadata({
    title: "Sent Notifications",
    description: "View all sent notifications and their delivery status",
    activeItem: "notifications"
  })

  return <MessageHistory />
}
