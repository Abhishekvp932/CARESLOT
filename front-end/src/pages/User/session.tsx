"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
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

  const [page, setPage] = useState(1);
  const limit = 3; // backend will use this

  const { data = {}, refetch, isFetching } = useGetAllPatientAppoinmentsQuery({
    patientId,
    page,
    limit,
  });

  const [cancelAppoinment] = useCancelAppoinmentMutation();

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const appoinments = data?.data || [];
  const totalPages = data?.totalPages || 1;   // ✅ use backend value
  const totalItems = data?.totalItem || 0;    // ✅ use backend value
  const currentPage = data?.currentPage || page; // ✅ use backend value

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

  return (
    <div className="space-y-4">
      {/* Appointments Cards */}
      <div className="space-y-4">
        {appoinments.map((appoinment: any) => (
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
                          {appoinment?.doctorId?.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
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
                        <span>{appoinment?.slot?.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-card-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{appoinment?.slot?.startTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none bg-transparent"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none bg-transparent"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Get Directions</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          handleCancelAppoinment(appoinment?._id)
                        }
                      >
                        Cancel Appointment
                      </DropdownMenuItem>
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
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
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
