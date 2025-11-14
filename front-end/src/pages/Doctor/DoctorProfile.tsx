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
} from "lucide-react";
import { useEffect, useState } from "react";
import { DoctorSidebar } from "@/layout/doctor/sideBar";

import { useGetDoctorDataQuery } from "@/features/docotr/doctorApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { toast, ToastContainer } from "react-toastify";
import { useEditDoctorDataMutation } from "@/features/docotr/doctorApi";
import isEqual from "lodash.isequal";
import { useReApplyDataMutation } from "@/features/docotr/doctorApi";
import { doctorProfileSchema } from "@/validation/doctorProfileValidation";
import { z } from "zod";

interface Qualifications {
  degree?: string;
  institution?: string;
  specialization?: string;
  medicalSchool?: string;
  experince?: number | string;
  graduationYear?: number;
  fees?: number | string;
  lisence?: string;
  about?: string;
  educationCertificate?: File | string;
  experienceCertificate?: File | string;
}

interface DoctorData {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  DOB?: string;
  gender?: string;
  profile_img?: File | string;
  qualifications?: Qualifications;
  isApproved?: boolean;
  isRejected?: boolean;
}

export default function DoctorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const doctorId = useSelector((state: RootState) => state.doctor.doctor);
  const { data: doctor, refetch } = useGetDoctorDataQuery(doctorId?._id as string);
  const [formData, setFormData] = useState<DoctorData | null>(null);
  const [originalData, setOriginalData] = useState<DoctorData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editDoctorData, { isLoading: editLoading }] =
    useEditDoctorDataMutation();
  const [reApplyData, { isLoading }] = useReApplyDataMutation();

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
      setOriginalData(doctor);
    }
  }, [doctor]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const validateField = (fieldPath: string, value: string | number) => {
    try {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[fieldPath];
        return newErr;
      });

      if (fieldPath.includes("qualifications.")) {
        const field = fieldPath.split(".")[1];
        const qualificationsSchema = z.object({
          qualifications: z.object({
            [field]:
              doctorProfileSchema.shape.qualifications.shape[
                field as keyof typeof doctorProfileSchema.shape.qualifications.shape
              ],
          }),
        });
        qualificationsSchema.parse({
          qualifications: { [field]: value },
        });
      } else {
        const fieldSchema = z.object({
          [fieldPath]:
            doctorProfileSchema.shape[
              fieldPath as keyof typeof doctorProfileSchema.shape
            ],
        });
        fieldSchema.parse({ [fieldPath]: value });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const message = err.errors[0]?.message || "Invalid value";
        setErrors((prev) => ({ ...prev, [fieldPath]: message }));
      }
    }
  };

  const validateAllFields = (): boolean => {
    try {
      doctorProfileSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          const path = error.path.join(".");
          newErrors[path] = error.message;
        });
        setErrors(newErrors);
        toast.error("Please fix all validation errors");
        return false;
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    if (isEqual(formData, originalData)) {
      toast.info("No change detected");
      setIsEditing(false);
      return;
    }

    if (!validateAllFields()) {
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

      const res = await editDoctorData({
        doctorId: formData?._id,
        formData: fd,
      }).unwrap();
      toast.success(res?.msg);
      setIsEditing(false);
      setErrors({});
      refetch();
    } catch (error) {
      console.error(error);
      const err = error as { data?: { msg?: string } };
      toast.error(err?.data?.msg || "Doctor update error");
    }
  };

  const handleReApply = async () => {
    if (!formData) return;

    if (isEqual(formData, originalData)) {
      toast.info("No change detected");
      setIsEditing(false);
      return;
    }

    if (!validateAllFields()) {
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

      const res = await reApplyData({
        doctorId: formData?._id,
        formData: fd,
      }).unwrap();
      toast.success(res?.msg);
      setIsEditing(false);
      setErrors({});
      refetch();
    } catch (error) {
      console.error(error);
      const err = error as { data?: { msg?: string } };
      toast.error(err?.data?.msg || "Doctor update error");
    }
  };

  const getInitials = (name?: string): string => {
    if (!name) return "DR";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex">
      <DoctorSidebar />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>

          {!doctor?.isRejected ? (
            <div>
              {editLoading ? (
                <div>
                  <div className="animate-pulse space-y-3 p-2">
                    <div className="h-10 w-32 bg-gray-300 rounded-xl"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ) : (
                <div>
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
              )}
            </div>
          ) : (
            <div>
              {isLoading ? (
                <div>
                  <div className="animate-pulse space-y-3 p-2">
                    <div className="h-10 w-32 bg-gray-300 rounded-xl"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ) : (
                <div>
                  <Button
                    onClick={
                      isEditing ? handleReApply : () => setIsEditing(true)
                    }
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Submit
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Re Apply
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
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
                        : formData?.profile_img || undefined
                    }
                    alt="Doctor Profile"
                  />
                  <AvatarFallback className="text-2xl">
                    {getInitials(doctor?.name)}
                  </AvatarFallback>
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
                          setFormData((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  profile_img: file,
                                }
                              : null
                          );
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
              {!doctor?.isApproved ? (
                <Badge className="bg-red-100 text-red-800">Not verified</Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800">verified</Badge>
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
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData?.name || ""}
                    disabled={!isEditing}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) =>
                        prev
                          ? {
                              ...prev,
                              name: value,
                            }
                          : null
                      );
                      validateField("name", value);
                    }}
                    className={`${!isEditing ? "bg-gray-50" : ""} ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData?.email || ""}
                    disabled={!isEditing}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) =>
                        prev
                          ? {
                              ...prev,
                              email: value,
                            }
                          : null
                      );
                      validateField("email", value);
                    }}
                    className={`${!isEditing ? "bg-gray-50" : ""} ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData?.phone || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) =>
                        prev
                          ? {
                              ...prev,
                              phone: value,
                            }
                          : null
                      );
                      validateField("phone", value);
                    }}
                    disabled={!isEditing}
                    className={`${!isEditing ? "bg-gray-50" : ""} ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone}</p>
                  )}
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
                  id="specialization"
                  value={formData?.qualifications?.specialization || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) =>
                      prev && prev.qualifications
                        ? {
                            ...prev,
                            qualifications: {
                              ...prev.qualifications,
                              specialization: value,
                            },
                          }
                        : null
                    );
                    validateField("qualifications.specialization", value);
                  }}
                  disabled={!isEditing}
                  className={`${!isEditing ? "bg-gray-50" : ""} ${
                    errors["qualifications.specialization"]
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {errors["qualifications.specialization"] && (
                  <p className="text-xs text-red-500">
                    {errors["qualifications.specialization"]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData?.qualifications?.experince || ""}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? "" : Number(e.target.value);
                    setFormData((prev) =>
                      prev && prev.qualifications
                        ? {
                            ...prev,
                            qualifications: {
                              ...prev.qualifications,
                              experince: value,
                            },
                          }
                        : null
                    );
                    validateField("qualifications.experince", value);
                  }}
                  disabled={!isEditing}
                  className={`${!isEditing ? "bg-gray-50" : ""} ${
                    errors["qualifications.experince"] ? "border-red-500" : ""
                  }`}
                />
                {errors["qualifications.experince"] && (
                  <p className="text-xs text-red-500">
                    {errors["qualifications.experince"]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  value={formData?.qualifications?.lisence || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) =>
                      prev && prev.qualifications
                        ? {
                            ...prev,
                            qualifications: {
                              ...prev.qualifications,
                              lisence: value,
                            },
                          }
                        : null
                    );
                    validateField("qualifications.lisence", value);
                  }}
                  disabled={!isEditing}
                  className={`${!isEditing ? "bg-gray-50" : ""} ${
                    errors["qualifications.lisence"] ? "border-red-500" : ""
                  }`}
                />
                {errors["qualifications.lisence"] && (
                  <p className="text-xs text-red-500">
                    {errors["qualifications.lisence"]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fees">Consultation Fee</Label>
                <Input
                  id="fees"
                  type="number"
                  value={formData?.qualifications?.fees || ""}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? "" : Number(e.target.value);
                    setFormData((prev) =>
                      prev && prev.qualifications
                        ? {
                            ...prev,
                            qualifications: {
                              ...prev.qualifications,
                              fees: value,
                            },
                          }
                        : null
                    );
                    validateField("qualifications.fees", value);
                  }}
                  disabled={!isEditing}
                  className={`${!isEditing ? "bg-gray-50" : ""} ${
                    errors["qualifications.fees"] ? "border-red-500" : ""
                  }`}
                />
                {errors["qualifications.fees"] && (
                  <p className="text-xs text-red-500">
                    {errors["qualifications.fees"]}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                value={formData?.qualifications?.about || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) =>
                    prev && prev.qualifications
                      ? {
                          ...prev,
                          qualifications: {
                            ...prev.qualifications,
                            about: value,
                          },
                        }
                      : null
                  );
                  validateField("qualifications.about", value);
                }}
                disabled={!isEditing}
                className={`${!isEditing ? "bg-gray-50" : ""} ${
                  errors["qualifications.about"] ? "border-red-500" : ""
                }`}
              />
              {errors["qualifications.about"] && (
                <p className="text-xs text-red-500">
                  {errors["qualifications.about"]}
                </p>
              )}
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
                  <>
                    <Input
                      value={formData?.qualifications?.degree || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) =>
                          prev && prev.qualifications
                            ? {
                                ...prev,
                                qualifications: {
                                  ...prev.qualifications,
                                  degree: value,
                                },
                              }
                            : null
                        );
                        validateField("qualifications.degree", value);
                      }}
                      className={
                        errors["qualifications.degree"] ? "border-red-500" : ""
                      }
                    />
                    {errors["qualifications.degree"] && (
                      <p className="text-xs text-red-500">
                        {errors["qualifications.degree"]}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-medium">
                    Degree - {formData?.qualifications?.degree}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-sm">Medical School</Label>
                {isEditing ? (
                  <>
                    <Input
                      value={formData?.qualifications?.medicalSchool || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) =>
                          prev && prev.qualifications
                            ? {
                                ...prev,
                                qualifications: {
                                  ...prev.qualifications,
                                  medicalSchool: value,
                                },
                              }
                            : null
                        );
                        validateField("qualifications.medicalSchool", value);
                      }}
                      className={
                        errors["qualifications.medicalSchool"]
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors["qualifications.medicalSchool"] && (
                      <p className="text-xs text-red-500">
                        {errors["qualifications.medicalSchool"]}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-medium">
                    Medical School - {formData?.qualifications?.medicalSchool}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Institution</Label>
                {isEditing ? (
                  <>
                    <Input
                      value={formData?.qualifications?.institution || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) =>
                          prev && prev.qualifications
                            ? {
                                ...prev,
                                qualifications: {
                                  ...prev.qualifications,
                                  institution: value,
                                },
                              }
                            : null
                        );
                        validateField("qualifications.institution", value);
                      }}
                      className={
                        errors["qualifications.institution"]
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors["qualifications.institution"] && (
                      <p className="text-xs text-red-500">
                        {errors["qualifications.institution"]}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-medium">
                    Institution - {formData?.qualifications?.institution}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Specialization</Label>
                {isEditing ? (
                  <>
                    <Input
                      value={formData?.qualifications?.specialization || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) =>
                          prev && prev.qualifications
                            ? {
                                ...prev,
                                qualifications: {
                                  ...prev.qualifications,
                                  specialization: value,
                                },
                              }
                            : null
                        );
                        validateField("qualifications.specialization", value);
                      }}
                      className={
                        errors["qualifications.specialization"]
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors["qualifications.specialization"] && (
                      <p className="text-xs text-red-500">
                        {errors["qualifications.specialization"]}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-medium">
                    specialization - {formData?.qualifications?.specialization}
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

        <Card className="mt-6">
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
                  src={
                    typeof doctor?.qualifications?.experienceCertificate ===
                    "string"
                      ? doctor.qualifications.experienceCertificate
                      : undefined
                  }
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
                        setFormData((prev) =>
                          prev && prev.qualifications
                            ? {
                                ...prev,
                                qualifications: {
                                  ...prev.qualifications,
                                  experienceCertificate: file,
                                },
                              }
                            : null
                        );
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
                  src={
                    typeof doctor?.qualifications?.educationCertificate ===
                    "string"
                      ? doctor.qualifications.educationCertificate
                      : undefined
                  }
                  alt="Education Certificate"
                  className="w-48 h-auto rounded-lg border object-contain"
                />
                {isEditing && (
                  <Input
                    id="educationCertificate"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData((prev) =>
                          prev && prev.qualifications
                            ? {
                                ...prev,
                                qualifications: {
                                  ...prev.qualifications,
                                  educationCertificate: file,
                                },
                              }
                            : null
                        );
                      }
                    }}
                  />
                )}
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
                {doctor?.qualifications?.experince || 0}
              </div>
              <p className="text-sm text-gray-600">Years Experience</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastContainer autoClose={2000} />
    </div>
  );
}
