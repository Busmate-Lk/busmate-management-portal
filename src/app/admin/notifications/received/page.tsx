"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { MessageHistory } from "@/components/admin/broadcast"

export default function ReceivedNotificationsPage() {
  // Set page metadata
  useSetPageMetadata({
    title: "Received Notifications",
    description: "View notifications received from system and other administrators",
    activeItem: "notifications"
  })

  return <MessageHistory />
}
