"use client"

import { useState } from "react"
import { AppointmentCard } from "@/components/common/admin/appoinment_card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

import { useGetAllAdminAppoinmentsQuery } from "@/features/admin/adminApi"
// Sample appointment data
// const sampleAppointments = [
//   {
//     id: "1",
//     title: "Annual Physical Checkup",
//     date: "March 15, 2024",
//     time: "10:00 AM",
//     location: "Main Medical Center, Room 205",
//     doctor: "Sarah Johnson",
//     status: "completed" as const,
//     type: "General Medicine",
//   },
//   {
//     id: "2",
//     title: "Dental Cleaning",
//     date: "March 22, 2024",
//     time: "2:30 PM",
//     location: "Dental Care Clinic, Suite 3B",
//     doctor: "Michael Chen",
//     status: "upcoming" as const,
//     type: "Dentistry",
//   },
//   {
//     id: "3",
//     title: "Eye Examination",
//     date: "March 8, 2024",
//     time: "11:15 AM",
//     location: "Vision Center, Floor 2",
//     doctor: "Emily Rodriguez",
//     status: "completed" as const,
//     type: "Ophthalmology",
//   },
//   {
//     id: "4",
//     title: "Cardiology Consultation",
//     date: "February 28, 2024",
//     time: "9:00 AM",
//     location: "Heart Institute, Room 401",
//     doctor: "David Kim",
//     status: "cancelled" as const,
//     type: "Cardiology",
//   },
//   {
//     id: "5",
//     title: "Physical Therapy Session",
//     date: "March 25, 2024",
//     time: "3:00 PM",
//     location: "Rehabilitation Center, Gym A",
//     doctor: "Lisa Thompson",
//     status: "upcoming" as const,
//     type: "Physical Therapy",
//   },
//   {
//     id: "6",
//     title: "Dermatology Screening",
//     date: "March 5, 2024",
//     time: "1:45 PM",
//     location: "Skin Care Center, Room 102",
//     doctor: "Robert Wilson",
//     status: "rescheduled" as const,
//     type: "Dermatology",
//   },
// ]

export function AppointmentHistory() {

  const {data = {}} = useGetAllAdminAppoinmentsQuery();
  console.log(data);
  const appointments = data || []
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")



  const handleReschedule = (id: string) => {
    console.log("Reschedule appointment:", id)
    // Add reschedule logic here
  }

  const handleCancel = (id: string) => {
    console.log("Cancel appointment:", id)
    // Add cancel logic here
  }

  // const statusCounts = appointments.reduce(
  //   (acc, appointment) => {
  //     acc[appointment.status] = (acc[appointment.status] || 0) + 1
  //     return acc
  //   },
  //   {} as Record<string, number>,
  // )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Appointment History</h1>
        <p className="text-muted-foreground">View and manage your past and upcoming medical appointments</p>
      </div>

      {/* Stats */}
      {/* <div className="flex flex-wrap gap-4">
        <Badge variant="outline" className="px-3 py-1">
          Total: {appointments.length}
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          Upcoming: {statusCounts.upcoming || 0}
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          Completed: {statusCounts.completed || 0}
        </Badge>
      </div> */}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments, doctors, or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            <Filter className="h-4 w-4 mr-2" />
            All
          </Button>
          <Button
            variant={statusFilter === "upcoming" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("upcoming")}
          >
            Upcoming
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("completed")}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Appointment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        { Array.isArray(appointments) &&appointments.map((appointment) => (
          <AppointmentCard
            key={appointment?.id}
            appointment={appointment}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
          />
        ))}
      </div>

      {/* {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No appointments found</p>
          <p className="text-muted-foreground text-sm mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )} */}
    </div>
  )
}
