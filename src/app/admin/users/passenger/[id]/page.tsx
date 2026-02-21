"use client"

import { useParams } from "next/navigation"
import { Layout } from "@/components/shared/layout"
import { PassengerProfile } from "@/components/admin/profile"

export default function PassengerProfilePage() {
  const params = useParams()
  const userId = params.id as string

  return (
    <Layout
      activeItem="users"
      pageTitle="Passenger Profile"
      pageDescription="View and manage passenger account details"
      role="admin"
      breadcrumbs={[
        { label: "Users", href: "/admin/users" },
        { label: "Passenger Profile" },
      ]}
    >
      <PassengerProfile userId={userId} />
    </Layout>
  )
}
