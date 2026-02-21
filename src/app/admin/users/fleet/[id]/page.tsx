"use client"

import { useParams } from "next/navigation"
import { Layout } from "@/components/shared/layout"
import { FleetProfile } from "@/components/admin/profile"

export default function FleetProfilePage() {
  const params = useParams()
  const fleetId = params.id as string

  return (
    <Layout
      activeItem="users"
      pageTitle="Fleet Operator Profile"
      pageDescription="View and manage fleet operator account details"
      role="admin"
      breadcrumbs={[
        { label: "Users", href: "/admin/users" },
        { label: "Fleet Operator Profile" },
      ]}
    >
      <FleetProfile fleetId={fleetId} />
    </Layout>
  )
}
