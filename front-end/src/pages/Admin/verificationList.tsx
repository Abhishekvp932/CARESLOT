import { CommonCardView } from "@/components/common/commonCardView";
import { CommonTableView } from "@/components/common/commonTableView";
import { toast, ToastContainer } from "react-toastify";

import { useDoctorRejectMutation } from "@/features/admin/adminApi";
import {
  useFindUnApprovedDoctorsQuery,
  useDoctorApproveMutation,
} from "@/features/admin/adminApi";
import { Check, X,Eye} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const VerificationList = () => {
  const { data: doctors = [], refetch } = useFindUnApprovedDoctorsQuery();
  const [doctorApprove] = useDoctorApproveMutation();
  const [doctorReject] = useDoctorRejectMutation();
  const navigate = useNavigate()

  useEffect(()=>{
    refetch()
  },[]);
  const handleApproveDoctor = async (doctorId: string) => {
    try {
      console.log("1");
      console.log("doctor id is", doctorId);
      const res = await doctorApprove({ doctorId }).unwrap();

      console.log(res);
      toast.success(res.msg);
      refetch();
    } catch (error: any) {
      console.log(error);
      if (error?.data?.msg) {
        toast.error(error.data.msg);
      } else {
        toast.error("Doctor approve error");
      }
    }
  };

  const handleReject = async (doctorId: string) => {
    try {
      const res = await doctorReject({ doctorId }).unwrap();
      console.log("res", res);
      refetch();
    } catch (error:any) {
       console.log(error);
      if (error?.data?.msg) {
        toast.error(error.data.msg);
      } else {
        toast.error("Doctor rejection error");
      }
    }
  };


  const handleDetailsPage = (doctorId:string)=>{
    console.log('doctor id is',doctorId);
    navigate(`/admin/doctor-details/${doctorId}`)
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
            onClick={() => handleApproveDoctor(item._id)}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
          >
            <Check size={16} />
            Approve
          </button>

          <button
            onClick={() => handleReject(item._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
          >
            <X size={16} />
            Reject
          </button>
        </div>
      ),
    },
    {
      label: "View",
      accessor: "view",
      render: (item) => (
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-gray-900 flex items-center gap-1" onClick={()=> handleDetailsPage(item._id)}>
            <Eye size={20}/>
            View Details
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <CommonTableView title="Verification-List" data={doctors} columns={columns} />

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
              <button
                onClick={() => handleApproveDoctor(user._id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
              >
                <Check size={16} />
                Approve
              </button>

              <button
                onClick={() => handleReject(user._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1"
              >
                <X size={16} />
                Reject
              </button>

              <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-gray-900 flex items-center gap-1" onClick={()=> handleDetailsPage(user._id)}>
                <Eye size={20}/>
                View
              </button>
            </div>
          </div>
        )}
      />
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default VerificationList;
