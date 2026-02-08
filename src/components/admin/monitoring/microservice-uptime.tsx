"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/admin/ui/button"
import { Server, CheckCircle, AlertTriangle, XCircle, RefreshCw, Clock, Cpu, HardDrive } from "lucide-react"
import { useState } from "react"

const microservices = [
    {
        id: 1,
        name: "User Service",
        status: "running",
        uptime: "15d 4h 23m",
        version: "v2.1.4",
        instances: 3,
        cpu: "12%",
        memory: "2.1GB",
        lastRestart: "15 days ago",
        port: "3001",
        health: "healthy",
    },
    {
        id: 2,
        name: "Bus Service",
        status: "running",
        uptime: "8d 12h 45m",
        version: "v1.8.2",
        instances: 2,
        cpu: "8%",
        memory: "1.8GB",
        lastRestart: "8 days ago",
        port: "3002",
        health: "healthy",
    },
    {
        id: 3,
        name: "Payment Service",
        status: "warning",
        uptime: "2d 6h 12m",
        version: "v3.0.1",
        instances: 2,
        cpu: "45%",
        memory: "3.2GB",
        lastRestart: "2 days ago",
        port: "3003",
        health: "warning",
    },
    {
        id: 4,
        name: "Notification Service",
        status: "running",
        uptime: "22d 8h 56m",
        version: "v1.5.7",
        instances: 4,
        cpu: "6%",
        memory: "1.2GB",
        lastRestart: "22 days ago",
        port: "3004",
        health: "healthy",
    },
    {
        id: 5,
        name: "Location Service",
        status: "error",
        uptime: "0d 0h 0m",
        version: "v2.3.1",
        instances: 0,
        cpu: "0%",
        memory: "0GB",
        lastRestart: "5 minutes ago",
        port: "3005",
        health: "error",
    },
    {
        id: 6,
        name: "Analytics Service",
        status: "running",
        uptime: "11d 16h 33m",
        version: "v1.2.9",
        instances: 1,
        cpu: "18%",
        memory: "2.8GB",
        lastRestart: "11 days ago",
        port: "3006",
        health: "healthy",
    },
]

export function MicroserviceUptime() {
    const [lastRefresh, setLastRefresh] = useState(new Date())

    const handleRefresh = () => {
        setLastRefresh(new Date())
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "running":
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case "warning":
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />
            case "error":
                return <XCircle className="h-5 w-5 text-red-600" />
            default:
                return <Server className="h-5 w-5 text-gray-600" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "running":
                return "bg-green-100 text-green-800"
            case "warning":
                return "bg-yellow-100 text-yellow-800"
            case "error":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getCpuBadge = (cpu: string) => {
        const usage = parseInt(cpu)
        if (usage < 20) return "bg-green-100 text-green-800"
        if (usage < 50) return "bg-yellow-100 text-yellow-800"
        return "bg-red-100 text-red-800"
    }

    const runningCount = microservices.filter(service => service.status === "running").length
    const warningCount = microservices.filter(service => service.status === "warning").length
    const errorCount = microservices.filter(service => service.status === "error").length
    const totalInstances = microservices.reduce((sum, service) => sum + service.instances, 0)

    return (
        <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Microservice Uptime Dashboard</h2>
                    <p className="text-sm text-gray-600">Monitor the uptime and health of all microservices</p>
                </div>
                <Button onClick={handleRefresh} variant="outline" size="sm" className="shadow-sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="shadow-md">
                    <CardContent className="p-4 bg-gradient-to-br from-green-50 to-white">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{runningCount}</p>
                                <p className="text-sm text-gray-600 font-medium">Running Services</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardContent className="p-4 bg-gradient-to-br from-yellow-50 to-white">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{warningCount}</p>
                                <p className="text-sm text-gray-600 font-medium">Warning Services</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardContent className="p-4 bg-gradient-to-br from-red-50 to-white">
                        <div className="flex items-center space-x-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{errorCount}</p>
                                <p className="text-sm text-gray-600 font-medium">Failed Services</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardContent className="p-4 bg-gradient-to-br from-blue-50 to-white">
                        <div className="flex items-center space-x-2">
                            <Server className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{totalInstances}</p>
                                <p className="text-sm text-gray-600 font-medium">Total Instances</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Microservices List */}
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2">
                        <Server className="h-5 w-5" />
                        <span>Microservices Status</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {microservices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm bg-white">
                                <div className="flex items-center space-x-4">
                                    {getStatusIcon(service.status)}
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{service.name}</h4>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 font-medium">
                                            <span>{service.version}</span>
                                            <span>•</span>
                                            <span>Port {service.port}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-6">
                                    <div className="text-center">
                                        <Badge className={getStatusBadge(service.status)}>
                                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                        </Badge>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-gray-900">{service.uptime}</p>
                                        <p className="text-xs text-gray-600 font-medium">Uptime</p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-gray-900">{service.instances}</p>
                                        <p className="text-xs text-gray-600 font-medium">Instances</p>
                                    </div>

                                    <div className="text-center">
                                        <Badge className={getCpuBadge(service.cpu)}>
                                            <Cpu className="h-3 w-3 mr-1" />
                                            {service.cpu}
                                        </Badge>
                                    </div>

                                    <div className="text-center">
                                        <div className="flex items-center space-x-1">
                                            <HardDrive className="h-3 w-3 text-gray-500" />
                                            <span className="text-sm text-gray-900 font-medium">{service.memory}</span>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="flex items-center space-x-1 text-xs text-gray-500 font-medium">
                                            <Clock className="h-3 w-3" />
                                            <span>{service.lastRestart}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" className="shadow-sm">
                    <Server className="h-4 w-4 mr-2" />
                    Restart All Services
                </Button>
                <Button variant="outline" size="sm" className="shadow-sm">
                    Scale Services
                </Button>
            </div>

            {/* Last Updated */}
            <div className="text-center text-sm text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
        </div>
    )
}
