import { kyc_schema } from "@/validation/kyc.schema";
import React, { useState, useEffect } from "react";
import { InputField } from "@/components/common/InputField";
import z from "zod";
import { useKycSubmitMutation } from "@/features/docotr/doctorApi";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { updateDoctorInfo, setKycStatus } from "@/features/docotr/doctorSlice";
import { useNavigate } from "react-router-dom";
import { SubmitButton } from "@/components/common/SubmitButton";
import {
  Award,
  Stethoscope,
  GraduationCap,
  Upload,
  FileImage,
  CheckCircle2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const KYC = () => {
  const specialties = [
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Family Medicine",
    "Internal Medicine",
    "Neurology",
    "Obstetrics & Gynecology",
    "Oncology",
    "Orthopedic Surgery",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Surgery",
  ];

  type formType = {
    degree: string;
    institution: string;
    experience: number;
    specialization: string;
    medicalSchool: string;
    graduationYear: number;
    about: string;
    fees?: string;
    educationCertificate?: FileList;
    experienceCertificate?: FileList;
    profileImage?: FileList;
    lisence: string;
  };

  const [form, setForm] = useState<formType>({
    degree: "",
    institution: "",
    experience: 0,
    specialization: "",
    medicalSchool: "",
    graduationYear: new Date().getFullYear(),
    about: "",
    fees: "",
    educationCertificate: undefined,
    experienceCertificate: undefined,
    profileImage: undefined,
    lisence: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof formType, string>>>(
    {}
  );
  const { doctor } = useSelector((state: RootState) => state.doctor);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!doctor) {
      navigate("/login");
    }
  }, []);

  const navigate = useNavigate();

  const validation = () => {
    try {
      kyc_schema.parse(form);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.path[0]]: curr.message,
          }),
          {}
        );
        setErrors(formattedErrors);
      }
      return false;
    }
  };
  const [kycSubmit, { isLoading }] = useKycSubmitMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validation()) return;

    try {
      const res = await kycSubmit({
        doctorId: doctor,
        ...form,
        fees: form.fees ?? "",
        educationCertificate: form.educationCertificate!,
        experienceCertificate: form.experienceCertificate!,
        profileImage: form.profileImage!,
      }).unwrap();
      dispatch(updateDoctorInfo(res.doctor));

      dispatch(setKycStatus(true));
      toast.success(res.msg);
      navigate("/kyc-success");
    } catch (error) {
      toast.error("document upload error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
          }}
        ></div>

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10 text-white" />
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Stethoscope className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Professional Verification
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Complete your profile to join our network of verified healthcare
              professionals
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 pb-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="space-y-10">
              <form action="" onSubmit={handleSubmit}>
                <div className="space-y-8">
                  {/* Profile Image Section */}
                  <div className="text-center pb-6 border-b-2 border-gray-100">
                    <InputField
                      label=""
                      name="profileImage"
                      type="file"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          profileImage: e.target.files || undefined,
                        })
                      }
                      className="hidden"
                    />
                    {errors && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.profileImage}
                      </p>
                    )}

                    <div className="inline-block">
                      {form.profileImage &&
                      typeof form.profileImage !== "string" ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(form.profileImage[0])}
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-xl"
                          />
                          <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 shadow-lg">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-indigo-200 flex items-center justify-center shadow-xl">
                          <Upload className="h-12 w-12 text-indigo-400" />
                        </div>
                      )}
                      <p className="mt-4 text-sm font-medium text-gray-600">
                        Profile Photo
                      </p>
                    </div>
                  </div>

                  {/* Qualification Information Section */}
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-indigo-100">
                    <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                      <GraduationCap className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Professional Credentials
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <InputField
                        label="Medical Degree"
                        name="degree"
                        type="text"
                        placeholder="e.g. MBBS, MD"
                        value={form.degree}
                        onChange={(e) =>
                          setForm({ ...form, degree: e.target.value })
                        }
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white hover:border-gray-300"
                      />
                      {errors && (
                        <p className="text-red-500 text-sm">{errors.degree}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <InputField
                        label="Institution"
                        name="institution"
                        type="text"
                        placeholder="e.g. AIIMS Delhi"
                        value={form.institution}
                        onChange={(e) =>
                          setForm({ ...form, institution: e.target.value })
                        }
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white hover:border-gray-300"
                      />
                      {errors && (
                        <p className="text-red-500 text-sm">
                          {errors.institution}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <InputField
                        label="License Number"
                        name="lisence"
                        type="text"
                        placeholder="Medical License Number"
                        value={form.lisence}
                        onChange={(e) =>
                          setForm({ ...form, lisence: e.target.value })
                        }
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white hover:border-gray-300"
                      />
                      {errors && (
                        <p className="text-red-500 text-sm">{errors.lisence}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <InputField
                        label="Years of Experience"
                        name="experience"
                        type="number"
                        placeholder="e.g. 5"
                        onChange={(e) => {
                          const value = e.target.value;
                          setForm({
                            ...form,
                            experience: value === "" ? 0 : Number(value),
                          });
                        }}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white hover:border-gray-300"
                      />
                      {errors && (
                        <p className="text-red-500 text-sm">
                          {errors.experience}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="specialization"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Specialization *
                      </label>
                      <select
                        id="specialization"
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white hover:border-gray-300"
                        value={form.specialization}
                        onChange={(e) =>
                          setForm({ ...form, specialization: e.target.value })
                        }
                      >
                        <option value="">Select your specialization</option>
                        {specialties.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {errors && (
                        <p className="text-red-500 text-sm">
                          {errors.specialization}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <InputField
                        label="Medical School"
                        name="medicalSchool"
                        type="text"
                        value={form.medicalSchool}
                        onChange={(e) =>
                          setForm({ ...form, medicalSchool: e.target.value })
                        }
                        placeholder="e.g. Harvard Medical School"
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white hover:border-gray-300"
                      />
                      {errors && (
                        <p className="text-red-500 text-sm">
                          {errors.medicalSchool}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <InputField
                        label="Graduation Year"
                        name="graduationYear"
                        type="number"
                        onChange={(e) => {
                          const value = e.target.value;
                          setForm({
                            ...form,
                            graduationYear: value === "" ? 0 : Number(value),
                          });
                        }}
                        placeholder="e.g. 2020"
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white hover:border-gray-300"
                      />
                      {errors && (
                        <p className="text-red-500 text-sm">
                          {errors.graduationYear}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <InputField
                        label="Consultation Fees"
                        name="fees"
                        type="text"
                        placeholder="e.g. ₹500"
                        value={form.fees}
                        onChange={(e) =>
                          setForm({ ...form, fees: e.target.value })
                        }
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white hover:border-gray-300"
                      />
                      {errors && (
                        <p className="text-red-500 text-sm">{errors.fees}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="about"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      About Yourself *
                    </label>
                    <textarea
                      id="about"
                      rows={5}
                      placeholder="Share your journey, achievements, and approach to patient care..."
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white hover:border-gray-300 resize-none"
                      value={form.about}
                      onChange={(e) =>
                        setForm({ ...form, about: e.target.value })
                      }
                    />
                    {errors && (
                      <p className="text-red-500 text-sm">{errors.about}</p>
                    )}
                  </div>
                </div>

                {/* Education Certificate Section */}
                <div className="space-y-6 mt-10">
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-200">
                    <div className="p-2.5 bg-blue-100 rounded-xl">
                      <FileImage className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Education Certificate
                    </h3>
                  </div>

                  <div className="border-2 border-dashed border-blue-300 rounded-2xl p-10 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group">
                    <div className="text-center">
                      <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        {form.educationCertificate ? (
                          <CheckCircle2 className="h-10 w-10 text-green-600" />
                        ) : (
                          <Upload className="h-10 w-10 text-blue-600" />
                        )}
                      </div>
                      <label
                        htmlFor="educationCertificate"
                        className="cursor-pointer block text-lg font-semibold text-gray-700 mb-2"
                      >
                        {form.educationCertificate
                          ? form.educationCertificate[0]?.name
                          : "Upload Education Certificate"}
                      </label>
                      <p className="text-sm text-gray-500 mb-4">
                        PDF, JPG, PNG up to 10MB
                      </p>
                      <InputField
                        label=""
                        name="educationCertificate"
                        type="file"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            educationCertificate: e.target.files || undefined,
                          })
                        }
                        className="hidden"
                      />
                      {errors && (
                        <p className="text-red-500 text-sm">
                          {errors.educationCertificate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Experience Certificate Section */}
                <div className="space-y-6 mt-10">
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-purple-200">
                    <div className="p-2.5 bg-purple-100 rounded-xl">
                      <FileImage className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Experience Certificate
                    </h3>
                  </div>

                  <div className="border-2 border-dashed border-purple-300 rounded-2xl p-10 hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-300 cursor-pointer group">
                    <div className="text-center">
                      <div className="mx-auto h-20 w-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        {form.experienceCertificate ? (
                          <CheckCircle2 className="h-10 w-10 text-green-600" />
                        ) : (
                          <Upload className="h-10 w-10 text-purple-600" />
                        )}
                      </div>
                      <label
                        htmlFor="experienceCertificate"
                        className="cursor-pointer block text-lg font-semibold text-gray-700 mb-2"
                      >
                        {form.experienceCertificate
                          ? form.experienceCertificate[0]?.name
                          : "Upload Experience Certificate"}
                      </label>
                      <p className="text-sm text-gray-500 mb-4">
                        PDF, JPG, PNG up to 10MB
                      </p>
                      <InputField
                        label=""
                        name="experienceCertificate"
                        type="file"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            experienceCertificate: e.target.files || undefined,
                          })
                        }
                        className="hidden"
                      />
                      {errors && (
                        <p className="text-red-500 text-sm">
                          {errors.experienceCertificate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-gray-200">
                  <SubmitButton label="Submit for Verification" isLoading={isLoading} />
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Your information will be reviewed within 24-48 hours
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default KYC;