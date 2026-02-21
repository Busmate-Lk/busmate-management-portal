"use client"

import { useParams } from "next/navigation"
import { Layout } from "@/components/shared/layout"
import { ConductorProfile } from "@/components/admin/profile"

export default function ConductorProfilePage() {
  const params = useParams()
  const userId = params.id as string

  return (
    <Layout
      activeItem="users"
      pageTitle="Conductor Profile"
      pageDescription="View and manage conductor account details"
      role="admin"
      breadcrumbs={[
        { label: "Users", href: "/admin/users" },
        { label: "Conductor Profile" },
      ]}
    >
      <ConductorProfile userId={userId} />
    </Layout>
  )
}
