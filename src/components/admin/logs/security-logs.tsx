"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Search, Filter, Download, RefreshCw, AlertTriangle, XCircle, Eye, Lock, Calendar, MapPin } from "lucide-react"
import { useState } from "react"

const securityLogs = [
    {
        id: 1,
        timestamp: "2024-01-15 14:38:45",
        severity: "HIGH",
        event: "Multiple Failed Login Attempts",
        details: "5 consecutive failed login attempts from IP 45.123.67.89 for user admin@busmate.lk",
        ipAddress: "45.123.67.89",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
        location: "Unknown (VPN)",
        action: "Account Temporarily Locked",
        riskScore: 85,
        userId: "ADM-00123",
    },
    {
        id: 2,
        timestamp: "2024-01-15 14:35:22",
        severity: "MEDIUM",
        event: "Unusual Login Location",
        details: "User logged in from unusual location: Previous login from Colombo, current from New York",
        ipAddress: "198.51.100.42",
        userAgent: "BusMate Mobile App v2.1.4 (iOS)",
        location: "New York, USA",
        action: "2FA Required",
        riskScore: 65,
        userId: "USR-55621",
    },
    {
        id: 3,
        timestamp: "2024-01-15 14:32:18",
        severity: "LOW",
        event: "Password Change",
        details: "User successfully changed password after security notification",
        ipAddress: "192.168.1.105",
        userAgent: "Chrome/120.0.0.0 (Windows)",
        location: "Colombo, Sri Lanka",
        action: "Password Updated",
        riskScore: 15,
        userId: "USR-98432",
    },
    {
        id: 4,
        timestamp: "2024-01-15 14:29:33",
        severity: "CRITICAL",
        event: "SQL Injection Attempt",
        details: "Malicious SQL injection detected in route search parameter: ' OR '1'='1' --",
        ipAddress: "203.0.113.15",
        userAgent: "curl/7.68.0",
        location: "Unknown",
        action: "Request Blocked",
        riskScore: 95,
        userId: null,
    },
    {
        id: 5,
        timestamp: "2024-01-15 14:26:07",
        severity: "MEDIUM",
        event: "Admin Access",
        details: "Administrative user accessed sensitive user data export function",
        ipAddress: "10.0.0.1",
        userAgent: "Chrome/120.0.0.0 (Windows)",
        location: "Colombo Office",
        action: "Access Logged",
        riskScore: 45,
        userId: "ADM-00123",
    },
    {
        id: 6,
        timestamp: "2024-01-15 14:23:55",
        severity: "HIGH",
        event: "API Rate Limit Exceeded",
        details: "API key exceeded rate limit: 1000 requests in 1 minute (limit: 100/min)",
        ipAddress: "172.16.254.1",
        userAgent: "API Client v1.0",
        location: "Automated Script",
        action: "API Key Suspended",
        riskScore: 75,
        userId: "API-KEY-789",
    },
]

export function SecurityLogs() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterSeverity, setFilterSeverity] = useState("all")
    const [filterEvent, setFilterEvent] = useState("all")
    const [lastRefresh, setLastRefresh] = useState(new Date())

    const handleRefresh = () => {
        setLastRefresh(new Date())
    }

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "CRITICAL":
                return "bg-red-500 text-white animate-pulse"
            case "HIGH":
                return "bg-red-100 text-red-800"
            case "MEDIUM":
                return "bg-yellow-100 text-yellow-800"
            case "LOW":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case "CRITICAL":
                return <XCircle className="h-4 w-4 text-red-600" />
            case "HIGH":
                return <AlertTriangle className="h-4 w-4 text-red-600" />
            case "MEDIUM":
                return <Eye className="h-4 w-4 text-yellow-600" />
            case "LOW":
                return <Lock className="h-4 w-4 text-green-600" />
            default:
                return <Shield className="h-4 w-4 text-gray-600" />
        }
    }

    const getRiskScoreColor = (score: number) => {
        if (score >= 80) return "text-red-600 font-bold"
        if (score >= 60) return "text-orange-600 font-semibold"
        if (score >= 40) return "text-yellow-600"
        return "text-green-600"
    }

    const totalSecurityEvents = securityLogs.length
    const criticalEvents = securityLogs.filter(log => log.severity === "CRITICAL").length
    const highRiskEvents = securityLogs.filter(log => log.riskScore >= 70).length
    const blockedAttempts = securityLogs.filter(log => log.action.includes("Blocked") || log.action.includes("Locked")).length

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Security Logs</h2>
                    <p className="text-sm text-gray-600">Monitor security events, threats, and access control violations</p>
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
                            <Shield className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{totalSecurityEvents}</p>
                                <p className="text-sm text-gray-600">Security Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{criticalEvents}</p>
                                <p className="text-sm text-gray-600">Critical Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{highRiskEvents}</p>
                                <p className="text-sm text-gray-600">High Risk Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Lock className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{blockedAttempts}</p>
                                <p className="text-sm text-gray-600">Blocked Attempts</p>
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
                                placeholder="Search security logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        </div>

                        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                            <SelectTrigger>
                                <SelectValue placeholder="Severity Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Severities</SelectItem>
                                <SelectItem value="CRITICAL">Critical</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="LOW">Low</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterEvent} onValueChange={setFilterEvent}>
                            <SelectTrigger>
                                <SelectValue placeholder="Event Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                <SelectItem value="Login">Login Events</SelectItem>
                                <SelectItem value="Access">Access Control</SelectItem>
                                <SelectItem value="Attack">Attack Attempts</SelectItem>
                                <SelectItem value="Admin">Admin Actions</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button className="bg-blue-500/90 text-white border-blue-600 hover:bg-blue-600/90 shadow-md">
                            <Filter className="h-4 w-4 mr-2" />
                            Apply Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Security Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>Recent Security Events</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Risk Score</TableHead>
                                <TableHead>Action Taken</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {securityLogs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm font-mono">{log.timestamp}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            {getSeverityIcon(log.severity)}
                                            <Badge className={getSeverityBadge(log.severity)}>
                                                {log.severity}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium text-gray-900">{log.event}</p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-600 max-w-md">{log.details}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm font-mono text-gray-600">{log.ipAddress}</p>
                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                <MapPin className="h-3 w-3" />
                                                <span>{log.location}</span>
                                            </div>
                                            {log.userId && (
                                                <p className="text-xs text-gray-500">User: {log.userId}</p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-center">
                                            <span className={`text-lg font-bold ${getRiskScoreColor(log.riskScore)}`}>
                                                {log.riskScore}
                                            </span>
                                            <p className="text-xs text-gray-500">/ 100</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-xs">
                                            {log.action}
                                        </Badge>
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
