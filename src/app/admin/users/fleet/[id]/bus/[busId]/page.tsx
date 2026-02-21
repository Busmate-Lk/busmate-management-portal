"use client"

import { useParams } from "next/navigation"
import { Layout } from "@/components/shared/layout"
import { BusDetails } from "@/components/admin/shared"

export default function BusDetailsPage() {
  const params = useParams()
  const fleetId = params.id as string
  const busId = params.busId as string

  return (
    <Layout
      activeItem="users"
      pageTitle="Bus Details"
      pageDescription="View and manage bus information"
      role="admin"
      breadcrumbs={[
        { label: "Users", href: "/admin/users" },
        { label: "Fleet Profile", href: `/admin/users/fleet/${fleetId}` },
        { label: "Bus Details" },
      ]}
    >
      <BusDetails busId={busId} fleetId={fleetId} />
    </Layout>
  )
}
