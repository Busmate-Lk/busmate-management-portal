import { Header } from "@/components/admin/shared"
import { AnalyticsReports } from "@/components/admin/analytics"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Plus } from "lucide-react"
import Link from "next/link"

export default function AnalyticsReportsPage() {
  return (
    <div className="p-6">
      <Header title="Analytics & Reports" />
      <AnalyticsReports />
    </div>
  )
}
