"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { AdminProfile } from "@/components/admin/profile"

export default function ProfilePage() {
  // Set page metadata
  useSetPageMetadata({
    title: "Admin Profile",
    description: "Manage your admin account settings, preferences, and security options",
    activeItem: "dashboard"
  })

  return <AdminProfile />
}
