"use client"

import { Header } from "@/components/admin/shared"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname, useRouter } from "next/navigation"
import { Activity, Server, BarChart3 } from "lucide-react"

export default function MonitoringLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()

    const activeTab = pathname.includes('/api-health') ? 'api-health' :
        pathname.includes('/microservice-uptime') ? 'microservice-uptime' :
            'resource-usage'

    const handleTabChange = (value: string) => {
        router.push(`/admin/monitoring/${value}`)
    }

    return (
        <div className="p-0">
            <Header title="System Monitoring" description="Track API health, microservice uptime, and system resource usage" />

            <div className="p-6">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <div className="bg-white rounded-lg shadow-lg px-6 py-4 bg-linear-to-r from-gray-50 to-white mb-6">
                        <div className="flex items-center space-x-8">
                            <button
                                onClick={() => handleTabChange("api-health")}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "api-health" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <Activity className="h-4 w-4" />
                                <span>API Health</span>
                            </button>
                            <button
                                onClick={() => handleTabChange("microservice-uptime")}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "microservice-uptime" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <Server className="h-4 w-4" />
                                <span>Microservice Uptime</span>
                            </button>
                            <button
                                onClick={() => handleTabChange("resource-usage")}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "resource-usage" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <BarChart3 className="h-4 w-4" />
                                <span>Resource Usage</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        {children}
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
