"use client"

import { useParams } from "next/navigation"
import { Layout } from "@/components/shared/layout"
import { MotAdminProfile } from "@/components/admin/profile"

export default function MotProfilePage() {
  const params = useParams()
  const userId = params.id as string

  return (
    <Layout
      activeItem="users"
      pageTitle="MOT Officer Profile"
      pageDescription="View and manage MOT officer account details"
      role="admin"
      breadcrumbs={[
        { label: "Users", href: "/admin/users" },
        { label: "MOT Officer Profile" },
      ]}
    >
      <MotAdminProfile userId={userId} />
    </Layout>
  )
}
