"use client"

import { useState } from "react"
import { Clock, User, Phone, Calendar, MoreVertical, Filter} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DoctorSidebar } from "@/layout/doctor/sideBar"
import { useGetAllAppoinmentsQuery } from "@/features/docotr/doctorApi"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
// Mock appointment data
// const appointments = [
//   {
//     id: 1,
//     patientName: "Sarah Johnson",
//     time: "09:00 AM",
//     duration: "30 min",
//     type: "Consultation",
//     status: "confirmed",
//     phone: "+1 (555) 123-4567",
//     reason: "Annual checkup and blood pressure monitoring",
//   },
//   {
//     id: 2,
//     patientName: "Michael Chen",
//     time: "09:30 AM",
//     duration: "45 min",
//     type: "Follow-up",
//     status: "confirmed",
//     phone: "+1 (555) 234-5678",
//     reason: "Diabetes management and medication review",
//   },
//   {
//     id: 3,
//     patientName: "Emily Rodriguez",
//     time: "10:15 AM",
//     duration: "30 min",
//     type: "Consultation",
//     status: "pending",
//     phone: "+1 (555) 345-6789",
//     reason: "Persistent headaches and vision concerns",
//   },
//   {
//     id: 4,
//     patientName: "David Thompson",
//     time: "11:00 AM",
//     duration: "60 min",
//     type: "Physical Exam",
//     status: "confirmed",
//     phone: "+1 (555) 456-7890",
//     reason: "Pre-employment physical examination",
//   },
//   {
//     id: 5,
//     patientName: "Lisa Wang",
//     time: "02:00 PM",
//     duration: "30 min",
//     type: "Follow-up",
//     status: "confirmed",
//     phone: "+1 (555) 567-8901",
//     reason: "Post-surgery recovery assessment",
//   },
//   {
//     id: 6,
//     patientName: "Robert Miller",
//     time: "02:30 PM",
//     duration: "45 min",
//     type: "Consultation",
//     status: "cancelled",
//     phone: "+1 (555) 678-9012",
//     reason: "Chest pain evaluation and EKG",
//   },
// ]

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function AppointmentsListDoctor() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
//   const [typeFilter, setTypeFilter] = useState<string>("all")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [sidebarOpen, setSidebarOpen] = useState(false)
const doctor = useSelector((state:RootState)=> state.doctor.doctor);
const doctorId = doctor?._id as string;
const {data = {}} = useGetAllAppoinmentsQuery(doctorId);
const appoinments = data || []
console.log('appoinment and patient data',data);



  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      
        <DoctorSidebar />
     

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {/* <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4 lg:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Appointments</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Today, {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header> */}

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    All Status
                  </Button>
                  <Button
                    variant={statusFilter === "confirmed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("confirmed")}
                  >
                    Confirmed
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={statusFilter === "cancelled" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("cancelled")}
                  >
                    Cancelled
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
              
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              { Array.isArray(appoinments) && appoinments.map((appointment) => (
                <Card key={appointment?._id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                            {appointment?.patientId?.profile_img ? (
                                <img
                                src={appointment.patientId.profile_img}
                                alt={appointment.patientId.name}
                                className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="h-5 w-5 text-primary" />
                            )}
                            </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground text-balance">{appointment?.patientId?.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {appointment?.patientId?.phone}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Cancel Appoinment</DropdownMenuItem>
                          <DropdownMenuItem>Reschedule</DropdownMenuItem>
                          <DropdownMenuItem>Cancel</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{appointment?.slot?.date}</span>
                        <span className="text-muted-foreground">({appointment?.slot?.startTime})</span>
                      </div>
                      <Badge className={getStatusColor(appointment?.status)}>{appointment?.status}</Badge>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Consultation</span>
                    </div>

                    {/* <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm text-muted-foreground text-pretty">
                        <span className="font-medium text-card-foreground">Reason: </span>
                        {appointment.reason}
                      </p>
                    </div> */}

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        Start Visit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Reschedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
{/* 
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )} */}
          </div>
        </main>
      </div>
    </div>
  )
}