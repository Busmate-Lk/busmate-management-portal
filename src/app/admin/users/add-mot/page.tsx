"use client"

import { Layout } from "@/components/shared/layout"
import { AddMotForm } from "@/components/admin/users"

export default function AddMotPage() {
  return (
    <Layout
      activeItem="users"
      pageTitle="Add MOT User"
      pageDescription="Create a new MOT officer account"
      role="admin"
      breadcrumbs={[
        { label: "Users", href: "/admin/users" },
        { label: "Add MOT User" },
      ]}
    >
      <AddMotForm />
    </Layout>
  )
}
