import { MoreVertical } from "lucide-react";
import { useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const ActionMenu = ({
  user,
  onBlockToggle,
}: {
  user: User;
  onBlockToggle: () => void;
}) => {
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

export default ActionMenu;
