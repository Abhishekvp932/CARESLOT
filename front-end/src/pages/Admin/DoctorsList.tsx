import { CommonCardView } from "@/components/common/commonCardView";
import { CommonTableView } from "@/components/common/commonTableView";
import { useGetAllDoctorsQuery } from "@/features/admin/adminApi";
import ActionMenu from "@/components/common/actionMenu";
import { Edit, Plus,Eye } from "lucide-react";
import { useBlockDoctorMutation } from "@/features/admin/adminApi";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
const DoctorsList = () => {
  const [blockDoctor] = useBlockDoctorMutation();
  const navigate = useNavigate();

   const [page, setPage] = useState(1);
    const limit = 10;
  const { data = {}, refetch } = useGetAllDoctorsQuery({page,limit});
  console.log(data)
  const doctors = data?.data || []
  console.log('doctors',doctors);
  const totalPages = data?.totalPages || 1;
  
  useEffect(() => {
    refetch();
  }, []);
  const handleDoctorBlockAndUnBlock = async (
    doctorId: string,
    isBlocked: boolean
  ) => {
     

    try {
      const res = await blockDoctor({
        doctorId,
        isBlocked: !isBlocked,
      }).unwrap();
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

  const handleEdit = (doctorId: string) => {
    navigate(`/admin/doctor-edit/${doctorId}`);
  };
   

  const handleDoctorDetailsPage = (doctorId:string)=>{
     navigate(`/admin/doctor-details/${doctorId}`);
  }
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
          <button
            className="bg-black text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
            onClick={() => handleEdit(item?._id)}
          >
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

           <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
            onClick={() => handleDoctorDetailsPage(item?._id)}
          >
            <Eye size={16} />
            view
          </button>
        </div>
      ),
    },
  ];


  const handleAdd = ()=>{
    navigate('/admin/add-doctors');
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800"></h2>
        <Button className="bg-black text-white hover:bg-black" onClick={handleAdd}>
          <Plus size={16} />
          Add Doctor
        </Button>
      </div>
      <CommonTableView title="Doctors" data={doctors} columns={columns} 
      withPagination= {true}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={(newPage)=> setPage(newPage)}
       />

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
                onBlockToggle={() =>
                  handleDoctorBlockAndUnBlock(user._id, user.isBlocked)
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

export default DoctorsList;
