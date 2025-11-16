import { CommonCardView } from "@/components/common/commonCardView";
import { CommonTableView } from "@/components/common/commonTableView";
import { useGetAllUsersQuery } from "@/features/admin/adminApi";
import ActionMenu from "@/components/common/actionMenu";
import { Plus } from "lucide-react";
import { useBlockUserMutation } from "@/features/admin/adminApi";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAddUserMutation } from "@/features/admin/adminApi";
import AddUserModal from "./AddUser";
import ConfirmationModal from "@/components/common/ConfirmationModal";

// User interface
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
  isBlocked: boolean;
}

// User form data interface
interface UserFormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  DOB: string;
  profileImg?: File | undefined;
  password: string;
  role: string;
}

// API Response interface
interface UsersApiResponse {
  data?: User[];
  totalPages?: number;
}

// Error interface
interface ApiError {
  data?: {
    msg?: string;
  };
}

// Column interface for table
interface TableColumn<T> {
  label: string;
  accessor: string;
  render?: (item: T) => React.ReactNode;
}

const UsersList = () => {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debounceSearch, setDebounce] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const limit = 10;

  // Debounce search term
  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebounce(searchTerm);
      setLoading(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch users query
  const { data = {} as UsersApiResponse, isFetching } = useGetAllUsersQuery({
    page,
    limit,
    search: debounceSearch,
  });

  // Update users when data changes
  useEffect(() => {
    if (data?.data) {
      setUsers(data.data);
    }
  }, [data]);

  const totalPages = data?.totalPages || 1;
  const isLoading = loading || isFetching;

  // Mutations
  const [blockUser] = useBlockUserMutation();
  const [addUser] = useAddUserMutation();

  // Handle block/unblock user
  const handleBlockAndUnblock = async (
    userId: string,
    isBlocked: boolean
  ): Promise<void> => {
    // Optimistic update
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, isBlocked: !isBlocked } : user
      )
    );

    try {
      const res = await blockUser({ userId, isBlocked: !isBlocked }).unwrap();
      toast.success(res.msg);
    } catch (error) {
      // Revert optimistic update on error
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked } : user
        )
      );

      const apiError = error as ApiError;
      if (apiError?.data?.msg) {
        toast.error(apiError.data.msg);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Handle add user
  const handleUser = async (newUser: UserFormData): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("name", newUser.name);
      formData.append("email", newUser.email);
      formData.append("phone", newUser.phone);
      formData.append("gender", newUser.gender);
      formData.append("dob", newUser.DOB);
      if (newUser.profileImg) {
        formData.append("profileImage", newUser.profileImg);
      }
      formData.append("password", newUser.password);
      formData.append("role", newUser.role);

      const res = await addUser({ formData }).unwrap();
      toast.success(res?.msg);

      setIsAddModalOpen(false);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.msg) {
        toast.error(apiError.data.msg);
      } else {
        toast.error("User profile updating error");
      }
    }
  };

  // Table columns configuration
  const columns: TableColumn<User>[] = [
    { label: "Name", accessor: "name" },
    { label: "Email", accessor: "email" },
    { label: "Role", accessor: "role" },
    { label: "Join Date", accessor: "createdAt" },
    {
      label: "Actions",
      accessor: "actions",
      render: (item: User) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedUser(item);
              setConfirmOpen(true);
            }}
            className={`px-3 py-1 rounded text-white hover:opacity-90 ${
              item.isBlocked ? "bg-green-600" : "bg-red-600"
            }`}
            type="button"
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
            placeholder="Search users..."
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
          <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
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
            onPageChange={(newPage: number) => setPage(newPage)}
          />

          {!isLoading && users?.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No users found</p>
          )}

          <CommonCardView
            data={users}
            withPagination={true}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
            title="Users"
            renderItem={(user: User) => (
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
                    onBlockToggle={() => {
                      setSelectedUser(user);
                      setConfirmOpen(true);
                    }}
                  />
                </div>
              </div>
            )}
          />
        </div>
      )}
      {selectedUser && (
        <ConfirmationModal
          open={confirmOpen}
          title={selectedUser.isBlocked ? "Unblock User?" : "Block User?"}
          description={
            selectedUser.isBlocked
              ? `Are you sure you want to unblock ${selectedUser.name}?`
              : `Are you sure you want to block ${selectedUser.name}?`
          }
          confirmText={selectedUser.isBlocked ? "Yes, Unblock" : "Yes, Block"}
          cancelText="Cancel"
          onConfirm={() => {
            handleBlockAndUnblock(selectedUser._id, selectedUser.isBlocked);
            setConfirmOpen(false);
            setSelectedUser(null);
          }}
          onCancel={() => {
            setConfirmOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default UsersList;
