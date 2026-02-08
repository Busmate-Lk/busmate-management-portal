"use client"

import { Header } from "@/components/admin/shared"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname, useRouter } from "next/navigation"
import { User, Code, Shield } from "lucide-react"

export default function LogsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()

    const activeTab = pathname.includes('/user-activity') ? 'user-activity' :
        pathname.includes('/application') ? 'application' :
            'security'

    const handleTabChange = (value: string) => {
        router.push(`/admin/logs/${value}`)
    }

    return (
        <div className="p-0">
            <Header title="System Logs" description="Monitor user activity, application events, and security incidents" />

            <div className="p-6">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <div className="bg-white rounded-lg shadow-lg px-6 py-4 bg-gradient-to-r from-gray-50 to-white mb-6">
                        <div className="flex items-center space-x-8">
                            <button
                                onClick={() => handleTabChange("user-activity")}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "user-activity" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <User className="h-4 w-4" />
                                <span>User Activity Logs</span>
                            </button>
                            <button
                                onClick={() => handleTabChange("application")}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "application" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <Code className="h-4 w-4" />
                                <span>Application Logs</span>
                            </button>
                            <button
                                onClick={() => handleTabChange("security")}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "security" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <Shield className="h-4 w-4" />
                                <span>Security Logs</span>
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
