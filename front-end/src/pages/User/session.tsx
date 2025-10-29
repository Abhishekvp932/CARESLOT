"use client";

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
  const limit = 8; // backend will use this

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
    } catch (error: any) {
      toast.error(error?.data?.msg);
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
    console.log("video call appoinment id ", appoinmentId);
    navigate(`/video-call/${appoinmentId}`);
  };

  const downloadPrescription = async (appointmentId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/prescription/download/${appointmentId}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response?.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Prescription-${appointmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      console.log(error.response?.data?.msg);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {appoinments.map((appoinment) => (
          <Card
            key={appoinment._id}
            className="bg-card border-border hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="w-16 h-16 border-2 border-border">
                    <AvatarImage
                      src={appoinment?.doctorId?.profile_img}
                      alt="doctorname"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {appoinment?.doctorId?.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-card-foreground mb-1">
                          Dr Name - {appoinment?.doctorId?.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          specialization -{" "}
                          {appoinment?.doctorId?.qualifications?.specialization}
                        </p>
                      </div>
                      <Badge
                        className={`capitalize ${getStatusColor(
                          appoinment?.status
                        )}`}
                      >
                        {appoinment?.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-card-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>
                          Booking Date -{" "}
                          {appoinment?.createdAt &&
                            new Date(appoinment?.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                              }
                            )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-card-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>
                          Appoinment Date -{" "}
                          {appoinment?.slot?.date &&
                            new Date(appoinment?.slot?.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                              }
                            )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-card-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>
                          Appointment Time -{" "}
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
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                  <div className="flex gap-2">
                    {appoinment?.status !== "cancelled" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none bg-transparent"
                        onClick={() => handleVideoCall(appoinment?._id)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Join Call
                      </Button>
                    ) : (
                      <h1></h1>
                    )}
                    {appoinment?.status !== "cancelled" && appoinment?.status === 'completed' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none bg-transparent"
                        onClick={() => downloadPrescription(appoinment?._id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Prescription
                      </Button>
                    ) : (
                      <h1></h1>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="btn btn-outline btn-sm">
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
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} ({totalItems} appointments)
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                        className="w-8 h-8"
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
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
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
