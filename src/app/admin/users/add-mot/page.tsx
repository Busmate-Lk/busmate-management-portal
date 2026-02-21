"use client"

import { useSetPageMetadata } from "@/context/PageMetadata"
import { AddMotForm } from "@/components/admin/users"

export default function AddMotPage() {
  // Set page metadata with breadcrumbs
  useSetPageMetadata({
    title: "Add MOT User",
    description: "Create a new MOT officer account",
    activeItem: "users",
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: "Users", href: "/admin/users" },
      { label: "Add MOT User" },
    ]
  })

  return <AddMotForm />
}
