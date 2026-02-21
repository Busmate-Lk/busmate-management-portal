"use client"

import { useParams } from "next/navigation"
import { Layout } from "@/components/shared/layout"
import { TimekeeperProfile } from "@/components/admin/profile"

export default function TimekeeperProfilePage() {
  const params = useParams()
  const userId = params.id as string

  return (
    <Layout
      activeItem="users"
      pageTitle="Timekeeper Profile"
      pageDescription="View and manage timekeeper account details"
      role="admin"
      breadcrumbs={[
        { label: "Users", href: "/admin/users" },
        { label: "Timekeeper Profile" },
      ]}
    >
      <TimekeeperProfile userId={userId} />
    </Layout>
  )
}
