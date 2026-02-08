"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/admin/ui/button"
import { BarChart3, Cpu, HardDrive, Database, Wifi, RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"

// Custom Progress Bar Component
const ProgressBar = ({ value, className }: { value: number; className?: string }) => (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
        <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
    </div>
)

const resourceData = [
    {
        id: 1,
        name: "Web Server 01",
        cpu: { current: 45, trend: "up", peak24h: 78 },
        memory: { current: 68, trend: "stable", peak24h: 82 },
        disk: { current: 32, trend: "up", peak24h: 35 },
        network: { in: "45.2 MB/s", out: "12.8 MB/s" },
        status: "healthy",
    },
    {
        id: 2,
        name: "Web Server 02",
        cpu: { current: 23, trend: "down", peak24h: 65 },
        memory: { current: 54, trend: "stable", peak24h: 71 },
        disk: { current: 28, trend: "stable", peak24h: 30 },
        network: { in: "38.7 MB/s", out: "9.4 MB/s" },
        status: "healthy",
    },
    {
        id: 3,
        name: "Database Server",
        cpu: { current: 89, trend: "up", peak24h: 94 },
        memory: { current: 91, trend: "up", peak24h: 96 },
        disk: { current: 67, trend: "up", peak24h: 72 },
        network: { in: "156.3 MB/s", out: "89.7 MB/s" },
        status: "warning",
    },
    {
        id: 4,
        name: "Cache Server",
        cpu: { current: 12, trend: "stable", peak24h: 18 },
        memory: { current: 76, trend: "stable", peak24h: 83 },
        disk: { current: 15, trend: "stable", peak24h: 18 },
        network: { in: "23.1 MB/s", out: "15.6 MB/s" },
        status: "healthy",
    },
]

const systemOverview = {
    totalCpu: 42,
    totalMemory: 72,
    totalDisk: 36,
    totalNetwork: { in: "263.3 MB/s", out: "127.5 MB/s" },
    activeSessions: 1247,
    databaseConnections: 89,
}

export function ResourceUsage() {
    const [lastRefresh, setLastRefresh] = useState(new Date())

    const handleRefresh = () => {
        setLastRefresh(new Date())
    }

    const getUsageBadge = (usage: number) => {
        if (usage < 50) return "bg-green-100 text-green-800"
        if (usage < 80) return "bg-yellow-100 text-yellow-800"
        return "bg-red-100 text-red-800"
    }

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case "up":
                return <TrendingUp className="h-4 w-4 text-red-600" />
            case "down":
                return <TrendingDown className="h-4 w-4 text-green-600" />
            default:
                return <div className="h-4 w-4 bg-gray-400 rounded-full" />
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

    return (
        <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Resource Usage Dashboard</h2>
                    <p className="text-sm text-gray-600">Monitor CPU, memory, disk, and network usage across all servers</p>
                </div>
                <Button onClick={handleRefresh} variant="outline" size="sm" className="shadow-sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* System Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="shadow-md">
                    <CardContent className="p-4 bg-gradient-to-br from-blue-50 to-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <Cpu className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-semibold">CPU Usage</span>
                            </div>
                            <Badge className={getUsageBadge(systemOverview.totalCpu)}>
                                {systemOverview.totalCpu}%
                            </Badge>
                        </div>
                        <ProgressBar value={systemOverview.totalCpu} className="h-2" />
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardContent className="p-4 bg-gradient-to-br from-green-50 to-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <HardDrive className="h-5 w-5 text-green-600" />
                                <span className="text-sm font-semibold">Memory Usage</span>
                            </div>
                            <Badge className={getUsageBadge(systemOverview.totalMemory)}>
                                {systemOverview.totalMemory}%
                            </Badge>
                        </div>
                        <ProgressBar value={systemOverview.totalMemory} className="h-2" />
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardContent className="p-4 bg-gradient-to-br from-purple-50 to-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <Database className="h-5 w-5 text-purple-600" />
                                <span className="text-sm font-semibold">Disk Usage</span>
                            </div>
                            <Badge className={getUsageBadge(systemOverview.totalDisk)}>
                                {systemOverview.totalDisk}%
                            </Badge>
                        </div>
                        <ProgressBar value={systemOverview.totalDisk} className="h-2" />
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardContent className="p-4 bg-gradient-to-br from-orange-50 to-white">
                        <div className="flex items-center space-x-2 mb-2">
                            <Wifi className="h-5 w-5 text-orange-600" />
                            <span className="text-sm font-semibold">Network</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span>In:</span>
                                <span className="font-semibold">{systemOverview.totalNetwork.in}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span>Out:</span>
                                <span className="font-semibold">{systemOverview.totalNetwork.out}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-md">
                    <CardContent className="p-4 bg-gradient-to-br from-indigo-50 to-white">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{systemOverview.activeSessions.toLocaleString()}</p>
                            <p className="text-sm text-gray-600 font-medium">Active User Sessions</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardContent className="p-4 bg-gradient-to-br from-teal-50 to-white">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{systemOverview.databaseConnections}</p>
                            <p className="text-sm text-gray-600 font-medium">Database Connections</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Server Resource Details */}
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Server Resource Details</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {resourceData.map((server) => (
                            <div key={server.id} className="p-4 rounded-lg shadow-sm bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <h4 className="font-semibold text-gray-900">{server.name}</h4>
                                        <Badge className={getStatusBadge(server.status)}>
                                            {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">
                                        Network: {server.network.in} ↓ / {server.network.out} ↑
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* CPU */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Cpu className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm font-semibold">CPU</span>
                                                {getTrendIcon(server.cpu.trend)}
                                            </div>
                                            <span className="text-sm font-semibold">{server.cpu.current}%</span>
                                        </div>
                                        <ProgressBar value={server.cpu.current} className="h-2" />
                                        <p className="text-xs text-gray-500 font-medium">Peak 24h: {server.cpu.peak24h}%</p>
                                    </div>

                                    {/* Memory */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <HardDrive className="h-4 w-4 text-green-600" />
                                                <span className="text-sm font-semibold">Memory</span>
                                                {getTrendIcon(server.memory.trend)}
                                            </div>
                                            <span className="text-sm font-semibold">{server.memory.current}%</span>
                                        </div>
                                        <ProgressBar value={server.memory.current} className="h-2" />
                                        <p className="text-xs text-gray-500 font-medium">Peak 24h: {server.memory.peak24h}%</p>
                                    </div>

                                    {/* Disk */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Database className="h-4 w-4 text-purple-600" />
                                                <span className="text-sm font-semibold">Disk</span>
                                                {getTrendIcon(server.disk.trend)}
                                            </div>
                                            <span className="text-sm font-semibold">{server.disk.current}%</span>
                                        </div>
                                        <ProgressBar value={server.disk.current} className="h-2" />
                                        <p className="text-xs text-gray-500 font-medium">Peak 24h: {server.disk.peak24h}%</p>
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
