"use client";

import type React from "react";

import type { RootState } from "@/app/store";
import { Sidebar } from "./sidebar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const admin = useSelector((state: RootState) => state.admin);
  const user = useSelector((state: RootState) => state.auth.user);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (admin?.role === "admin") {
      setIsAuthorized(true);
    } else if (user) {
      navigate("/");
    } else if (doctor) {
      navigate("/doctor");
    } else {
      navigate("/login");
    }
  }, [admin, user, doctor, navigate]);

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 min-h-screen bg-background transition-all duration-300 ease-in-out">
        <div className="w-full max-w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};
