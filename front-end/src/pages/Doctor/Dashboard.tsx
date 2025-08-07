"use client"

import { DoctorSidebar } from "@/layout/doctor/sideBar"
// import { DashboardContent } from "@/components/common/Doctor/doctorDashboardContent" 
// import { DashboardContent as ProfileContent } from "@/components/common/Doctor/profileContent"
// import { ScheduleContent } from "@/components/common/Doctor/sheduleContent"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { Separator } from "@/components/ui/separator"
import { useState,useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState } from "@/app/store"

export default function DoctorDashboard() {
//   const [activeSection, setActiveSection] = useState("dashboard")
   const navigate = useNavigate();
      const admin = useSelector((state:RootState)=> state.admin.admin);
     const patient = useSelector((state:RootState)=> state.auth.user);
     const doctors = useSelector((state:RootState)=> state.doctor);
     const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (doctors?.role === "doctors") {
      setIsAuthorized(true);
    } else if (patient) {
      navigate("/");
    } else if (admin) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  }, [admin, patient, doctors, navigate]);

  if (!isAuthorized) return null; 

  

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />

            <h1 className="bold">Doctor Dashboard</h1>
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4"></div>
      </SidebarInset>
    </SidebarProvider>
  )
}
