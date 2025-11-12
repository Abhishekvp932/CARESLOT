import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Home,
  User,
  FileText,
  LogOut,
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
import { useGetUserNotificationQuery } from "@/features/users/userApi";

const navItems = [
  { title: "Dashboard", url: "/doctor", icon: Home },
  { title: "Profile", url: "/doctor/profile", icon: User },
  { title: "Schedule & Timing", url: "/doctor/time-shedule", icon: Clock },

  { title: "Appointments", url: "/doctor/appoinment", icon: Calendar },
  { title: "Wallet", url: "/doctor/wallet", icon: FileText },
  { title: "Messages", url: "/doctor/chat", icon: Mail },
];

export function DoctorSidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const patientId = doctor?._id as string;

  const { data = [] } = useGetUserNotificationQuery(
    { patientId },
    {
      skip: !patientId,
    }
  );

  const unreadCount = Array.isArray(data)
    ? data.filter((n) => !n.isRead).length
    : 0;

  useEffect(() => {
    if (!doctor) {
      navigate("/login");
    }
  }, [doctor]);

  const [showNotification, setNotification] = useState(false);

  const handleLogout = async () => {
    dispatch(logOut());
    navigate("/login");
  };

  return (
    <div className="flex">
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 z-40
        ${open ? "w-64" : "w-0 overflow-hidden"}`}
      >
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

          <button
            className="relative p-2 rounded-full hover:bg-gray-100"
            onClick={() => setNotification(!showNotification)}
          >
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <LiveNotifications userId={doctor?._id} />

          {showNotification && (
            <div className="fixed top-14 right-6 w-96 bg-white border rounded-lg shadow-lg z-50">
              <NotificationComponent patientId={doctor?._id} />
            </div>
          )}
        </div>

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
                </Link>
              </li>
            ))}
          </ul>
        </nav>

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

      <div
        className={`flex-1 transition-all duration-300 ${
          open ? "ml-64" : "ml-0"
        }`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
