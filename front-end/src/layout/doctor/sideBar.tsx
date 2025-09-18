import { useState } from "react";
import {
  Calendar,
  Clock,
  Home,
  Settings,
  User,
  Users,
  FileText,
  Bell,
  LogOut,
  Stethoscope,
  Menu,
  X,
  Mail,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/store";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "@/features/docotr/doctorSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LiveNotifications from "@/components/common/LiveNotification";
import NotificationComponent from "@/components/common/notifications";
// import { useLogOutMutation } from "@/features/auth/authApi"
const navItems = [
  { title: "Dashboard", url: "/doctor", icon: Home },
  { title: "Profile", url: "/doctor/profile", icon: User },
  { title: "Schedule & Timing", url: "/doctor/time-shedule", icon: Clock },
  { title: "Patients", url: "#patients", icon: Users },
  { title: "Appointments", url: "/doctor/appoinment", icon: Calendar },
  { title: "Medical Records", url: "#records", icon: FileText },
  { title: "Messages", url: "/doctor/chat", icon: Mail,},
  { title: "Settings", url: "#settings", icon: Settings },
];

export function DoctorSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const [showNotification, setNotification] = useState(false);
  // const [Logout] = useLogOutMutation();
  const handleLogout = async () => {
    dispatch(logOut());
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 z-40
        ${open ? "w-64" : "w-0 overflow-hidden"}`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Avatar className="h-10 w-10">
            <AvatarImage src={doctor?.profile_img} alt={doctor?.name} />
            <AvatarFallback>{doctor?.name?.charAt(0) || "D"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{doctor?.name}</p>
            <p className="text-xs text-gray-500 truncate">
              {doctor?.qualifications?.specialization}
            </p>
          </div>
          <span className="bg-green-100 text-green-700 px-2 py-0.5 text-xs rounded-full">
            Online
          </span>
{/* Notification Button */}
<button
  className="relative p-2 rounded-full hover:bg-gray-100"
  onClick={() => setNotification(!showNotification)}
>
  <span className="text-xl">🔔</span>
</button>

<LiveNotifications userId={doctor?._id} />

{/* Notification Dropdown in top-right */}
{showNotification && (
  <div className="fixed top-14 right-6 w-96 bg-white border rounded-lg shadow-lg z-50">
    <NotificationComponent patientId={doctor?._id} />
  </div>
)}

        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            {navItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.url}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.title}</span>
                  {/* {item.badge && (
                    <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )} */}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer / Account */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={doctor?.profile_img} alt={doctor?.name} />
              <AvatarFallback>{doctor?.name?.charAt(0) || "D"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{doctor?.name}</p>
              <p className="text-xs text-gray-500 truncate">{doctor?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          open ? "ml-64" : "ml-0"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
