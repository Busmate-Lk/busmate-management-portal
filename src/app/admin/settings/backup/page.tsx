"use client"

import { Layout } from "@/components/shared/layout"
import { BackupRecovery } from "@/components/admin/settings"

export default function BackupPage() {
  return (
    <Layout
      activeItem="settings"
      pageTitle="Backup & Recovery"
      pageDescription="Manage system backups and restore points"
      role="admin"
      breadcrumbs={[
        { label: "Settings", href: "/admin/settings" },
        { label: "Backup & Recovery" },
      ]}
    >
      <BackupRecovery />
    </Layout>
  )
}
