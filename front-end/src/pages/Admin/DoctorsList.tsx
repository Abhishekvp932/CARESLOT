import { CommonCardView } from "@/components/common/commonCardView";
import { CommonTableView } from "@/components/common/commonTableView";
import { useGetAllDoctorsQuery } from "@/features/admin/adminApi";
import ActionMenu from "@/components/common/actionMenu";
import { Edit } from "lucide-react";
import { useBlockDoctorMutation } from "@/features/admin/adminApi";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

const DoctorsList = () => {
  const [blockDoctor] = useBlockDoctorMutation();
  
  const { data: doctors = [],refetch } = useGetAllDoctorsQuery();
  console.log(doctors);

  const handleDoctorBlockAndUnBlock = async (
    doctorId: string,
    isBlocked: boolean
  ) => {
    console.log("doctor Id", doctorId);

    try {
      const res = await blockDoctor({ doctorId, isBlocked:!isBlocked }).unwrap();
      toast.success(res.msg);
      refetch();
    } catch (error: any) {
      console.log("error is", error);
      if (error?.data?.msg) {
        toast.error(error.data.msg);
      } else {
        toast.error("OTP verification error");
      }
    }
  };

  
    useEffect(()=>{
      refetch()
    },[]);

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
          <button className="bg-black text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1">
            <Edit size={16} />
            Edit
          </button>

          <button
            onClick={() =>
              handleDoctorBlockAndUnBlock(item._id, item.isBlocked)
            }
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
      <CommonTableView title="Doctors" data={doctors} columns={columns} />

      <CommonCardView
        data={doctors}
        title="Doctors"
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
                onBlockToggle={() => handleDoctorBlockAndUnBlock(user._id, user.isBlocked)}
              />
            </div>
          </div>
        )}
      />
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default DoctorsList;
