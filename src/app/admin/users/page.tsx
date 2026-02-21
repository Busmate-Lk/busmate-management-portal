"use client"

import { Layout } from "@/components/shared/layout"
import { UserStats, UserFilters, UserTable } from "@/components/admin/users"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  return (
    <Layout
      activeItem="users"
      pageTitle="User Management"
      pageDescription="Manage users, permissions, and account settings across the platform"
      role="admin"
    >
      <div className="space-y-6">
        <UserStats />

        {/* Add User Button */}
        <div className="flex justify-end">
          <Button asChild className="bg-blue-500/90 text-white hover:bg-blue-600 shadow-md">
            <Link href="/admin/users/add-mot">
              <Plus className="h-4 w-4 mr-2" />
              Add MoT User
            </Link>
          </Button>
        </div>

        <UserFilters />
        <UserTable />
      </div>
    </Layout>
  )
}
