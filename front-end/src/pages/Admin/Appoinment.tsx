"use client"

import {useEffect, useState } from "react"
import { AppointmentCard } from "@/components/common/admin/appoinment_card"

import { Button } from "@/components/ui/button"


import { useGetAllAdminAppoinmentsQuery } from "@/features/admin/adminApi"
import { ChevronLeft, ChevronRight } from "lucide-react"



export function AppointmentHistory() {

 const [page,setPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const limit = 10;
 
const {data = {}} = useGetAllAdminAppoinmentsQuery({status:statusFilter,page,limit});
  console.log(data);

  const appointments = data.data || []
  const totalPages = Number(data?.totalPages ?? 1);
  const totalItems = Number(data?.totalItem ?? 0);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const handlePrev = () => canPrev && setPage((p) => p - 1);
  const handleNext = () => canNext && setPage((p) => p + 1);


  useEffect(() => {
    setPage(1);
  }, [statusFilter]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Appointment History</h1>
        <p className="text-muted-foreground">View and manage your past and upcoming medical appointments</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
       

        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            {/* <Filter className="h-4 w-4 mr-2" /> */}
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
          />
        ))}
      </div>

     {totalPages > 1 && (
  <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-6 gap-4">
    {/* Left side text */}
    <div className="text-sm text-muted-foreground">
      Page {page} of {totalPages}
      {totalItems ? ` • ${totalItems} total` : null}
      {totalPages - page > 0
        ? ` • ${totalPages - page} page${totalPages - page > 1 ? "s" : ""} left`
        : ""}
    </div>

    {/* Right side buttons */}
    <div className="flex items-center gap-2">
      {/* Prev button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={!canPrev}
        className="bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Numbered buttons */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={page === p ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(p)}
            className={page === p ? "" : "bg-transparent"}
          >
            {p}
          </Button>
        ))}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={!canNext}
        className="bg-transparent"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
)}

    </div>
  )
}
