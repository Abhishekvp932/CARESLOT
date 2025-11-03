import { CommonCardView } from "@/components/common/commonCardView";
import { CommonTableView } from "@/components/common/commonTableView";
import { toast, ToastContainer } from "react-toastify";
import {
  useDoctorRejectMutation,
  useFindUnApprovedDoctorsQuery,
  useDoctorApproveMutation,
} from "@/features/admin/adminApi";
import { Check, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RejectionReasonModal from "@/components/common/admin/rejectionReasonModal";

// Doctor interface
interface Doctor {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
  isRejected?: boolean;
}

// API Response interface
interface DoctorsApiResponse {
  data?: Doctor[];
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

const VerificationList = () => {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Debounce search term
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
    data = {} as DoctorsApiResponse,
    refetch,
    isFetching,
  } = useFindUnApprovedDoctorsQuery({ page, limit, search: debouncedSearch });
  
  const doctors = data?.data || [];
  const totalpages = data?.totalPages || 1;
  const isLoading = loading || isFetching;

  const [doctorApprove] = useDoctorApproveMutation();
  const [doctorReject] = useDoctorRejectMutation();
  const navigate = useNavigate();

  // Initial fetch
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Handle approve doctor
  const handleApproveDoctor = async (doctorId: string): Promise<void> => {
    try {
      const res = await doctorApprove(doctorId).unwrap();
      toast.success(res.msg);
      refetch();
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.msg) {
        toast.error(apiError.data.msg);
      } else {
        toast.error("Doctor approve error");
      }
    }
  };

  // Handle reject doctor
  const handleReject = async (doctorId: string, reason: string): Promise<void> => {
    try {
      const res = await doctorReject({ doctorId, reason }).unwrap();
      toast.success(res?.msg);
      refetch();
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.data?.msg) {
        toast.error(apiError.data.msg);
      } else {
        toast.error("Doctor rejection error");
      }
    }
  };

  // Navigate to details page
  const handleDetailsPage = (doctorId: string): void => {
    navigate(`/admin/verification-details/${doctorId}`);
  };

  // Table columns configuration
  const columns: TableColumn<Doctor>[] = [
    { label: "Name", accessor: "name" },
    { label: "Email", accessor: "email" },
    { label: "Role", accessor: "role" },
    { label: "Join Date", accessor: "createdAt" },
    {
      label: "Actions",
      accessor: "actions",
      render: (item: Doctor) => (
        <div>
          {!item?.isRejected ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleApproveDoctor(item._id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
                type="button"
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
                type="button"
              >
                <X size={16} />
                Reject
              </button>
            </div>
          ) : (
            <span className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 inline-flex">
              Rejected
            </span>
          )}
        </div>
      ),
    },
    {
      label: "View",
      accessor: "view",
      render: (item: Doctor) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
            onClick={() => handleDetailsPage(item._id)}
            type="button"
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
          <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
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
            onPageChange={(newPage: number) => setPage(newPage)}
          />

          {!isLoading && doctors?.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No doctors found</p>
          )}

          <CommonCardView
            data={doctors}
            title="Verification-List"
            renderItem={(doctor: Doctor) => (
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <p>
                    <strong>Name:</strong> {doctor?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {doctor?.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {doctor?.role}
                  </p>
                  <p>
                    <strong>Join Date:</strong>{" "}
                    {new Date(doctor.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {!doctor.isRejected ? (
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveDoctor(doctor._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
                        type="button"
                      >
                        <Check size={16} />
                        Approve
                      </button>

                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setSelectedDoctorId(doctor._id);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
                        type="button"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="bg-red-100 text-red-700 font-semibold px-6 py-2 rounded-full shadow-sm border border-red-200 text-sm uppercase tracking-wide text-center inline-block">
                    Rejected
                  </span>
                )}

                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
                  onClick={() => handleDetailsPage(doctor._id)}
                  type="button"
                >
                  <Eye size={20} />
                  View
                </button>
              </div>
            )}
          />
        </div>
      )}

      <RejectionReasonModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Rejection Reason"
        onSave={(reason: string) => {
          if (selectedDoctorId) {
            handleReject(selectedDoctorId, reason);
          }
        }}
      />

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default VerificationList;