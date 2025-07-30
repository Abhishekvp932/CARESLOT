import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  Save,
  Camera,
  User,
  Stethoscope,
  GraduationCap,
  MapPin,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DoctorSidebar } from "@/layout/doctor/sideBar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useGetDoctorDataQuery } from "@/features/docotr/doctorApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { toast, ToastContainer } from "react-toastify";
import { useEditDoctorDataMutation } from "@/features/docotr/doctorApi";
import isEqual from "lodash.isequal";
export default function DoctorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const doctorId = useSelector((state: RootState) => state.doctor.doctor);
  const { data: doctor, refetch } = useGetDoctorDataQuery(doctorId?._id);
  const [formData, setFormData] = useState<typeof doctor | null>(null);
  const [originalData, setOriginalData] = useState<typeof doctor | null>(null);
  const [editDoctorData] = useEditDoctorDataMutation();
  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
      setOriginalData(doctor);
    }
  }, [doctor]);

  const handleSave = async () => {
    if (!formData) return;

    if (isEqual(formData, originalData)) {
      toast.info("No change detected");
      setIsEditing(false);
      return;
    }

    try {
      const fd = new FormData();

      fd.append("name", formData.name || "");
      fd.append("email", formData.email || "");
      fd.append("phone", formData.phone || "");
      fd.append("DOB", formData.DOB || "");
      fd.append("gender", formData.gender || "");

      if (formData.profile_img instanceof File) {
        fd.append("profileImage", formData.profile_img);
      }

      const q = formData.qualifications || {};
      fd.append("degree", q.degree || "");
      fd.append("institution", q.institution || "");
      fd.append("specialization", q.specialization || "");
      fd.append("medicalSchool", q.medicalSchool || "");
      fd.append("experince", q.experince?.toString() || "");
      fd.append("graduationYear", q.graduationYear?.toString() || "");
      fd.append("fees", q.fees?.toString() || "");
      fd.append("license", q.lisence || "");
      fd.append("about", q.about || "");

      if (
        q.educationCertificate instanceof File ||
        (typeof q.educationCertificate === "string" &&
          q.educationCertificate.trim())
      ) {
        fd.append("educationCertificate", q.educationCertificate);
      }

      if (
        q.experienceCertificate instanceof File ||
        (typeof q.experienceCertificate === "string" &&
          q.experienceCertificate.trim())
      ) {
        fd.append("experienceCertificate", q.experienceCertificate);
      }
      console.log("submited doctor informations", formData);

      const res = await editDoctorData({
        doctorId: formData?._id,
        formData: fd,
      }).unwrap();
      toast.success(res?.msg);
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.msg || "Doctor update error");
    }
  };

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="min-h-screen bg-gray-50 p-6 flex">
          <DoctorSidebar />
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-2xl font-bold">My Profile</h1>

              <Button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage
                        src={
                          formData?.profile_img instanceof File
                            ? URL.createObjectURL(formData.profile_img)
                            : formData?.profile_img
                        }
                        alt="Doctor Profile"
                      />
                      <AvatarFallback className="text-2xl">SJ</AvatarFallback>
                    </Avatar>

                    {isEditing && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                          asChild
                        >
                          <label htmlFor="profileImage">
                            <Camera className="h-4 w-4 cursor-pointer" />
                          </label>
                        </Button>
                        <input
                          id="profileImage"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData((prev) => ({
                                ...prev!,
                                profile_img: file,
                              }));
                            }
                          }}
                        />
                      </>
                    )}
                  </div>

                  <h2 className="text-xl font-bold mb-2">{doctor?.name}</h2>
                  <p className="text-gray-600 mb-3">
                    {doctor?.qualifications?.specialization}
                  </p>
                  {doctor?.isBlocked ? (
                    <Badge className="bg-green-100 text-red-800">
                      Not Active
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  )}
                </CardContent>
              </Card>

             
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Name</Label>
                      <Input
                        id="name"
                        value={formData?.name || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData?.email || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData?.phone || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev!,
                            Phone: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="experience"
                      value={formData?.qualifications?.specialization || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev!,
                          qualifications: {
                            ...prev?.qualifications!,
                            specialization: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      value={formData?.qualifications?.experince || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev!,
                          qualifications: {
                            ...prev?.qualifications!,
                            experince: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license">License Number</Label>
                    <Input
                      id="experience"
                      value={formData?.qualifications?.lisence || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev!,
                          qualifications: {
                            ...prev?.qualifications!,
                            lisence: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fee">Consultation Fee</Label>
                    <Input
                      id="fees"
                      value={formData?.qualifications?.fees || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev!,
                          qualifications: {
                            ...prev?.qualifications!,
                            fees: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={doctor?.qualifications?.about}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev!,
                        qualifications: {
                          ...prev?.qualifications!,
                          about: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education & Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Degree</Label>
                    {isEditing ? (
                      <Input
                        value={formData?.qualifications?.degree || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev!,
                            qualifications: {
                              ...prev?.qualifications!,
                              degree: e.target.value,
                            },
                          }))
                        }
                      />
                    ) : (
                      <p className="font-medium">
                        Degree - {formData?.qualifications?.degree}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm">Medical School</Label>
                    {isEditing ? (
                      <Input
                        value={formData?.qualifications?.medicalSchool || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev!,
                            qualifications: {
                              ...prev?.qualifications!,
                              medicalSchool: e.target.value,
                            },
                          }))
                        }
                      />
                    ) : (
                      <p className="font-medium">
                        Medical School -{" "}
                        {formData?.qualifications?.medicalSchool}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Institution</Label>
                    {isEditing ? (
                      <Input
                        value={formData?.qualifications?.institution || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev!,
                            qualifications: {
                              ...prev?.qualifications!,
                              institution: e.target.value,
                            },
                          }))
                        }
                      />
                    ) : (
                      <p className="font-medium">
                        Institution - {formData?.qualifications?.institution}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Specialization</Label>
                    {isEditing ? (
                      <Input
                        value={formData?.qualifications?.specialization || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev!,
                            qualifications: {
                              ...prev?.qualifications!,
                              specialization: e.target.value,
                            },
                          }))
                        }
                      />
                    ) : (
                      <p className="font-medium">
                        specialization -{" "}
                        {formData?.qualifications?.specialization}
                      </p>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <Button variant="outline" className="w-full bg-transparent">
                    Add New Qualification
                  </Button>
                )}
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
                    {isEditing && (
                      <Input
                        id="experienceCertificate"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData((prev) => ({
                              ...prev!,
                              qualifications: {
                                ...prev?.qualifications!,
                                experienceCertificate: file,
                              },
                            }));
                          }
                        }}
                      />
                    )}
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
                    <Input
                      id="educationCertificate"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData((prev) => ({
                            ...prev!,
                            qualifications: {
                              ...prev?.qualifications!,
                              educationCertificate: file,
                            },
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <p className="text-sm text-gray-600">Reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {doctor?.qualifications?.experince}
                  </div>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <ToastContainer autoClose={200} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
