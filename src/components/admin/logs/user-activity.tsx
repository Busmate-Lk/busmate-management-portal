"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, Search, Filter, Download, RefreshCw, Calendar, MapPin, Smartphone } from "lucide-react"
import { useState } from "react"

const userActivityLogs = [
    {
        id: 1,
        timestamp: "2024-01-15 14:32:45",
        userId: "USR-12847",
        userName: "John Doe",
        userType: "Passenger",
        action: "Login",
        details: "Successful login via mobile app",
        ipAddress: "192.168.1.105",
        device: "iPhone 14 Pro",
        location: "Colombo, Sri Lanka",
        status: "success",
    },
    {
        id: 2,
        timestamp: "2024-01-15 14:30:12",
        userId: "USR-98432",
        userName: "Sarah Wilson",
        userType: "Conductor",
        action: "Route Update",
        details: "Updated bus route BC-138 schedule",
        ipAddress: "10.0.1.23",
        device: "Android Tablet",
        location: "Kandy, Sri Lanka",
        status: "success",
    },
    {
        id: 3,
        timestamp: "2024-01-15 14:28:33",
        userId: "USR-55621",
        userName: "Mike Chen",
        userType: "Passenger",
        action: "Payment Failed",
        details: "Credit card payment declined for ticket booking",
        ipAddress: "203.94.15.78",
        device: "Chrome Browser",
        location: "Galle, Sri Lanka",
        status: "error",
    },
    {
        id: 4,
        timestamp: "2024-01-15 14:25:17",
        userId: "ADM-00123",
        userName: "Admin User",
        userType: "Administrator",
        action: "User Management",
        details: "Created new conductor account",
        ipAddress: "10.0.0.1",
        device: "Windows PC",
        location: "Colombo Office",
        status: "success",
    },
    {
        id: 5,
        timestamp: "2024-01-15 14:22:05",
        userId: "USR-77394",
        userName: "Emma Davis",
        userType: "Passenger",
        action: "Ticket Booking",
        details: "Booked ticket for Route BC-245",
        ipAddress: "172.16.0.45",
        device: "Samsung Galaxy",
        location: "Negombo, Sri Lanka",
        status: "success",
    },
    {
        id: 6,
        timestamp: "2024-01-15 14:20:18",
        userId: "USR-34521",
        userName: "David Brown",
        userType: "Fleet Manager",
        action: "Bus Assignment",
        details: "Assigned bus LM-7832 to Route BC-301",
        ipAddress: "192.168.10.12",
        device: "iPad Pro",
        location: "Matara Depot",
        status: "success",
    },
]

export function UserActivityLogs() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterUserType, setFilterUserType] = useState("all")
    const [filterAction, setFilterAction] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [lastRefresh, setLastRefresh] = useState(new Date())

    const handleRefresh = () => {
        setLastRefresh(new Date())
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "success":
                return "bg-green-100 text-green-800"
            case "error":
                return "bg-red-100 text-red-800"
            case "warning":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getUserTypeBadge = (userType: string) => {
        switch (userType) {
            case "Administrator":
                return "bg-purple-100 text-purple-800"
            case "Conductor":
                return "bg-blue-100 text-blue-800"
            case "Fleet Manager":
                return "bg-orange-100 text-orange-800"
            case "Passenger":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const totalLogs = userActivityLogs.length
    const successfulActions = userActivityLogs.filter(log => log.status === "success").length
    const failedActions = userActivityLogs.filter(log => log.status === "error").length
    const uniqueUsers = new Set(userActivityLogs.map(log => log.userId)).size

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">User Activity Logs</h2>
                    <p className="text-sm text-gray-600">Track and monitor all user actions across the platform</p>
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
                            <User className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
                                <p className="text-sm text-gray-600">Total Activities</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-5 w-5 bg-green-500 rounded-full" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{successfulActions}</p>
                                <p className="text-sm text-gray-600">Successful Actions</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-5 w-5 bg-red-500 rounded-full" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{failedActions}</p>
                                <p className="text-sm text-gray-600">Failed Actions</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{uniqueUsers}</p>
                                <p className="text-sm text-gray-600">Unique Users</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="relative">
                            <Input
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        </div>

                        <Select value={filterUserType} onValueChange={setFilterUserType}>
                            <SelectTrigger>
                                <SelectValue placeholder="User Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All User Types</SelectItem>
                                <SelectItem value="Administrator">Administrator</SelectItem>
                                <SelectItem value="Conductor">Conductor</SelectItem>
                                <SelectItem value="Fleet Manager">Fleet Manager</SelectItem>
                                <SelectItem value="Passenger">Passenger</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterAction} onValueChange={setFilterAction}>
                            <SelectTrigger>
                                <SelectValue placeholder="Action Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="Login">Login</SelectItem>
                                <SelectItem value="Logout">Logout</SelectItem>
                                <SelectItem value="Payment">Payment</SelectItem>
                                <SelectItem value="Booking">Booking</SelectItem>
                                <SelectItem value="Update">Update</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button className="bg-blue-500/90 hover:bg-blue-600 text-white shadow-md">
                            <Filter className="h-4 w-4 mr-2" />
                            Apply Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Activity Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Recent User Activities</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Device/Location</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userActivityLogs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm font-mono">{log.timestamp}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{log.userName}</p>
                                            <div className="flex items-center space-x-2">
                                                <Badge className={getUserTypeBadge(log.userType)}>
                                                    {log.userType}
                                                </Badge>
                                                <span className="text-xs text-gray-500">{log.userId}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium text-gray-900">{log.action}</span>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-600 max-w-xs truncate">{log.details}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                <Smartphone className="h-3 w-3" />
                                                <span>{log.device}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                <MapPin className="h-3 w-3" />
                                                <span>{log.location}</span>
                                            </div>
                                            <div className="text-xs text-gray-400">{log.ipAddress}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusBadge(log.status)}>
                                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
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
