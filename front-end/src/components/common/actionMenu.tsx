import { MoreVertical} from "lucide-react";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";

const ActionMenu = ({ user, onBlockToggle }: { user: any; onBlockToggle: () => void }) => {
  const [open, setOpen] = useState(false);
  // const navigate = useNavigate();
// const handleDoctorDetailsPage = (doctorId:string)=>{
//  navigate(`/admin/doctor-details/${doctorId}`);
// }
  return (
    <div className="relative">
    
      <button
        className="p-2 rounded hover:bg-gray-200"
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreVertical size={20} />
      </button>

    
      {open && (
        <div className="absolute right-0 mt-2 w-28 bg-white shadow-md rounded z-10">
           {/* <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
            onClick={() => handleDoctorDetailsPage(user?._id)}
          >
            <Eye size={16} />
            view
          </button> */}
          <button
            className={`px-3 py-2 text-sm text-white w-full text-left rounded-b ${
              user.isBlocked ? "bg-green-600" : "bg-red-600"
            } hover:opacity-90`}
            onClick={() => {
              setOpen(false);
              onBlockToggle();
            }}
          >
            {user.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu