import { MoreVertical, Edit } from "lucide-react";
import { useState } from "react";

const ActionMenu = ({ user, onBlockToggle }: { user: any; onBlockToggle: () => void }) => {
  const [open, setOpen] = useState(false);

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
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-gray-100 w-full"
            onClick={() => {
              setOpen(false);
             
            }}
          >
            <Edit size={16} /> Edit
          </button>
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