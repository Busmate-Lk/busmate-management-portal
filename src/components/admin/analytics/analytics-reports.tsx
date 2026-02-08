"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Download,
  Activity,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  ArrowLeft,
  Eye,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

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
  {
    id: 4,
    name: "Route Efficiency Report",
    type: "Operations",
    lastGenerated: "2024-01-12 11:15",
    status: "Failed",
    size: "0 MB",
    format: "PDF",
    statusColor: "bg-red-100 text-red-800",
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

export function AnalyticsReports() {
  const [reportType, setReportType] = useState("all")
  const [dateRange, setDateRange] = useState("week")

  return (
    <div className="space-y-6">
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
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Report Filters</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
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
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Date Range</label>
              <div className="space-y-2">
                <div className="relative">
                  <Input placeholder="Start date" />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                <div className="relative">
                  <Input placeholder="End date" />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Filters</Button>
          </div>

          {/* Quick Report Generation */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Quick Reports</h4>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                User Activity
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                System Performance
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Revenue Analysis
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <PieChart className="h-4 w-4 mr-2" />
                Route Efficiency
              </Button>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <p className="text-sm text-gray-600">View and download previously generated reports</p>
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
                    <TableHead>Format</TableHead>
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
                      <TableCell>{report.format}</TableCell>
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
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Performance Metrics</h4>
                  <p className="text-sm text-gray-600">System performance and uptime statistics</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Activity className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Real-time Analytics</h4>
                  <p className="text-sm text-gray-600">Live system monitoring and alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
