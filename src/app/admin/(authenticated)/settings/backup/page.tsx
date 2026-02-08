import { Header } from "@/components/admin/shared"
import { BackupRecovery } from "@/components/admin/settings/backup-recovery"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Play } from "lucide-react"
import Link from "next/link"

export default function BackupRecoveryPage() {
  return (
    <div className="p-0">
      <Header title="Settings" description="Manage system backups, recovery options, and data protection policies" />
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/dashboard/settings">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Settings
              </Link>
            </Button>
            <Button variant="outline" className="bg-blue-500/20 text-blue-600 border-blue-200 hover:bg-blue-500/30 shadow-md">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
            <Button className="bg-blue-500/90 hover:bg-blue-600 text-white shadow-md">
              <Play className="h-4 w-4 mr-2" />
              Start Backup
            </Button>
          </div>
          <h1 className="text-2xl font-bold">Backup & Recovery</h1>
          <p className="text-gray-600">Manage system backups and recovery options</p>
        </div>
        <BackupRecovery />
      </div>
    </div>
  )
}
