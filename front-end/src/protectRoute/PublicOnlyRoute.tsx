import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { RootState } from "@/app/store";

const PublicOnlyRoute = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth);
  const doctor = useSelector((state: RootState) => state.doctor);
  const admin = useSelector((state: RootState) => state.admin);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "patient") navigate("/");
    else if (doctor?.role === "doctor") navigate("/doctor");
    else if (admin?.role === "admin") navigate("/admin");
  }, [user, doctor, admin, navigate]);

  const isLoggedIn = user || doctor || admin;

  return !isLoggedIn ? children : null;
};

export default PublicOnlyRoute;
