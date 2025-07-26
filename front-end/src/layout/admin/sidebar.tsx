import { useState } from "react";
import { Menu, X, Home, User, Stethoscope, CalendarDays,Timer,LogOut } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AdminlogOut as adminLogOut } from "@/features/admin/adminSlice"; 
export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
   const dispatch = useDispatch()
   const navigate = useNavigate()

  const handleLogout = ()=>{
      dispatch(adminLogOut())
      navigate('/login');
  }

  return (
    <>
      <button
        className="md:hidden p-2 text-gray-800 z-50 fixed"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white p-4 z-40 transform transition-transform duration-300 ease-in-out
    ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } md:translate-x-0 md:block`}
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="text-2xl font-extrabold text-white-400 mb-8 tracking-wide">
          CARESLOT
        </div>

        <ul className="space-y-4">
          <li className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded transition">
            <Home size={20} />
            <span className="text-sm font-medium">
              <Link to="/admin">Dasboards</Link>
            </span>
          </li>
          <li className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded transition">
            <User size={20} />
            <span className="text-sm font-medium">
              <Link to="/admin/users">User</Link>
            </span>
          </li>
          <li className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded transition">
            <Stethoscope size={20} />
            <span className="text-sm font-medium">
              <Link to="/admin/doctors">Doctors</Link>
            </span>
          </li>
           <li className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded transition">
            <Timer size={20} />
            <span className="text-sm font-medium">
              <Link to="/admin/pending-verification">Pendings Verifications</Link>
            </span>
          </li>
          <li className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded transition">
            <CalendarDays size={20} />
            <span className="text-sm font-medium">
              <Link to="#admin/appoinments">Appoinments</Link>
            </span>
          </li>

          <li className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded transition">
             <LogOut size={20}/>
            <span className="text-sm font-medium">
             <button type="button" onClick={handleLogout}>
              Logout
            </button>
            </span>
          </li>
        </ul>
      </aside>
    </>
  );
};
