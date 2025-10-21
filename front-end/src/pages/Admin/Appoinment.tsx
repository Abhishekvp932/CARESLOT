"use client"

import { useEffect, useState } from "react"
import { AppointmentCard } from "@/components/common/admin/appoinment_card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

import { useGetAllAdminAppoinmentsQuery } from "@/features/admin/adminApi"


export function AppointmentHistory() {

  

  const [searchTerm, setSearchTerm] = useState("")
  // const [page, setPage] = useState(1);
  // const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all")
  // const limit = 10;
 
const {data = {}} = useGetAllAdminAppoinmentsQuery({status:statusFilter});
  console.log(data);

  const appointments = data || []
  // useEffect(()=>{
  //   const handler = setTimeout(()=>{
  //     setDebouncedSearch(searchTerm);
  //   },5000)

  //   return ()=> clearTimeout(handler);
  // },[searchTerm]);


  const handleReschedule = (id: string) => {
    console.log("Reschedule appointment:", id)
    // Add reschedule logic here
  }

  const handleCancel = (id: string) => {
    console.log("Cancel appointment:", id)
    // Add cancel logic here
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Appointment History</h1>
        <p className="text-muted-foreground">View and manage your past and upcoming medical appointments</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments, doctors, or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div> */}

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
          <Button
            variant={statusFilter === "cancelled" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("cancelled")}
          >
            Cancelled
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
