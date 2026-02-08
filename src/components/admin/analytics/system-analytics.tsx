"use client"

import { useState } from "react"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Download,
  FileText,
  Activity,
  Database,
  Zap,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Eye,
  RefreshCw,
} from "lucide-react"

const logs = [
  {
    timestamp: "2024-12-19 14:32:15",
    level: "ERROR",
    message: "Payment gateway timeout (User: user_1247)",
    color: "text-red-500",
  },
  {
    timestamp: "2024-12-19 14:31:58",
    level: "WARN",
    message: "High server load detected (CPU: 85%)",
    color: "text-yellow-500",
  },
  {
    timestamp: "2024-12-19 14:31:42",
    level: "INFO",
    message: "User login successful (IP: 192.168.1.100)",
    color: "text-green-500",
  },
  {
    timestamp: "2024-12-19 14:31:25",
    level: "INFO",
    message: "Booking created successfully (Booking ID: BK_2024_5847)",
    color: "text-green-500",
  },
  {
    timestamp: "2024-12-19 14:31:08",
    level: "ERROR",
    message: "Database connection failed (Retry attempt 2)",
    color: "text-red-500",
  },
  {
    timestamp: "2024-12-19 14:30:55",
    level: "INFO",
    message: "Route data synchronized",
    color: "text-green-500",
  },
]

const reports = [
  {
    id: 1,
    name: "Daily User Activity Report",
    type: "User Analytics",
    lastGenerated: "2024-01-15 09:30",
    status: "Completed",
    size: "2.4 MB",
    format: "PDF",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    name: "System Performance Weekly",
    type: "Performance",
    lastGenerated: "2024-01-14 18:45",
    status: "Completed",
    size: "1.8 MB",
    format: "Excel",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 3,
    name: "Revenue Analysis Monthly",
    type: "Financial",
    lastGenerated: "2024-01-13 14:20",
    status: "Processing",
    size: "3.2 MB",
    format: "PDF",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
]

const analyticsData = [
  { metric: "Total Users", value: "25,694", change: "+12.5%", changeType: "positive" },
  { metric: "Active Sessions", value: "1,247", change: "+8.3%", changeType: "positive" },
  { metric: "Daily Transactions", value: "8,456", change: "-2.1%", changeType: "negative" },
  { metric: "System Uptime", value: "99.9%", change: "+0.1%", changeType: "positive" },
  { metric: "Revenue Today", value: "Rs 2.4M", change: "+15.7%", changeType: "positive" },
  { metric: "Error Rate", value: "0.02%", change: "-0.01%", changeType: "positive" },
]

export function SystemAnalytics() {
  const [activeTab, setActiveTab] = useState("monitoring")
  const [logFilter, setLogFilter] = useState("all")

  return (
    <div>
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setActiveTab("monitoring")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "monitoring" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Activity className="h-4 w-4" />
              <span>System Monitoring</span>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "reports" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <FileText className="h-4 w-4" />
              <span>Analytics & Reports</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "monitoring" && (
            <>
              {/* System Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card className="shadow-sm bg-gradient-to-br from-green-50 to-white">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Database className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">Database Status</p>
                    <p className="text-xl font-bold text-green-600">Online</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-white">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">API Response</p>
                    <p className="text-xl font-bold">142ms</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm bg-gradient-to-br from-yellow-50 to-white">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Activity className="h-6 w-6 text-yellow-600" />
                    </div>
                    <p className="text-sm text-gray-600">Server Load</p>
                    <p className="text-xl font-bold text-yellow-600">67%</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm bg-gradient-to-br from-purple-50 to-white">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600">Active Sessions</p>
                    <p className="text-xl font-bold">1,247</p>
                  </CardContent>
                </Card>

                <Card className="shadow-sm bg-gradient-to-br from-green-50 to-white">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">System Uptime</p>
                    <p className="text-xl font-bold text-green-600">99.9%</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Advanced Filters */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Advanced Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <div className="relative">
                          <Input placeholder="Select date range" />
                          <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="error" />
                            <label htmlFor="error" className="text-sm">
                              Error
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="warning" />
                            <label htmlFor="warning" className="text-sm">
                              Warning
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="info" />
                            <label htmlFor="info" className="text-sm">
                              Info
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                        <Input placeholder="Search logs..." />
                      </div>

                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Filters</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Real-time Logs */}
                <div className="lg:col-span-3">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">Real-time Logs</CardTitle>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setLogFilter("errors")}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${logFilter === "errors" ? "bg-red-100 text-red-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                          >
                            Errors Only
                          </button>
                          <button
                            onClick={() => setLogFilter("security")}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${logFilter === "security" ? "bg-yellow-100 text-yellow-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                          >
                            Security Events
                          </button>
                          <button
                            onClick={() => setLogFilter("today")}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${logFilter === "today" ? "bg-blue-100 text-blue-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                          >
                            Today's Logs
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto shadow-inner">
                        {logs.map((log, index) => (
                          <div key={index} className="mb-1">
                            <span className="text-gray-400">[{log.timestamp}]</span>{" "}
                            <span className={log.color}>{log.level}:</span>{" "}
                            <span className="text-gray-300">{log.message}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <Button className="bg-green-600 hover:bg-green-700 shadow-sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export CSV
                        </Button>
                        <Button variant="outline" className="shadow-sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Export TXT
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {activeTab === "reports" && (
            <>
              {/* Analytics Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {analyticsData.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">{item.metric}</p>
                        <p className="text-xl font-bold mb-1">{item.value}</p>
                        <p className={`text-xs ${item.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                          {item.change}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Report Filters */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Report Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Reports</SelectItem>
                            <SelectItem value="user">User Analytics</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm">Apply Filters</Button>
                    </div>

                    {/* Quick Report Generation */}
                    <div className="mt-6 pt-6">
                      <h4 className="font-medium mb-3 text-gray-900">Quick Reports</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start shadow-sm hover:bg-gray-50">
                          <Users className="h-4 w-4 mr-2" />
                          User Activity
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start shadow-sm hover:bg-gray-50">
                          <Activity className="h-4 w-4 mr-2" />
                          System Performance
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start shadow-sm hover:bg-gray-50">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Revenue Analysis
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start shadow-sm hover:bg-gray-50">
                          <PieChart className="h-4 w-4 mr-2" />
                          Route Efficiency
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reports List */}
                <div className="lg:col-span-3">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Generated Reports</CardTitle>
                          <p className="text-sm text-gray-600">View and download previously generated reports</p>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Report Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Last Generated</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reports.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">{report.name}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  {report.type}
                                </Badge>
                              </TableCell>
                              <TableCell>{report.lastGenerated}</TableCell>
                              <TableCell>
                                <Badge className={report.statusColor}>{report.status}</Badge>
                              </TableCell>
                              <TableCell>{report.size}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 text-blue-600" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <RefreshCw className="h-4 w-4 text-orange-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Chart Visualization Area */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Data Visualization</CardTitle>
                      <p className="text-sm text-gray-600">Interactive charts and graphs</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                          <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                          <h4 className="font-medium mb-2">User Growth Trends</h4>
                          <p className="text-sm text-gray-600">Monthly user registration and activity patterns</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                          <PieChart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                          <h4 className="font-medium mb-2">Revenue Distribution</h4>
                          <p className="text-sm text-gray-600">Revenue breakdown by routes and services</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
