"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Download,
  Upload,
  Database,
  HardDrive,
  Clock,
  Shield,
  RefreshCw,
  Play,
  Settings,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

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
  {
    id: 4,
    type: "Full System Backup",
    date: "2024-01-12 02:00",
    size: "2.3 GB",
    status: "Completed",
    duration: "42 min",
    location: "AWS S3 Bucket",
    statusColor: "bg-green-100 text-green-800",
  },
]

export function BackupRecovery() {
  const [autoBackup, setAutoBackup] = useState(true)
  const [encryptBackups, setEncryptBackups] = useState(true)
  const [retentionDays, setRetentionDays] = useState("30")
  const [backupFrequency, setBackupFrequency] = useState("daily")

  return (
    <div className="space-y-6">
      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
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

        <Card>
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

        <Card>
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

        <Card>
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
          <Card>
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
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
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

              {/* Retention Period */}
              <div>
                <Label htmlFor="retention">Retention Period (days)</Label>
                <Input
                  id="retention"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                  type="number"
                />
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

              {/* Storage Location */}
              <div>
                <Label htmlFor="storage">Storage Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select storage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="aws">AWS S3 Bucket</SelectItem>
                    <SelectItem value="google">Google Cloud Storage</SelectItem>
                    <SelectItem value="azure">Azure Blob Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-blue-500/90 hover:bg-blue-600 text-white shadow-md">
                <Settings className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
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
              <CardTitle>Backup History</CardTitle>
              <p className="text-sm text-gray-600">Recent backup operations and their status</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Location</TableHead>
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
                      <TableCell>{backup.location}</TableCell>
                      <TableCell>
                        <Badge className={backup.statusColor}>{backup.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 shadow-md">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="bg-green-500/20 text-green-600 hover:bg-green-500/30 shadow-md">
                            <Upload className="h-4 w-4" />
                          </Button>
                          {backup.status === "Failed" && (
                            <Button variant="ghost" size="sm" className="bg-orange-500/20 text-orange-600 hover:bg-orange-500/30 shadow-md">
                              <RefreshCw className="h-4 w-4" />
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
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Selective Restore</h4>
                  <p className="text-sm text-yellow-700 mb-3">Restore specific components or data</p>
                  <Button size="sm" variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-200 hover:bg-yellow-500/30 shadow-md">
                    Select Components
                  </Button>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Test Recovery</h4>
                  <p className="text-sm text-purple-700 mb-3">Test backup integrity and recovery process</p>
                  <Button size="sm" variant="outline" className="bg-purple-500/20 text-purple-600 border-purple-200 hover:bg-purple-500/30 shadow-md">
                    Run Test Recovery
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
