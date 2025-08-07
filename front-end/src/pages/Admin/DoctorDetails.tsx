"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// CardDescription
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEditDoctorDataQuery } from "@/features/admin/adminApi";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Mail,
  MapPin,
  Phone,
  Star,
  Users,
  Award,
  GraduationCap,
  Stethoscope,
  UserCheck,
  UserX,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DoctorDetailsPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { data: doctor } = useGetEditDoctorDataQuery(doctorId);
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
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
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
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
                    {/* <span className="font-medium">4.8</span> */}
                    <span className="text-gray-500">No reviews</span>
                  </div>
                  {doctor?.isBlocked ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
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

            {/* Quick Stats */}
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

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Professional Information */}
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

                {/* Education & Certifications */}
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
                          {/* <p className="text-sm text-gray-500">2008 - 2012</p> */}
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
                            institution - {doctor?.qualifications?.institution}
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
                          alt="Experience Certificate"
                          className="w-48 h-auto rounded-lg border object-contain"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Schedule Tab */}
              {/* <TabsContent value="schedule" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                    <CardDescription>Doctor's availability throughout the week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Day</TableHead>
                          <TableHead>Morning</TableHead>
                          <TableHead>Afternoon</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Monday</TableCell>
                          <TableCell>9:00 AM - 12:00 PM</TableCell>
                          <TableCell>2:00 PM - 6:00 PM</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Available
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Tuesday</TableCell>
                          <TableCell>9:00 AM - 12:00 PM</TableCell>
                          <TableCell>2:00 PM - 6:00 PM</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Available
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Wednesday</TableCell>
                          <TableCell>9:00 AM - 12:00 PM</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Partial
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Thursday</TableCell>
                          <TableCell>9:00 AM - 12:00 PM</TableCell>
                          <TableCell>2:00 PM - 6:00 PM</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Available
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Friday</TableCell>
                          <TableCell>9:00 AM - 12:00 PM</TableCell>
                          <TableCell>2:00 PM - 5:00 PM</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Available
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Saturday</TableCell>
                          <TableCell>10:00 AM - 1:00 PM</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Partial
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Sunday</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              Unavailable
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent> */}

              {/* Appointments Tab */}
              {/* <TabsContent value="appointments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Appointments</CardTitle>
                    <CardDescription>Latest patient appointments and their status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">John Smith</p>
                              <p className="text-sm text-gray-500">john.smith@email.com</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">Jan 15, 2024</p>
                              <p className="text-sm text-gray-500">10:30 AM</p>
                            </div>
                          </TableCell>
                          <TableCell>Consultation</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">Emily Davis</p>
                              <p className="text-sm text-gray-500">emily.davis@email.com</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">Jan 16, 2024</p>
                              <p className="text-sm text-gray-500">2:00 PM</p>
                            </div>
                          </TableCell>
                          <TableCell>Follow-up</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">Michael Brown</p>
                              <p className="text-sm text-gray-500">michael.brown@email.com</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">Jan 14, 2024</p>
                              <p className="text-sm text-gray-500">11:15 AM</p>
                            </div>
                          </TableCell>
                          <TableCell>Check-up</TableCell>
                          <TableCell>
                            <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent> */}

              {/* Reviews Tab */}
              {/* <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Reviews</CardTitle>
                    <CardDescription>Recent feedback from patients</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">Sarah Wilson</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">2 days ago</p>
                        </div>
                        <p className="text-gray-700">
                          "Dr. Johnson is an excellent cardiologist. She took the time to explain my condition
                          thoroughly and made me feel comfortable throughout the entire process. Highly recommended!"
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">Robert Chen</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                              <Star className="h-4 w-4 text-gray-300" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">1 week ago</p>
                        </div>
                        <p className="text-gray-700">
                          "Very professional and knowledgeable. The appointment was on time and Dr. Johnson answered all
                          my questions patiently."
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">Lisa Martinez</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">2 weeks ago</p>
                        </div>
                        <p className="text-gray-700">
                          "Outstanding care! Dr. Johnson's expertise and compassionate approach made a difficult
                          diagnosis much easier to handle. Thank you!"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
