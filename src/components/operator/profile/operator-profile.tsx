"use client"
import { ChangeEvent, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Edit, Save, Shield, Clock, Activity, Settings, Bus, Users, Route } from "lucide-react"
import { uploadImage } from "@/supabase/storage/clients"



export function OperatorProfile() {
  const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder.svg");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange =async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      // Replace 'avatars' with your Supabase bucket name, and 'profile' with your folder if needed
      const { imageUrl, error } = await uploadImage({ file, bucket: "profile-photos", folder: "profile_photo" });
      setUploading(false);
      if (imageUrl) {
        console.log("Avatar image URL:", imageUrl);
        setAvatarUrl(imageUrl);
      } else {
        alert(error || "Upload failed");
      }
    }
  };
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
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input id="fullname" defaultValue="Fleet" />
                </div>
            
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue="operator@busmate.lk" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+94 71 234 5678" />
                </div>
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="organizationName" defaultValue="City Bus Services Pvt Ltd" />
                </div>
                <div>
                  <Label htmlFor="operatorId">Operator ID</Label>
                  <Input id="operatorId" placeholder="this is auto genarated" defaultValue="OP-2024-001" />
                </div>
                
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registrationId">Business Registration</Label>
                  <Input id="registrationId" defaultValue="PV 12345678" />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input id="address" defaultValue="123 Main Street, Colombo 07, Sri Lanka" />
                </div>
                <div>
                  <Label htmlFor="district">Operating Area</Label>
                  <Input id="district" defaultValue="Colombo District" />
                </div>
               
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Route Updates</Label>
                  <p className="text-sm text-gray-600">Get notified about route changes and permits</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Bus Maintenance Alerts</Label>
                  <p className="text-sm text-gray-600">Receive maintenance reminders and schedules</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Staff Notifications</Label>
                  <p className="text-sm text-gray-600">Updates about driver schedules and assignments</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Revenue Reports</Label>
                  <p className="text-sm text-gray-600">Daily and monthly revenue summaries</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          
          <Card>
            <CardContent className="p-6 text-center">
              {uploading ? (
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                  <span className="text-blue-600 font-medium">Uploading...</span>
                </div>
              ) : (
                <>
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={avatarUrl} key={avatarUrl} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">FO</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-2">Fleet Operator</h3>
              <p className="text-gray-600 mb-4">City Bus Services Pvt Ltd</p>
              <div className="flex justify-center space-x-2 mb-4">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                {/* <Badge className="bg-orange-100 text-orange-800">Premium</Badge> */}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                ref={fileInputRef}
                className="mb-2"
                hidden
              />
              <Button
                variant="outline"
                className="w-full bg-blue-500/20 text-blue-600 border-blue-200 hover:bg-blue-500/30 shadow-md"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Avatar
              </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fleet Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bus className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Total Buses</span>
                </div>
                <span className="text-sm font-medium">25</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Route className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Active Routes</span>
                </div>
                <span className="text-sm font-medium">8</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Total Staff</span>
                </div>
                <span className="text-sm font-medium">52</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-600">Last Login</span>
                </div>
                <span className="text-sm font-medium">1 hour ago</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">On-Time Performance</span>
                </div>
                <span className="text-sm font-medium text-green-600">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Safety Rating</span>
                </div>
                <span className="text-sm font-medium text-blue-600">Excellent</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                </div>
                <span className="text-sm font-medium">&lt; 2 min</span>
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
                    <p className="text-sm font-medium">Added new bus to fleet</p>
                    <p className="text-xs text-gray-500">Today, 10:30 AM • Bus ID: CBS-025</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Updated driver schedule</p>
                    <p className="text-xs text-gray-500">Yesterday, 3:15 PM • Route 138</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Maintenance completed</p>
                    <p className="text-xs text-gray-500">Dec 20, 2024 • Bus CBS-012</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Route permit renewed</p>
                    <p className="text-xs text-gray-500">Dec 18, 2024 • Route 245</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-blue-500/20 text-blue-600 border-blue-200 hover:bg-blue-500/30 shadow-md">
                <Settings className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-green-500/20 text-green-600 border-green-200 hover:bg-green-500/30 shadow-md">
                <Bus className="h-4 w-4 mr-2" />
                Manage Fleet
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-purple-500/20 text-purple-600 border-purple-200 hover:bg-purple-500/30 shadow-md">
                <Users className="h-4 w-4 mr-2" />
                Staff Management
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-orange-500/20 text-orange-600 border-orange-200 hover:bg-orange-500/30 shadow-md">
                <Route className="h-4 w-4 mr-2" />
                Route Permits
              </Button>
            </CardContent>
          </Card> */}

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
