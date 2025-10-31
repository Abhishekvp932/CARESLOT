"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  User,
  Phone,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DoctorSidebar } from "@/layout/doctor/sideBar";
import { useGetAllAppoinmentsQuery } from "@/features/docotr/doctorApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useNavigate } from "react-router-dom";
import { useCancelAppoinmentMutation } from "@/features/users/userApi";
import { toast, ToastContainer } from "react-toastify";
import PrescriptionModal from "@/components/common/Doctor/PrescriptionModal";
import { useCreatePrescriptionMutation } from "@/features/docotr/doctorApi";
import { useChangeAppoinmentStatusMutation } from "@/features/docotr/doctorApi";
const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function AppointmentsListDoctor() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const [selectedAppoinment, setSelectedAppoinment] = useState<string | null>(
    null
  );
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const navigate = useNavigate();
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const doctorId = doctor?._id as string;

  const { data, refetch } = useGetAllAppoinmentsQuery({
    doctorId,
    page,
    limit,
    status: statusFilter,
  });

  // Extract backend data
  const appointments = data?.data || [];
  const currentPage = Number(data?.currentPage) || 1;
  const totalPages = Number(data?.totalPages) || 1;
  const totalItem = Number(data?.totalItem) || 0;

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  // Pagination controls
  const goToPage = (p: number) => setPage(p);
  const goToPreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Refetch data when page or filter changes
  useEffect(() => {
    refetch();
  }, [page, statusFilter, refetch]);

  const handleVideoCall = (appoinmentId: string) => {
    console.log("appoinment id is comming", appoinmentId);
    navigate(`/doctor/video-call/${appoinmentId}`);
  };

  const [cancelAppoinment] = useCancelAppoinmentMutation();

  const handleCanccelAppoinment = async (appoinmentId: string) => {
    try {
      console.log("appoinmntid", appoinmentId);
      const res = await cancelAppoinment(appoinmentId).unwrap();
      toast.success(res.msg);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.msg);
    }
  };

  interface PrescriptionData {
    diagnosis: string;
    medicines: string;
    advice: string;
  }

  const [createPrescription] = useCreatePrescriptionMutation();
  const handlePrescriptionSave = async (data: PrescriptionData) => {
    try {
      const prescriptionData = {
        diagnosis: data?.diagnosis,
        medicines: data?.medicines,
        advice: data?.advice,
        appoinmentId: selectedAppoinment,
        patientId: selectedPatient,
        doctorId: doctorId,
      };
      console.log("prescription data", prescriptionData);
      const res = await createPrescription(prescriptionData).unwrap();
      console.log("response from back end", res);
      toast.success(res.msg);
    } catch (error) {
      console.log(error);
    }
  };

  const [changeAppoinmentStatus] = useChangeAppoinmentStatusMutation();

  const handleChangeStatus = async (appoinmentId: string) => {
    try {
      const res = await changeAppoinmentStatus(appoinmentId).unwrap();
      console.log(res);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.msg);
    }
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Appointments
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalItem} appointment{totalItem !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                <div className="flex gap-2">
                  {["all", "completed", "pending", "cancelled"].map(
                    (status) => (
                      <Button
                        key={status}
                        variant={
                          statusFilter === status ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleStatusFilter(status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Appointment Cards */}
            {appointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {appointments.map((appointment) => (
                  <Card
                    key={appointment._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {appointment.patientId?.profile_img ? (
                              <img
                                src={appointment.patientId.profile_img}
                                alt={appointment.patientId.name}
                                className="w-10 h-10 object-cover rounded-full"
                              />
                            ) : (
                              <User className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-card-foreground">
                              {appointment.patientId?.name}
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {appointment.patientId?.phone}
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="btn btn-outline btn-sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            {/* Pending Appointments */}
                            {appointment?.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCanccelAppoinment(appointment?._id)
                                  }
                                >
                                  Cancel Appointment
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleChangeStatus(appointment?._id)
                                  }
                                >
                                  Mark as Completed
                                </DropdownMenuItem>
                              </>
                            )}

                            {/* Cancelled Appointments */}
                            {appointment?.status === "cancelled" && (
                              <DropdownMenuItem disabled>
                                Cancelled
                              </DropdownMenuItem>
                            )}

                            {/* Completed Appointments */}
                            {appointment?.status === "completed" && (
                              <DropdownMenuItem disabled>
                                Completed
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem>Close</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {appointment.slot?.date}
                          </span>
                          <span className="text-muted-foreground">
                            ({appointment.slot?.startTime})
                          </span>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Consultation
                        </span>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        {appointment?.status !== "cancelled" ? (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleVideoCall(appointment?._id)}
                          >
                            Start Visit
                          </Button>
                        ) : (
                          <h1 style={{ color: "red" }}>cancelled</h1>
                        )}
                        {appointment?.status !== "cancelled" && appointment?.status !== 'pending' ? (
                          <div>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSelectedAppoinment(appointment?._id);
                                setSelectedPatient(appointment?.patientId?._id);
                                setOpen(true);
                              }}
                            >
                              Add Prescription
                            </Button>
                            <PrescriptionModal
                              open={open}
                              onClose={() => setOpen(false)}
                              onSubmit={handlePrescriptionSave}
                              patientName={appointment?.patientId?.name}
                            />
                          </div>
                        ) : (
                          <h1 style={{ color: "red" }}></h1>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <CardContent>
                  <div className="text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">
                      No appointments found
                    </p>
                    <p className="text-sm">
                      {statusFilter === "all"
                        ? "You don't have any appointments yet."
                        : `No ${statusFilter} appointments found.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {totalPages > 1 && (
              <Card className="mt-6">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} ({totalItem} total)
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <Button
                          key={p}
                          variant={page === p ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(p)}
                          className="w-8 h-8"
                        >
                          {p}
                        </Button>
                      )
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      <ToastContainer autoClose={200} />
    </div>
  );
}
