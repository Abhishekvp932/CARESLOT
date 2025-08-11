import { CommonCardView } from "@/components/common/commonCardView";
import { CommonTableView } from "@/components/common/commonTableView";
import { toast, ToastContainer } from "react-toastify";

import { useDoctorRejectMutation } from "@/features/admin/adminApi";
import {
  useFindUnApprovedDoctorsQuery,
  useDoctorApproveMutation,
} from "@/features/admin/adminApi";
import { Check, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RejectionReasonModal from "@/components/common/admin/rejectionReasonModal";
const VerificationList = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setLoading(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const limit = 10;
  const {
    data = {},
    refetch,
    isFetching,
  } = useFindUnApprovedDoctorsQuery({ page, limit, search: debouncedSearch });
  const doctors = data?.data;
  const totalpages = data?.totalPages || 1;

  const isLoading = loading || isFetching;

  const [doctorApprove] = useDoctorApproveMutation();
  const [doctorReject] = useDoctorRejectMutation();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, []);
  const handleApproveDoctor = async (doctorId: string) => {
    try {
      const res = await doctorApprove({ doctorId }).unwrap();

      toast.success(res.msg);
      refetch();
    } catch (error: any) {
      if (error?.data?.msg) {
        toast.error(error.data.msg);
      } else {
        toast.error("Doctor approve error");
      }
    }
  };

  const handleReject = async (doctorId: string, reason: string) => {
    try {
      console.log("reson", reason);
      const res = await doctorReject({ doctorId, reason }).unwrap();
      toast.success(res?.msg);
      refetch();
    } catch (error: any) {
      if (error?.data?.msg) {
        toast.error(error.data.msg);
      } else {
        toast.error("Doctor rejection error");
      }
    }
  };

  const handleDetailsPage = (doctorId: string) => {
    navigate(`/admin/verification-details/${doctorId}`);
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
        <div>
          {
          item?.rejectionReason && item?.rejectionReason?.length > 0 ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleApproveDoctor(item._id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
              >
                <Check size={16} />
                Approve
              </button>

              <button
                onClick={() => {
                  setIsOpen(true);
                  setSelectedDoctorId(item._id);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
              >
                <X size={16} />
                Reject
              </button>
            </div>
          ) : (
         <div className="text-red-600 bg-red-100 px-4 py-1 rounded-lg font-semibold text-center shadow-md ml-2 w-max">
        <h4>Admin rejected</h4>
        </div>

          )}
        </div>
      ),
    },
    {
      label: "View",
      accessor: "view",
      render: (item) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
            onClick={() => handleDetailsPage(item._id)}
          >
            <Eye size={20} />
            View Details
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
            title="Verification-List"
            data={doctors}
            columns={columns}
            withPagination={true}
            currentPage={page}
            totalPages={totalpages}
            onPageChange={(newPage) => setPage(newPage)}
          />

          {!isLoading && doctors?.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No doctors found</p>
          )}

          <CommonCardView
            data={doctors}
            title="Verification-List"
            renderItem={(user: any) => (
              <div className="flex justify-between items-start flex-wrap gap-4">
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

                <div className="flex flex-col gap-2 items-end">
                  {doctors?.rejectionReason &&
                  doctors.rejectionReason.trim() !== "" &&
                  !doctors.isApproved ? (
                    <div>
                      <button
                        onClick={() => handleApproveDoctor(doctors._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
                      >
                        <Check size={16} />
                        Approve
                      </button>

                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setSelectedDoctorId(doctors._id);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h4>Admin rejected</h4>
                    </div>
                  )}

                  <RejectionReasonModal
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    title="Rejection Reason"
                    onSave={(reason) => {
                      if (selectedDoctorId) {
                        handleReject(selectedDoctorId, reason);
                      }
                    }}
                  />
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
                    onClick={() => handleDetailsPage(user._id)}
                  >
                    <Eye size={20} />
                    View
                  </button>
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

export default VerificationList;
