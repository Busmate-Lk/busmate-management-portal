"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw, Clock, Zap } from "lucide-react"
import { useState } from "react"

const apiEndpoints = [
    {
        id: 1,
        name: "User Authentication API",
        endpoint: "/api/v1/auth",
        status: "healthy",
        responseTime: "45ms",
        lastChecked: "2 mins ago",
        uptime: "99.98%",
        requests24h: "15,847",
    },
    {
        id: 2,
        name: "Bus Routes API",
        endpoint: "/api/v1/routes",
        status: "healthy",
        responseTime: "123ms",
        lastChecked: "1 min ago",
        uptime: "99.95%",
        requests24h: "28,593",
    },
    {
        id: 3,
        name: "Payment Processing API",
        endpoint: "/api/v1/payments",
        status: "warning",
        responseTime: "890ms",
        lastChecked: "3 mins ago",
        uptime: "99.12%",
        requests24h: "8,247",
    },
    {
        id: 4,
        name: "Notification Service API",
        endpoint: "/api/v1/notifications",
        status: "healthy",
        responseTime: "67ms",
        lastChecked: "1 min ago",
        uptime: "99.87%",
        requests24h: "12,094",
    },
    {
        id: 5,
        name: "Location Tracking API",
        endpoint: "/api/v1/tracking",
        status: "error",
        responseTime: "timeout",
        lastChecked: "5 mins ago",
        uptime: "97.84%",
        requests24h: "45,693",
    },
    {
        id: 6,
        name: "Analytics API",
        endpoint: "/api/v1/analytics",
        status: "healthy",
        responseTime: "234ms",
        lastChecked: "2 mins ago",
        uptime: "99.76%",
        requests24h: "6,432",
    },
]

export function ApiHealth() {
    const [lastRefresh, setLastRefresh] = useState(new Date())

    const handleRefresh = () => {
        setLastRefresh(new Date())
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "healthy":
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case "warning":
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />
            case "error":
                return <XCircle className="h-5 w-5 text-red-600" />
            default:
                return <Activity className="h-5 w-5 text-gray-600" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "healthy":
                return "bg-green-100 text-green-800"
            case "warning":
                return "bg-yellow-100 text-yellow-800"
            case "error":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getResponseTimeBadge = (responseTime: string) => {
        if (responseTime === "timeout") return "bg-red-100 text-red-800"
        const time = parseInt(responseTime)
        if (time < 100) return "bg-green-100 text-green-800"
        if (time < 500) return "bg-yellow-100 text-yellow-800"
        return "bg-red-100 text-red-800"
    }

    const healthyCount = apiEndpoints.filter(api => api.status === "healthy").length
    const warningCount = apiEndpoints.filter(api => api.status === "warning").length
    const errorCount = apiEndpoints.filter(api => api.status === "error").length

    return (
        <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">API Health Dashboard</h2>
                    <p className="text-sm text-gray-600">Monitor the health and performance of all API endpoints</p>
                </div>
                <Button onClick={handleRefresh} variant="outline" size="sm" className="shadow-sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="shadow-md">
                    <CardContent className="p-4 bg-linear-to-br from-green-50 to-white">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{healthyCount}</p>
                                <p className="text-sm text-gray-600 font-medium">Healthy APIs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardContent className="p-4 bg-linear-to-br from-yellow-50 to-white">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{warningCount}</p>
                                <p className="text-sm text-gray-600 font-medium">Warning APIs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardContent className="p-4 bg-linear-to-br from-red-50 to-white">
                        <div className="flex items-center space-x-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{errorCount}</p>
                                <p className="text-sm text-gray-600 font-medium">Failed APIs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardContent className="p-4 bg-linear-to-br from-blue-50 to-white">
                        <div className="flex items-center space-x-2">
                            <Activity className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{apiEndpoints.length}</p>
                                <p className="text-sm text-gray-600 font-medium">Total APIs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* API Endpoints List */}
            <Card className="shadow-lg">
                <CardHeader className="bg-linear-to-r from-gray-50 to-white rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2">
                        <Activity className="h-5 w-5" />
                        <span>API Endpoints Status</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {apiEndpoints.map((api) => (
                            <div key={api.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm bg-white">
                                <div className="flex items-center space-x-4">
                                    {getStatusIcon(api.status)}
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{api.name}</h4>
                                        <p className="text-sm text-gray-600 font-medium">{api.endpoint}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-6">
                                    <div className="text-center">
                                        <Badge className={getStatusBadge(api.status)}>
                                            {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
                                        </Badge>
                                    </div>

                                    <div className="text-center">
                                        <Badge className={getResponseTimeBadge(api.responseTime)}>
                                            <Zap className="h-3 w-3 mr-1" />
                                            {api.responseTime}
                                        </Badge>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-gray-900">{api.uptime}</p>
                                        <p className="text-xs text-gray-600 font-medium">Uptime</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-gray-900">{api.requests24h}</p>
                                        <p className="text-xs text-gray-600 font-medium">24h Requests</p>
                                    </div>

                                    <div className="text-center">
                                        <div className="flex items-center space-x-1 text-xs text-gray-500 font-medium">
                                            <Clock className="h-3 w-3" />
                                            <span>{api.lastChecked}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Last Updated */}
            <div className="text-center text-sm text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
        </div>
    )
}
