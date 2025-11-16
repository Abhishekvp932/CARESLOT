"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEditDoctorDataQuery } from "@/features/admin/adminApi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllDoctorSlotsAndAppoinmentsQuery } from "@/features/admin/adminApi";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Phone,
  Star,
  Users,
  Award,
  GraduationCap,
  Stethoscope,
  UserCheck,
  UserX,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useEffect, useState } from "react";

interface Qualifications {
  specialization: string;
  lisence: string;
  experince: string;
  about: string;
  degree: string;
  medicalSchool: string;
  institution: string;
  experienceCertificate: string;
  educationCertificate: string;
}

interface Doctor {
  profile_img: string;
  name: string;
  qualifications: Qualifications;
  avgRating: number;
  totalRating: number;
  isBlocked: boolean;
  email: string;
  phone: string;
}

interface BreakTime {
  startTime: string;
  endTime: string;
}

interface SlotTime {
  daysOfWeek: string;
  startTime: string;
  endTime: string;
  status: boolean;
  breakTime: BreakTime[];
}

interface SlotDoc {
  slotTimes: SlotTime[];
}

interface PatientInfo {
  name: string;
  email: string;
}




interface Rating {
  patientId: PatientInfo;
  rating: number;
  comment: string;
  createdAt: string;
}

 interface TopTenAppointmentsDTO {
  patientId: string;
  name: string;
  email: string;
  count: number;
  status: string;
  lastAppointmentDate: string;
  startTime: string;
  endTime: string;
}


interface DoctorData {
  appoinments: TopTenAppointmentsDTO[];
  slots: SlotDoc[];
  ratings: Rating[];
}



export default function DoctorDetailsPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { data: doctor } = useGetEditDoctorDataQuery(doctorId) as {
    data: Doctor | undefined;
  };
  const { data } = useGetAllDoctorSlotsAndAppoinmentsQuery(
    doctorId as string
  ) as { data: DoctorData | undefined };

  const appoinments = data?.appoinments || [];

  const slots = data?.slots || [];
  const ratings = data?.ratings || [];

  const navigate = useNavigate();

  const admin = useSelector((state: RootState) => state.admin);
  const user = useSelector((state: RootState) => state.auth.user);
  const doctors = useSelector((state: RootState) => state.doctor.doctor);

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (admin?.role === "admin") {
      setIsAuthorized(true);
    } else if (user) {
      navigate("/");
    } else if (doctors) {
      navigate("/doctor");
    } else {
      navigate("/login");
    }
  }, [admin, user, doctors, navigate]);

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/doctors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Delete Doctor
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <img
                      src={doctor?.profile_img}
                      alt="Doctor"
                      className="w-full h-full rounded-full object-cover border"
                    />
                  </div>

                  <h2 className="text-xl font-bold text-gray-900">
                    {doctor?.name}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {doctor?.qualifications?.specialization}
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{doctor?.avgRating}</span>
                    <span className="text-gray-500">
                      ({doctor?.totalRating} reviews)
                    </span>
                  </div>
                  {doctor?.isBlocked ? (
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-800"
                    >
                      Not Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Active
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{doctor?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{doctor?.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Total Patients</span>
                  </div>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Appointments</span>
                  </div>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Experience</span>
                  </div>
                  <span className="font-bold">
                    {doctor?.qualifications?.experince}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      Professional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Specialization</p>
                        <p className="font-medium">
                          {doctor?.qualifications?.specialization}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">License Number</p>
                        <p className="font-medium">
                          {doctor?.qualifications?.lisence}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Years of Experience
                        </p>
                        <p className="font-medium">
                          {doctor?.qualifications?.experince}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Bio</p>
                      <p className="text-gray-700">
                        {doctor?.qualifications?.about}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Award className="h-4 w-4 text-blue-500 mt-1" />
                        <div>
                          <p className="font-medium">
                            {doctor?.qualifications?.degree}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Award className="h-4 w-4 text-blue-500 mt-1" />
                        <div>
                          <p className="font-medium">
                            Medical school -{" "}
                            {doctor?.qualifications?.medicalSchool}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Award className="h-4 w-4 text-blue-500 mt-1" />
                        <div>
                          <p className="font-medium">
                            Institution - {doctor?.qualifications?.institution}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Certificate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-11">
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">Experience Certificate</p>
                        </div>
                        <img
                          src={doctor?.qualifications?.experienceCertificate}
                          alt="Experience Certificate"
                          className="w-48 h-auto rounded-lg border object-contain"
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">Education Certificate</p>
                        </div>
                        <img
                          src={doctor?.qualifications?.educationCertificate}
                          alt="Education Certificate"
                          className="w-48 h-auto rounded-lg border object-contain"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Day</TableHead>
                          <TableHead>Times</TableHead>
                          <TableHead>Break</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(slots) &&
                          slots.map((slotDoc: SlotDoc, docIndex: number) =>
                            slotDoc?.slotTimes.map(
                              (slot: SlotTime, slotIndex: number) =>
                                slot?.breakTime?.map(
                                  (
                                    breakSlot: BreakTime,
                                    breakIndex: number
                                  ) => (
                                    <TableRow
                                      key={`${docIndex}-${slotIndex}-${breakIndex}`}
                                    >
                                      <TableCell className="font-medium">
                                        {slot?.daysOfWeek}
                                      </TableCell>
                                      <TableCell>
                                        {slot?.startTime &&
                                          new Date(
                                            slot.startTime
                                          ).toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}{" "}
                                        to{" "}
                                        {slot?.endTime &&
                                          new Date(
                                            slot.endTime
                                          ).toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}
                                      </TableCell>
                                      <TableCell>
                                        {breakSlot?.startTime &&
                                          new Date(
                                            breakSlot.startTime
                                          ).toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}{" "}
                                        to{" "}
                                        {breakSlot?.endTime &&
                                          new Date(
                                            breakSlot?.endTime
                                          ).toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          variant="secondary"
                                          className="bg-green-100 text-green-800"
                                        >
                                          {slot?.status
                                            ? "Available"
                                            : "Not Available"}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  )
                                )
                            )
                          )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top 10 Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(appoinments) &&
                          appoinments?.map(
                            (app: TopTenAppointmentsDTO, index: number) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">
                                      {app?.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {app?.email}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">
                                      {app?.lastAppointmentDate &&
                                        new Date(
                                          app?.lastAppointmentDate
                                        ).toLocaleDateString([], {
                                          month: "long",
                                          day: "numeric",
                                        })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {app?.startTime &&
                                        new Date(
                                          `1970-01-01T${app?.startTime}:00`
                                        ).toLocaleTimeString([], {
                                          hour: "numeric",
                                          minute: "2-digit",
                                          hour12: true,
                                        })}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>Consultation</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-800">
                                    {app?.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top 10 Patient Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {Array.isArray(ratings) &&
                        ratings?.map((rating: Rating, index: number) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium">
                                  {rating?.patientId?.name}
                                </p>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star: number) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= rating?.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">
                                {new Date(rating?.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                            <p className="text-gray-700">{rating?.comment}</p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
