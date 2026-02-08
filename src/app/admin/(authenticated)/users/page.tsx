import { Header } from "@/components/admin/shared"
import { UserStats, UserFilters, UserTable } from "@/components/admin/users"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  return (
    <div className="p-0">
      {/* <Header title="User Management" description="Manage users, permissions, and account settings across the platform" /> */}
      <div className="p-6">
        <UserStats />

        {/* Add User Button */}
        <div className="flex justify-end mb-6 mt-4">
          <Button asChild className="bg-blue-500/90 text-white hover:bg-blue-600 shadow-md mt-4">
            <Link href="/admin/users/add-mot">
              <Plus className="h-4 w-4 mr-2" />
              Add MoT User
            </Link>
          </Button>
        </div>

        <UserFilters />
        <UserTable />
      </div>
    </div>
  )
}
