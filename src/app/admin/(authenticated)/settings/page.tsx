import { Header } from "@/components/admin/shared"
import { SystemSettings } from "@/components/admin/settings"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-0">
      <Header title="System Settings" description="Configure system preferences, maintenance options, and backup settings" />
      <div className="p-6">
        <SystemSettings />
      </div>
    </div>
  )
}
