"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Code, Search, Filter, Download, RefreshCw, AlertTriangle, Info, CheckCircle, XCircle, Calendar } from "lucide-react"
import { useState } from "react"

const applicationLogs = [
    {
        id: 1,
        timestamp: "2024-01-15 14:35:22",
        level: "ERROR",
        service: "Payment Service",
        message: "Database connection timeout in payment processing",
        details: "Connection to payment_db timed out after 30 seconds. Retry attempt 3/3 failed.",
        source: "PaymentController.java:142",
        thread: "payment-worker-3",
        requestId: "req-789abc",
        userId: "USR-12847",
    },
    {
        id: 2,
        timestamp: "2024-01-15 14:33:15",
        level: "WARN",
        service: "Bus Tracking Service",
        message: "GPS signal weak for bus LM-7832",
        details: "GPS accuracy below threshold (>50m). Last known location: 6.9271° N, 79.8612° E",
        source: "TrackingService.js:89",
        thread: "tracking-main",
        requestId: "req-456def",
        userId: null,
    },
    {
        id: 3,
        timestamp: "2024-01-15 14:31:08",
        level: "INFO",
        service: "User Service",
        message: "New user registration completed",
        details: "User USR-98765 successfully registered with email verification",
        source: "UserController.java:56",
        thread: "http-nio-8080-exec-5",
        requestId: "req-123ghi",
        userId: "USR-98765",
    },
    {
        id: 4,
        timestamp: "2024-01-15 14:29:44",
        level: "ERROR",
        service: "Notification Service",
        message: "Failed to send SMS notification",
        details: "SMS gateway returned error: Insufficient credits. Message not delivered to +94771234567",
        source: "SMSService.py:67",
        thread: "notification-worker-1",
        requestId: "req-321jkl",
        userId: "USR-55621",
    },
    {
        id: 5,
        timestamp: "2024-01-15 14:27:33",
        level: "DEBUG",
        service: "API Gateway",
        message: "Rate limit check passed",
        details: "User USR-77394 current rate: 45/100 requests per minute",
        source: "RateLimitFilter.java:34",
        thread: "gateway-main",
        requestId: "req-654mno",
        userId: "USR-77394",
    },
    {
        id: 6,
        timestamp: "2024-01-15 14:25:12",
        level: "WARN",
        service: "Route Service",
        message: "Route optimization took longer than expected",
        details: "Route calculation for BC-138 took 8.5 seconds (threshold: 5s)",
        source: "RouteOptimizer.cpp:203",
        thread: "route-calculator",
        requestId: "req-987pqr",
        userId: null,
    },
]

export function ApplicationLogs() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterLevel, setFilterLevel] = useState("all")
    const [filterService, setFilterService] = useState("all")
    const [lastRefresh, setLastRefresh] = useState(new Date())

    const handleRefresh = () => {
        setLastRefresh(new Date())
    }

    const getLevelBadge = (level: string) => {
        switch (level) {
            case "ERROR":
                return "bg-red-100 text-red-800"
            case "WARN":
                return "bg-yellow-100 text-yellow-800"
            case "INFO":
                return "bg-blue-100 text-blue-800"
            case "DEBUG":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getLevelIcon = (level: string) => {
        switch (level) {
            case "ERROR":
                return <XCircle className="h-4 w-4 text-red-600" />
            case "WARN":
                return <AlertTriangle className="h-4 w-4 text-yellow-600" />
            case "INFO":
                return <Info className="h-4 w-4 text-blue-600" />
            case "DEBUG":
                return <CheckCircle className="h-4 w-4 text-gray-600" />
            default:
                return <Code className="h-4 w-4 text-gray-600" />
        }
    }

    const getServiceBadge = (service: string) => {
        const color = {
            "Payment Service": "bg-green-100 text-green-800",
            "Bus Tracking Service": "bg-purple-100 text-purple-800",
            "User Service": "bg-blue-100 text-blue-800",
            "Notification Service": "bg-orange-100 text-orange-800",
            "API Gateway": "bg-indigo-100 text-indigo-800",
            "Route Service": "bg-pink-100 text-pink-800",
        }[service] || "bg-gray-100 text-gray-800"
        return color
    }

    const totalLogs = applicationLogs.length
    const errorLogs = applicationLogs.filter(log => log.level === "ERROR").length
    const warningLogs = applicationLogs.filter(log => log.level === "WARN").length
    const uniqueServices = new Set(applicationLogs.map(log => log.service)).size

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Application Logs</h2>
                    <p className="text-sm text-gray-600">Monitor application events, errors, and system messages</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleRefresh} variant="outline" size="sm" className="bg-blue-500/20 text-blue-600 border-blue-200 hover:bg-blue-500/30 shadow-md">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" className="bg-green-500/20 text-green-600 border-green-200 hover:bg-green-500/30 shadow-md">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Code className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
                                <p className="text-sm text-gray-600">Total Log Entries</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{errorLogs}</p>
                                <p className="text-sm text-gray-600">Error Logs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{warningLogs}</p>
                                <p className="text-sm text-gray-600">Warning Logs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{uniqueServices}</p>
                                <p className="text-sm text-gray-600">Active Services</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Input
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        </div>

                        <Select value={filterLevel} onValueChange={setFilterLevel}>
                            <SelectTrigger>
                                <SelectValue placeholder="Log Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="ERROR">Error</SelectItem>
                                <SelectItem value="WARN">Warning</SelectItem>
                                <SelectItem value="INFO">Info</SelectItem>
                                <SelectItem value="DEBUG">Debug</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterService} onValueChange={setFilterService}>
                            <SelectTrigger>
                                <SelectValue placeholder="Service" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Services</SelectItem>
                                <SelectItem value="Payment Service">Payment Service</SelectItem>
                                <SelectItem value="Bus Tracking Service">Bus Tracking Service</SelectItem>
                                <SelectItem value="User Service">User Service</SelectItem>
                                <SelectItem value="Notification Service">Notification Service</SelectItem>
                                <SelectItem value="API Gateway">API Gateway</SelectItem>
                                <SelectItem value="Route Service">Route Service</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button className="bg-blue-500/90 text-white border-blue-600 hover:bg-blue-600/90 shadow-md">
                            <Filter className="h-4 w-4 mr-2" />
                            Apply Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Application Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Code className="h-5 w-5" />
                        <span>Recent Application Events</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Request ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applicationLogs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm font-mono">{log.timestamp}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            {getLevelIcon(log.level)}
                                            <Badge className={getLevelBadge(log.level)}>
                                                {log.level}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getServiceBadge(log.service)}>
                                            {log.service}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900 mb-1">{log.message}</p>
                                            <p className="text-xs text-gray-500 max-w-md">{log.details}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm font-mono text-gray-600">{log.source}</p>
                                            <p className="text-xs text-gray-500">Thread: {log.thread}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm font-mono text-blue-600">{log.requestId}</p>
                                            {log.userId && (
                                                <p className="text-xs text-gray-500">User: {log.userId}</p>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Last Updated */}
            <div className="text-center text-sm text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
        </div>
    )
}
