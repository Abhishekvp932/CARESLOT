import { CommonCardView } from "@/components/common/commonCardView";
import { CommonTableView } from "@/components/common/commonTableView";
import { useGetAllDoctorsQuery } from "@/features/admin/adminApi";
import ActionMenu from "@/components/common/actionMenu";
import { Edit, Plus, Eye } from "lucide-react";
import { useBlockDoctorMutation } from "@/features/admin/adminApi";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import RejectionReasonModal from "@/components/common/admin/rejectionReasonModal";

const DoctorsList = () => {
  const [blockDoctor] = useBlockDoctorMutation();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setLoading(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data = {},
    refetch,
    isFetching,
  } = useGetAllDoctorsQuery({
    page,
    limit,
    search: debouncedSearch,
  });
  console.log(data);
  const doctors = data?.data || [];
  console.log("doctors", doctors);
  const totalPages = data?.totalPages || 1;

  const isLoading = loading || isFetching;

  useEffect(() => {
    setIsOpen(false);
    refetch();
  }, []);
  const handleDoctorBlockAndUnBlock = async (
    doctorId: string,
    isBlocked: boolean,
    reason:string,
  ) => {
    try {
      const res = await blockDoctor({
        doctorId,
        isBlocked: !isBlocked,
        reason
      }).unwrap();
      toast.success(res.msg);
      setIsOpen(false);
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

  const handleDoctorDetailsPage = (doctorId: string) => {
    navigate(`/admin/doctor-details/${doctorId}`);
  };
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
            onClick={() => {
              if (!item.isBlocked) {
                setSelectedDoctorId(item._id);
                setIsOpen(true);
              } else {
                handleDoctorBlockAndUnBlock(item._id,true);
              }
            }}
            className={`px-3 py-1 rounded text-white hover:opacity-90 ${
              item.isBlocked ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {item.isBlocked ? "Unblock" : "Block"}
          </button>
           <RejectionReasonModal open={isOpen} title="Blocking Reason" onOpenChange={setIsOpen} onSave={(reason)=>{
              if(selectedDoctorId){
                handleDoctorBlockAndUnBlock(selectedDoctorId,false,reason);
              }
           }}/>
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

  const handleAdd = () => {
    navigate("/admin/add-doctors");
  };

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
          className="bg-black text-white hover:bg-black/90 rounded-lg shadow-sm"
          onClick={handleAdd}
        >
          <Plus size={16} className="mr-2" />
          Add Doctor
        </Button>
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
            title="Doctors"
            data={doctors}
            columns={columns}
            withPagination={true}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />

          {!isLoading && doctors?.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No Doctors found</p>
          )}

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
        </div>
      )}
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default DoctorsList;
