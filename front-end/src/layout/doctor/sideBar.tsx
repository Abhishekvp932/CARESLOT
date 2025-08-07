

import type React from "react"

import { Calendar, Clock, Home, Settings, User, Users, FileText, Bell, LogOut, Stethoscope } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import { Link } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/doctor",
      icon: Home,
      isActive: true,
    },
    {
      title: "Profile",
      url: "/doctor/profile",
      icon: User,
    },
    {
      title: "Schedule & Timing",
      url: "/doctor/time-shedule",
      icon: Clock,
    },
    {
      title: "Consultations",
      url: "#consultations",
      icon: Stethoscope,
    },
    {
      title: "Patients",
      url: "#patients",
      icon: Users,
    },
    {
      title: "Appointments",
      url: "#appointments",
      icon: Calendar,
    },
    {
      title: "Medical Records",
      url: "#records",
      icon: FileText,
    },
    {
      title: "Notifications",
      url: "#notifications",
      icon: Bell,
      badge: "3",
    },
    {
      title: "Settings",
      url: "#settings",
      icon: Settings,
    },
  ],
}
import { logOut } from "@/features/docotr/doctorSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
export function DoctorSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
     const navigate = useNavigate()
    const doctor = useSelector((state:RootState)=> state.doctor.doctor);
    const dispatch = useDispatch()
    const handleLogout = ()=>{
        dispatch(logOut());
        navigate('/login');
    }
  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={doctor?.profile_img} alt="Dr. Sarah Johnson" />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{doctor?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{doctor?.qualifications?.specialization}</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
            Online
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto bg-red-100 text-red-800 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src={doctor?.profile_img} alt="Dr. Sarah Johnson" />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{doctor?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{doctor?.email}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4"/>
              <button  onClick={handleLogout}>sign out</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
