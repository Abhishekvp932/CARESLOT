

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Phone,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetAllPatientAppoinmentsQuery,
  useCancelAppoinmentMutation,
} from "@/features/users/userApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleApiError } from "@/utils/handleApiError";

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-500/10 text-red-500 border-red-500/20";
    case "cancelled":
      return "bg-red-500 text-white-500 border-red-500/20";
    case "pending":
      return "bg-yellow-200 text-gray-600 border-gray-300";
    default:
      return "bg-gray-200 text-gray-600 border-gray-300";
  }
};

export function SessionCard() {
  const patient = useSelector((state: RootState) => state.auth.user);
  const patientId = patient?._id as string;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 8;

  const {
    data = {},
    refetch,
    isFetching,
  } = useGetAllPatientAppoinmentsQuery({
    patientId,
    page,
    limit,
  });

  const [cancelAppoinment] = useCancelAppoinmentMutation();

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const appoinments = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItem || 0;
  const currentPage = data?.currentPage || page;

  const handleCancelAppoinment = async (appoinmentId: string) => {
    try {
      const res = await cancelAppoinment(appoinmentId).unwrap();
      toast.success(res.msg);
      refetch();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  if (!Array.isArray(appoinments) || appoinments.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {isFetching ? "Loading appointments..." : "No appointments found."}
          </p>
        </CardContent>
        <ToastContainer autoClose={2000} />
      </Card>
    );
  }

  const handleVideoCall = (appoinmentId: string) => {
 
    navigate(`/video-call/${appoinmentId}`);
  };

  const downloadPrescription = async (appointmentId: string) => {
    try {
      const response = await axios.get<Blob>(
        `https://careslot-j0bz.onrender.com/api/prescription/download/${appointmentId}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Prescription-${appointmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
       toast.error(handleApiError(error));
    }
  };

  return (
    <div className="space-y-4 w-full px-2 sm:px-0">
      <div className="space-y-4">
        {appoinments.map((appoinment) => (
          <Card
            key={appoinment._id}
            className="bg-card border-border hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                {/* Header Section with Avatar and Status */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-border flex-shrink-0">
                    <AvatarImage
                      src={appoinment?.doctorId?.profile_img}
                      alt="doctorname"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm sm:text-base">
                      {appoinment?.doctorId?.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg text-card-foreground mb-1 truncate">
                          Dr {appoinment?.doctorId?.name}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm truncate">
                          {appoinment?.doctorId?.qualifications?.specialization}
                        </p>
                      </div>
                      <Badge
                        className={`capitalize text-xs whitespace-nowrap flex-shrink-0 ${getStatusColor(
                          appoinment?.status
                        )}`}
                      >
                        {appoinment?.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-card-foreground">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="break-words">
                      Booking:{" "}
                      {appoinment?.createdAt &&
                        new Date(appoinment?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-card-foreground">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="break-words">
                      Appointment:{" "}
                      {appoinment?.slot?.date &&
                        new Date(appoinment?.slot?.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-card-foreground">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="break-words">
                      Time:{" "}
                      {appoinment?.slot?.startTime &&
                        new Date(
                          `1970-01-01T${appoinment.slot.startTime}:00`
                        ).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
                  {appoinment?.status !== "cancelled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto bg-transparent text-xs sm:text-sm"
                      onClick={() => handleVideoCall(appoinment?._id)}
                    >
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Join Call
                    </Button>
                  )}

                  {appoinment?.status !== "cancelled" &&
                    appoinment?.status === "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto bg-transparent text-xs sm:text-sm"
                        onClick={() => downloadPrescription(appoinment?._id)}
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">
                          Download Prescription
                        </span>
                        <span className="sm:hidden">Prescription</span>
                      </Button>
                    )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full sm:w-auto sm:ml-auto bg-transparent">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {appoinment?.status === "pending" && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleCancelAppoinment(appoinment?._id)
                          }
                        >
                          Cancel Appointment
                        </DropdownMenuItem>
                      )}

                      {appoinment?.status === "cancelled" && (
                        <DropdownMenuItem disabled>Cancelled</DropdownMenuItem>
                      )}

                      {appoinment?.status === "completed" && (
                        <DropdownMenuItem disabled>Completed</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Card className="bg-card border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                Page {currentPage} of {totalPages} ({totalItems} appointments)
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>

                <div className="flex items-center space-x-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                        className="w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm p-0 flex-shrink-0"
                      >
                        {p}
                      </Button>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <ToastContainer autoClose={2000} />
    </div>
  );
}
