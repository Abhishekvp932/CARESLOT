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
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 min-h-screen max-h-screen overflow-y-auto p-4 bg-gray-100">
        {children}
      </main>
    </div>
  );
};
