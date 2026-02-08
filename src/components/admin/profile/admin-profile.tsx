import { Button } from "@/components/admin/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Edit, Save, Shield, Clock, Activity, Settings } from "lucide-react"
import Link from "next/link"

export function AdminProfile() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Admin" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="User" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue="admin@busmate.lk" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+94 77 123 4567" />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" defaultValue="System Administration" />
                </div>
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input id="employeeId" defaultValue="ADM-2024-001" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive security alerts via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Login Alerts</Label>
                  <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Logged in from new device</p>
                    <p className="text-xs text-gray-500">Today, 9:15 AM • Chrome on Windows</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Updated system settings</p>
                    <p className="text-xs text-gray-500">Yesterday, 4:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Generated monthly report</p>
                    <p className="text-xs text-gray-500">Dec 15, 2024 • 2:45 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl">AU</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-2">Admin User</h3>
              <p className="text-gray-600 mb-4">System Administrator</p>
              <div className="flex justify-center space-x-2 mb-4">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
              </div>
              <Button variant="outline" className="w-full bg-blue-500/20 text-blue-600 border-blue-200 hover:bg-blue-500/30 shadow-md">
                Change Avatar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Last Login</span>
                </div>
                <span className="text-sm font-medium">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Sessions Today</span>
                </div>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Security Score</span>
                </div>
                <span className="text-sm font-medium text-green-600">Excellent</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-blue-500/20 text-blue-600 border-blue-200 hover:bg-blue-500/30 shadow-md">
                <Settings className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-purple-500/20 text-purple-600 border-purple-200 hover:bg-purple-500/30 shadow-md">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-green-500/20 text-green-600 border-green-200 hover:bg-green-500/30 shadow-md">
                <Activity className="h-4 w-4 mr-2" />
                View Login History
              </Button>
            </CardContent>
          </Card>

          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1 bg-gray-500/20 text-gray-600 border-gray-200 hover:bg-gray-500/30 shadow-md">
              Cancel
            </Button>
            <Button className="flex-1 bg-blue-500/90 text-white hover:bg-blue-600 shadow-md">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
