"use client"

import { Layout } from "@/components/shared/layout"
import { AdminProfile } from "@/components/admin/profile"

export default function ProfilePage() {
  return (
    <Layout
      activeItem="dashboard"
      pageTitle="Admin Profile"
      pageDescription="Manage your admin account settings, preferences, and security options"
      role="admin"
    >
      <AdminProfile />
    </Layout>
  )
}
