import { CommonCardView } from "@/components/common/commonCardView";
import { CommonTableView } from "@/components/common/commonTableView";
import { useGetAllUsersQuery } from "@/features/admin/adminApi";
import ActionMenu from "@/components/common/actionMenu";
import { Edit } from "lucide-react";
import { useBlockUserMutation } from "@/features/admin/adminApi";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import EditUserModal from "@/components/common/EditUserModal";
import { Button } from "@/components/ui/button";
import { useUpdateUserDataMutation } from "@/features/admin/adminApi";
const UsersList = () => {
  const { data: users= [], refetch } = useGetAllUsersQuery();
  const [blockUser] = useBlockUserMutation();
  const [updateUserData] = useUpdateUserDataMutation();
  const handleBlockAndUnblock = async (userId: string, isBlocked: boolean) => {
    try {
      const res = await blockUser({ userId, isBlocked: !isBlocked }).unwrap();
      toast.success(res.msg);
      refetch();
    } catch (error: any) {
      console.log(error);

      if (error?.data?.msg) {
        toast.error(error.data.msg);
      } else {
        toast.error("OTP verification error");
      }
    }
  };

  const handleSave = async (updateUser, userId: string) => {
    console.log("updated user id is", userId);

    console.log("updateuser", updateUser);
    const formData = new FormData();
    formData.append("name", updateUser.name);

    formData.append("email", updateUser.email);
    formData.append("phone", updateUser.phone);
    formData.append("gender", updateUser.gender);
    formData.append("dob", updateUser.DOB);
    formData.append("profileImage", updateUser.profileImg);
    console.log("user id is", users._id);
    try {
      const res = await updateUserData({
        formData,
        userId: userId,
      }).unwrap();
      console.log(res);
      toast.success(res.msg);
      refetch();
    } catch (error: any) {
      console.log(error);

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
          <Button variant="outline" className="gap-2">
            <Edit size={16} />
            <EditUserModal
              user={item}
              onSave={(updatedData) => handleSave(updatedData, item._id)}
            />
          </Button>

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Users</h2>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          + Add User
        </Button>
      </div>

      <CommonTableView title="Users" data={users} columns={columns} />

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

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default UsersList;
