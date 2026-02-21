"use client"

import { Layout } from "@/components/shared/layout"
import { SystemSettings } from "@/components/admin/settings"

export default function SettingsPage() {
  return (
    <Layout
      activeItem="settings"
      pageTitle="System Settings"
      pageDescription="Configure system preferences, maintenance options, and backup settings"
      role="admin"
    >
      <SystemSettings />
    </Layout>
  )
}
