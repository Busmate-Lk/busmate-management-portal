"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { BackupRecovery } from "@/components/admin/settings"

export default function BackupPage() {
  // Set page metadata with breadcrumbs
  useSetPageMetadata({
    title: "Backup & Recovery",
    description: "Manage system backups and restore points",
    activeItem: "settings",
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: "Settings", href: "/admin/settings" },
      { label: "Backup & Recovery" },
    ]
  })

  return <BackupRecovery />
}
