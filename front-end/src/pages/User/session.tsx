// import { Badge } from "@/components/ui/badge"
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetAllPatientAppoinmentsQuery } from "@/features/users/userApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useEffect } from "react";
import { useCancelAppoinmentMutation } from "@/features/users/userApi";
import {toast,ToastContainer} from 'react-toastify'

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


// const formatDate = (dateString: string) => {
//   const date = new Date(dateString)
//   return date.toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   })
// }

export function SessionCard() {
  const patient = useSelector((state: RootState) => state.auth.user);
  const patientId = patient?._id as string;
  const { data = {},refetch} = useGetAllPatientAppoinmentsQuery(patientId);
  const [cancelAppoinment] = useCancelAppoinmentMutation();
  useEffect(()=>{
    refetch();
  },[]);
  const appoinments = data || [];
  console.log("patient appoinment data", appoinments);

   


  const handleCancelAppoinment = async(appoinmentId:string)=>{
    try {
      const res = await cancelAppoinment(appoinmentId).unwrap();
      console.log('response from the back end',res);
      toast.success(res.msg);
    } catch (error:any) {
      // console.log(error:any);
      toast.error(error?.data?.msg);
    }
  }



  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow duration-200">
      {Array.isArray(appoinments) &&
        appoinments.map((appoinment) => (
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
                      .map((n) => n[0])
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
                    <DropdownMenuItem className="text-destructive" onClick={()=> handleCancelAppoinment(appoinment?._id)}>
                      Cancel Appointment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        ))}
        <ToastContainer autoClose = {200}/>
    </Card>
  );
}
