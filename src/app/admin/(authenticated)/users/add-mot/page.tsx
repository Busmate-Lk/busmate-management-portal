import { Header, NavigationBreadcrumb } from "@/components/admin/shared"
import { AddMotForm } from "@/components/admin/users"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddMotUserPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "User Management", href: "/admin/users" },
    { label: "Add MoT User" },
  ]

  return (
    <div className="p-0">
      <Header title="Add MoT User" description="Create a new Ministry of Transport user account and assign permissions" />
      <div className="p-6">
        <AddMotForm />
      </div>
    </div>
  )
}
