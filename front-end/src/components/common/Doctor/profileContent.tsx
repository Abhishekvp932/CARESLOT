"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Users, TrendingUp, Star, Phone, Video, MessageSquare, AlertCircle } from "lucide-react"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Dr. Johnson!</h1>
        <p className="text-blue-100">You have 8 appointments scheduled for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+2 from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+15 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground">Based on 324 reviews</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hours This Week</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground">6 hours remaining</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-muted-foreground">Routine Checkup</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">9:00 AM</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Confirmed
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>ED</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Emily Davis</p>
                  <p className="text-sm text-muted-foreground">Follow-up</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">10:30 AM</p>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  In Progress
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>MB</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Michael Brown</p>
                  <p className="text-sm text-muted-foreground">Consultation</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">2:00 PM</p>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Upcoming
                </Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Phone className="h-6 w-6" />
                <span className="text-sm">Call Patient</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Video className="h-6 w-6" />
                <span className="text-sm">Video Call</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Send Message</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Schedule</span>
              </Button>
            </div>

            {/* Recent Notifications */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Recent Notifications
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-2 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New appointment request</p>
                    <p className="text-xs text-muted-foreground">Sarah Wilson - 2 min ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment received</p>
                    <p className="text-xs text-muted-foreground">John Smith - 5 min ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Appointment rescheduled</p>
                    <p className="text-xs text-muted-foreground">Emily Davis - 10 min ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
