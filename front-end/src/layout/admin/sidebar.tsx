"use client"

import { useState } from "react"
import { Menu, X, Home, User, Stethoscope, CalendarDays, Timer, LogOut, ChevronRight } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AdminlogOut as adminLogOut } from "@/features/admin/adminSlice"
import { cn } from "@/lib/utils"

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(adminLogOut())
    navigate("/login")
  }

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/admin",
      active: location.pathname === "/admin",
    },
    {
      icon: User,
      label: "Users",
      href: "/admin/users",
      active: location.pathname === "/admin/users",
    },
    {
      icon: Stethoscope,
      label: "Doctors",
      href: "/admin/doctors",
      active: location.pathname === "/admin/doctors",
    },
    {
      icon: Timer,
      label: "Pending Verifications",
      href: "/admin/pending-verification",
      active: location.pathname === "/admin/pending-verification",
    },
    {
      icon: CalendarDays,
      label: "Appointments",
      href: "/admin/appoinments",
      active: location.pathname === "/admin/appoinments",
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar border border-sidebar-border shadow-lg hover:bg-sidebar-accent transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X size={20} className="text-sidebar-foreground" />
        ) : (
          <Menu size={20} className="text-sidebar-foreground" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-72 bg-sidebar border-r border-sidebar-border z-40 transform transition-all duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">CARESLOT</h1>
              <p className="text-xs text-sidebar-foreground/60 font-medium">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden",
                  item.active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                {/* Active indicator */}
                {item.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30 rounded-r-full" />}

                <Icon
                  size={20}
                  className={cn(
                    "transition-transform duration-200",
                    item.active ? "scale-110" : "group-hover:scale-105",
                  )}
                />
                <span className="font-medium text-sm flex-1">{item.label}</span>

                {/* Arrow indicator for active item */}
                {item.active && <ChevronRight size={16} className="opacity-60" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:scale-105 transition-transform duration-200" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
  