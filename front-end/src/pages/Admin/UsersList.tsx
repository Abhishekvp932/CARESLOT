import { CommonCardView } from "@/components/common/commonCardView";
import { CommonTableView } from "@/components/common/commonTableView";
import { useGetAllUsersQuery } from "@/features/admin/adminApi";
import ActionMenu from "@/components/common/actionMenu";
import { Edit, Plus } from "lucide-react";
import { useBlockUserMutation } from "@/features/admin/adminApi";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import EditUserModal from "@/components/common/EditUserModal";
import { Button } from "@/components/ui/button";
import { useUpdateUserDataMutation } from "@/features/admin/adminApi";
import { useAddUserMutation } from "@/features/admin/adminApi";
import AddUserModal from "./AddUser";
import { useState } from "react";
const UsersList = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch, setDebounce] = useState("");
  const [loading, setLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebounce(searchTerm);
      setLoading(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data = {},
    refetch,
    isFetching,
  } = useGetAllUsersQuery({ page, limit, search: debounceSearch });
  const users = data?.data;
  const totalPages = data?.totalPages || 1;

  const isLoading = loading || isFetching;

  const [blockUser] = useBlockUserMutation();
  const [updateUserData] = useUpdateUserDataMutation();
  const [addUser] = useAddUserMutation();
  useEffect(() => {
    refetch();
  }, []);
  const handleBlockAndUnblock = async (userId: string, isBlocked: boolean) => {
    try {
      const res = await blockUser({ userId, isBlocked: !isBlocked }).unwrap();
      toast.success(res.msg);
      refetch();
    } catch (error: any) {
      if (error?.data?.msg) {
        toast.error(error.data.msg);
      } else {
        toast.error("OTP verification error");
      }
    }
  };


  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleUser = async (newUser: UserFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", newUser.name);
      formData.append("email", newUser.email);
      formData.append("phone", newUser.phone);
      formData.append("gender", newUser.gender);
      formData.append("dob", newUser.DOB);
      formData.append("profileImage", newUser.profileImg);
      formData.append("password", newUser.password);
      formData.append("role", newUser.role);

      const res = await addUser({ formData }).unwrap();
      toast.success(res?.msg);

      setIsAddModalOpen(false);
      refetch();
    } catch (error: any) {
      if (error?.data?.msg) {
        toast.error(error.data.msg);
      } else {
        toast.error("User profile updating error");
      }
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  const columns = [
    { label: "Name", accessor: "name" },
    { label: "Email", accessor: "email" },
    { label: "role", accessor: "role" },
    { label: "Join Date", accessor: "createdAt" },
    {
      label: "Actions",
      accessor: "actions",
      render: (item) => (
        <div className="flex gap-2">
          {/* <Button variant="outline" className="gap-2">
            <Edit size={16} />
            <EditUserModal
              user={item}
              onSave={(updatedData) => handleSave(updatedData, item._id)}
            />
          </Button> */}

          <button
            onClick={() => handleBlockAndUnblock(item._id, item.isBlocked)}
            className={`px-3 py-1 rounded text-white hover:opacity-90 ${
              item.isBlocked ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {item.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search doctors..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </div>

        <Button
          className="bg-black text-white hover:bg-black"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          Add User
        </Button>
        <AddUserModal
          onSave={handleUser}
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center mt-4">
          {isLoading && (
            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          )}
        </div>
      ) : (
        <div>
          <CommonTableView
            title="Users"
            data={users}
            columns={columns}
            withPagination={true}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />



           {!isLoading && users?.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No users found</p>
        )}

          <CommonCardView
            data={users}
            title="Users"
            renderItem={(user: any) => (
              <div className="flex justify-between items-start">
                <div>
                  <p>
                    <strong>Name:</strong> {user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user?.role}
                  </p>
                  <p>
                    <strong>Join Date:</strong>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="md:hidden">
                  <ActionMenu
                    user={user}
                    onBlockToggle={() =>
                      handleBlockAndUnblock(user._id, user.isBlocked)
                    }
                  />
                </div>
              </div>
            )}
          />
        </div>
      )}

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default UsersList;