import { Header } from "@/components/admin/shared"
import { AdminProfile } from "@/components/admin/profile"
import { Button } from "@/components/ui/button"
import { Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="p-0">
      <Header title="Admin Profile" description="Manage your admin account settings, preferences, and security options" />
      <div className="p-6">
        <AdminProfile />
      </div>
    </div>
  )
}
