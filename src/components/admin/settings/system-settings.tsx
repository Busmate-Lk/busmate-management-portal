"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Download,
  Settings,
  Database,
  HardDrive,
  Shield,
  RefreshCw,
  Play,
  AlertTriangle,
  CheckCircle,
  Upload,
  Wrench,
  Server,
  Zap,
  Users,
} from "lucide-react"

const backupHistory = [
  {
    id: 1,
    type: "Full System Backup",
    date: "2024-01-15 02:00",
    size: "2.4 GB",
    status: "Completed",
    duration: "45 min",
    location: "AWS S3 Bucket",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    type: "Database Backup",
    date: "2024-01-14 02:00",
    size: "890 MB",
    status: "Completed",
    duration: "12 min",
    location: "Local Storage",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: 3,
    type: "Configuration Backup",
    date: "2024-01-13 02:00",
    size: "45 MB",
    status: "Failed",
    duration: "0 min",
    location: "AWS S3 Bucket",
    statusColor: "bg-red-100 text-red-800",
  },
]

export function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)
  const [encryptBackups, setEncryptBackups] = useState(true)

  return (
    <div>
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg px-6 py-4 bg-linear-to-r from-gray-50 to-white mb-6">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "general" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <Settings className="h-4 w-4" />
            <span>General Settings</span>
          </button>
          <button
            onClick={() => setActiveTab("maintenance")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "maintenance" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <Wrench className="h-4 w-4" />
            <span>Maintenance</span>
          </button>
          <button
            onClick={() => setActiveTab("backup")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === "backup" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <Database className="h-4 w-4" />
            <span>Backup & Recovery</span>
          </button>
        </div>
      </div>

      {activeTab === "general" && (
        <Card className="shadow-sm">
          <CardContent className="p-6">
            {/* System Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="systemName">System Name</Label>
                  <Input id="systemName" defaultValue="BUSMATE LK Production" />
                </div>
                <div>
                  <Label htmlFor="timeZone">Time Zone</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Asia/Colombo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia/colombo">Asia/Colombo</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input id="sessionTimeout" type="number" defaultValue="60" />
                </div>
                <div>
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input id="passwordExpiry" type="number" defaultValue="90" />
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor" className="text-base font-medium">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                  </div>
                  <Switch id="twoFactor" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="loginAttempts" className="text-base font-medium">
                      Lock Account After Failed Attempts
                    </Label>
                    <p className="text-sm text-gray-600">Lock accounts after 5 failed login attempts</p>
                  </div>
                  <Switch id="loginAttempts" defaultChecked />
                </div>
              </div>
            </div>

            {/* API Configuration */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="rateLimitPerHour">Rate Limit (requests/hour)</Label>
                  <Input id="rateLimitPerHour" type="number" defaultValue="1000" />
                </div>
                <div>
                  <Label htmlFor="apiTimeout">API Timeout (seconds)</Label>
                  <Input id="apiTimeout" type="number" defaultValue="30" />
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="apiLogging" className="text-base font-medium">
                      API Request Logging
                    </Label>
                    <p className="text-sm text-gray-600">Log all API requests for monitoring</p>
                  </div>
                  <Switch id="apiLogging" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="corsEnabled" className="text-base font-medium">
                      CORS Protection
                    </Label>
                    <p className="text-sm text-gray-600">Enable Cross-Origin Resource Sharing protection</p>
                  </div>
                  <Switch id="corsEnabled" defaultChecked />
                </div>
              </div>
            </div>

            {/* Data Retention */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Data Retention</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="logRetention">System Log Retention (days)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="30 days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="userActivityRetention">User Activity Retention (days)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="90 days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Performance Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Performance Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="cacheExpiry">Cache Expiry (minutes)</Label>
                  <Input id="cacheExpiry" type="number" defaultValue="15" />
                </div>
                <div>
                  <Label htmlFor="maxConnections">Max Database Connections</Label>
                  <Input id="maxConnections" type="number" defaultValue="100" />
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compressionEnabled" className="text-base font-medium">
                      Response Compression
                    </Label>
                    <p className="text-sm text-gray-600">Enable GZIP compression for API responses</p>
                  </div>
                  <Switch id="compressionEnabled" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cachingEnabled" className="text-base font-medium">
                      Aggressive Caching
                    </Label>
                    <p className="text-sm text-gray-600">Enable aggressive caching for better performance</p>
                  </div>
                  <Switch id="cachingEnabled" defaultChecked />
                </div>
              </div>
            </div>

            {/* Global Notifications */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Global Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-base font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600">Send system alerts via email</p>
                  </div>
                  <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsAlerts" className="text-base font-medium">
                      SMS Alerts
                    </Label>
                    <p className="text-sm text-gray-600">Send critical alerts via SMS</p>
                  </div>
                  <Switch id="smsAlerts" checked={smsAlerts} onCheckedChange={setSmsAlerts} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" className="bg-gray-500/20 text-gray-600 border-gray-200 hover:bg-gray-500/30 shadow-md">Cancel</Button>
              <Button className="bg-blue-500/90 hover:bg-blue-600 text-white shadow-md">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "maintenance" && (
        <div className="space-y-6">
          {/* System Status */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 text-green-600 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700">System Health</p>
                      <p className="text-lg font-semibold text-green-900">Operational</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700">Active Sessions</p>
                      <p className="text-lg font-semibold text-blue-900">342</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-700">Uptime</p>
                      <p className="text-lg font-semibold text-purple-900">99.9%</p>
                    </div>
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Maintenance Windows */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Maintenance Windows</CardTitle>
                <p className="text-sm text-gray-600">Configure scheduled maintenance periods</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <div className="relative">
                      <Input id="startTime" defaultValue="02:00" />
                      <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <div className="relative">
                      <Input id="endTime" defaultValue="04:00" />
                      <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="maintenanceFreq">Maintenance Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Weekly" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoMaintenance" className="text-base font-medium">
                      Automatic Maintenance
                    </Label>
                    <p className="text-sm text-gray-600">Enable scheduled maintenance tasks</p>
                  </div>
                  <Switch id="autoMaintenance" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifyMaintenance" className="text-base font-medium">
                      Notify Users
                    </Label>
                    <p className="text-sm text-gray-600">Send notifications before maintenance</p>
                  </div>
                  <Switch id="notifyMaintenance" defaultChecked />
                </div>

                <Button className="w-full bg-blue-500/90 hover:bg-blue-600 text-white shadow-md">
                  Save Maintenance Settings
                </Button>
              </CardContent>
            </Card>

            {/* System Maintenance Actions */}
            <Card>
              <CardHeader>
                <CardTitle>System Maintenance Actions</CardTitle>
                <p className="text-sm text-gray-600">Perform system maintenance tasks</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-blue-500/20 text-blue-600 border-blue-200 hover:bg-blue-500/30 shadow-md">
                    <Database className="h-4 w-4 mr-2" />
                    Database Optimization
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-green-500/20 text-green-600 border-green-200 hover:bg-green-500/30 shadow-md">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Clear System Cache
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-purple-500/20 text-purple-600 border-purple-200 hover:bg-purple-500/30 shadow-md">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restart Services
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-gray-500/20 text-gray-600 border-gray-200 hover:bg-gray-500/30 shadow-md">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Scan
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Emergency Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-orange-500/20 text-orange-600 border-orange-200 hover:bg-orange-500/30 shadow-md">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Enable Maintenance Mode
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-red-500/20 text-red-600 border-red-200 hover:bg-red-500/30 shadow-md">
                      <Zap className="h-4 w-4 mr-2" />
                      Emergency Shutdown
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maintenance History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Maintenance Activities</CardTitle>
              <p className="text-sm text-gray-600">History of maintenance tasks and their status</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Database Optimization</TableCell>
                    <TableCell>2024-01-15 02:15</TableCell>
                    <TableCell>12 min</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </TableCell>
                    <TableCell>Optimized 15 tables, reclaimed 2.3GB</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">System Cache Clear</TableCell>
                    <TableCell>2024-01-14 02:00</TableCell>
                    <TableCell>3 min</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </TableCell>
                    <TableCell>Cleared 890MB cache data</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Security Scan</TableCell>
                    <TableCell>2024-01-13 03:30</TableCell>
                    <TableCell>25 min</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                    </TableCell>
                    <TableCell>2 minor vulnerabilities found</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "backup" && (
        <>
          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Backup</p>
                    <p className="font-semibold">2 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Backup Size</p>
                    <p className="font-semibold">2.4 GB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <HardDrive className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Storage Used</p>
                    <p className="font-semibold">45.2 GB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Shield className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Retention</p>
                    <p className="font-semibold">30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Backup Configuration */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Backup Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Auto Backup */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoBackup" className="text-base font-medium">
                        Automatic Backup
                      </Label>
                      <p className="text-sm text-gray-600">Enable scheduled backups</p>
                    </div>
                    <Switch id="autoBackup" checked={autoBackup} onCheckedChange={setAutoBackup} />
                  </div>

                  {/* Backup Frequency */}
                  <div>
                    <Label htmlFor="frequency">Backup Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Daily" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Backup Time */}
                  <div>
                    <Label htmlFor="backupTime">Backup Time</Label>
                    <div className="relative">
                      <Input id="backupTime" defaultValue="02:00" />
                      <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Encryption */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="encryption" className="text-base font-medium">
                        Encrypt Backups
                      </Label>
                      <p className="text-sm text-gray-600">Enable backup encryption</p>
                    </div>
                    <Switch id="encryption" checked={encryptBackups} onCheckedChange={setEncryptBackups} />
                  </div>

                  <Button className="w-full bg-blue-500/90 hover:bg-blue-600 text-white shadow-md">
                    <Settings className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6 shadow-sm">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-blue-500/20 text-blue-600 border-blue-200 hover:bg-blue-500/30 shadow-md">
                    <Database className="h-4 w-4 mr-2" />
                    Database Backup
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-gray-500/20 text-gray-600 border-gray-200 hover:bg-gray-500/30 shadow-md">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Full System Backup
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-purple-500/20 text-purple-600 border-purple-200 hover:bg-purple-500/30 shadow-md">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuration Backup
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-orange-500/20 text-orange-600 border-orange-200 hover:bg-orange-500/30 shadow-md">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore from Backup
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Backup History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Backup History</CardTitle>
                      <p className="text-sm text-gray-600">Recent backup operations and their status</p>
                    </div>
                    <Button className="bg-blue-500/90 hover:bg-blue-600 text-white shadow-md">
                      <Play className="h-4 w-4 mr-2" />
                      Start Backup
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backupHistory.map((backup) => (
                        <TableRow key={backup.id}>
                          <TableCell className="font-medium">{backup.type}</TableCell>
                          <TableCell>{backup.date}</TableCell>
                          <TableCell>{backup.size}</TableCell>
                          <TableCell>{backup.duration}</TableCell>
                          <TableCell>
                            <Badge className={backup.statusColor}>{backup.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Upload className="h-4 w-4 text-green-600" />
                              </Button>
                              {backup.status === "Failed" && (
                                <Button variant="ghost" size="sm">
                                  <RefreshCw className="h-4 w-4 text-orange-600" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Recovery Options */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                    Recovery Options
                  </CardTitle>
                  <p className="text-sm text-gray-600">System recovery and disaster management</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Point-in-Time Recovery</h4>
                      <p className="text-sm text-blue-700 mb-3">Restore system to a specific date and time</p>
                      <Button size="sm" variant="outline" className="bg-blue-500/20 text-blue-600 border-blue-200 hover:bg-blue-500/30 shadow-md">
                        Configure Recovery Point
                      </Button>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Disaster Recovery</h4>
                      <p className="text-sm text-green-700 mb-3">Full system recovery procedures</p>
                      <Button size="sm" variant="outline" className="bg-green-500/20 text-green-600 border-green-200 hover:bg-green-500/30 shadow-md">
                        View Recovery Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
