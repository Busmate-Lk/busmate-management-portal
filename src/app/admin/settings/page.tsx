"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { SystemSettings } from "@/components/admin/settings"

export default function SettingsPage() {
  // Set page metadata
  useSetPageMetadata({
    title: "System Settings",
    description: "Configure system preferences, maintenance options, and backup settings",
    activeItem: "settings"
  })

  return <SystemSettings />
}
