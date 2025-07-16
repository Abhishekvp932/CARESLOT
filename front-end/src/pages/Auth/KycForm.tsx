
import { kyc_schema } from "@/validation/kyc.schema";
import React, {useState,useEffect} from "react";
import { InputField } from "@/components/common/InputField";
import z from "zod";
import { useKycSubmitMutation } from "@/features/docotr/doctorApi";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import {updateDoctorInfo,setKycStatus} from "@/features/docotr/doctorSlice";
import { useNavigate } from "react-router-dom";
import { SubmitButton } from "@/components/common/SubmitButton";
import {
  Award,
  Stethoscope,
  GraduationCap,
  Upload,
  FileImage,
} from "lucide-react";
import { toast,ToastContainer } from "react-toastify";

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
});

const [errors,setErrors] = useState<Partial<Record<keyof formType,string>>>({})
const {doctor} = useSelector((state:RootState)=> state.doctor)
const dispatch = useDispatch();
console.log('doctor id',doctor);

useEffect(()=>{
  if(!doctor){
    navigate('/login');
  }
},[]);

const navigate = useNavigate()  

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
const [kycSubmit,{isLoading}] = useKycSubmitMutation()

const handleSubmit = async(e:React.FormEvent)=>{
   e.preventDefault()

   if(!validation()) return;

   try {
    const res = await kycSubmit({doctorId:doctor,...form,fees : form.fees ?? "",educationCertificate: form.educationCertificate!,experienceCertificate: form.experienceCertificate!}).unwrap()
      dispatch(updateDoctorInfo(res.doctor))
      console.log('doctor details',res);
      dispatch(setKycStatus(true))
      toast.success(res.msg)
      navigate('/kyc-success');
   } catch (error) {
    console.log('form submiting error',error);
    toast.error('document upload error')
   }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Stethoscope className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Doctor Excellence Awards
            </h1>
            <p className="text-xl text-gray-600">
              For Your Consideration Submission Form
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white text-center py-8 px-6">
            <h2 className="text-3xl font-bold mb-2">Submit Your Nomination</h2>
            <p className="text-lg text-blue-100">
              Showcase your medical excellence and contributions to healthcare
            </p>
          </div>
          
          <div className="px-8 py-8">
            <div className="space-y-10">
               <form action="" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-blue-100">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Qualification Information
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <InputField
                      label="Degree"
                      name="degree"
                      type="text"
                      placeholder="e.g. MBBS, MD"
                      value={form.degree}
                      onChange={(e)=> setForm({...form,degree:e.target.value})}
                    />
                     {errors && <p className="errors">{errors.degree}</p>}
                  </div>

                  <div className="space-y-3">
                    <InputField
                      label="institution"
                      name="institution"
                      type="text"
                      placeholder="e.g. AIIMS Delhi"
                      value={form.institution}
                      onChange={(e)=> setForm({...form,institution:e.target.value})}
                    />
                    {errors && <p className="errors">{errors.institution}</p>}
                  </div>

                  <div className="space-y-3">
                    <InputField
                      label="Years of Experience "
                      name="experience"
                      type="number"
                      placeholder="e.g. 2"
                     onChange={(e) => {
                      const value = e.target.value;
                      setForm({
                        ...form,
                        experience: value === '' ? 0 : Number(value),
                      });
                    }}
                    />
                     {errors && <p className="errors">{errors.experience}</p>}
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="specialization"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Specialization *
                    </label>
                    <select
                      id="specialization"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"

                      value={form.specialization}
                      onChange={(e)=> setForm({...form,specialization:e.target.value})}
                    >
                      <option value="">Select specialization</option>
                      {specialties.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                     {errors && <p className="errors">{errors.specialization}</p>}
                  </div>

                  <div className="space-y-3">
                    <InputField
                      label="medicalSchool"
                      name="medicalSchool"
                      type="text"
                      value={form.medicalSchool}
                      onChange={(e)=> setForm({...form,medicalSchool:e.target.value})}
                      placeholder="e.g. Harvard Medical School"
                    />
                     {errors && <p className="errors">{errors.medicalSchool}</p>}
                  </div>

                  <div className="space-y-3">

                    <InputField
                     label="Graduation Year"
                     name="graduationYear"
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm({
                        ...form,
                        graduationYear: value === '' ? 0 : Number(value),
                      });
                    }}
                    placeholder="e.g. 2020"
                    />
                     {errors && <p className="errors">{errors.graduationYear}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="about"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    About Yourself *
                  </label>
                  <textarea
                    id="about"
                    rows={4}
                    placeholder="Tell us about yourself, your mission, achievements, and your journey in medicine..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none"
                    value={form.about}
                    onChange={(e)=> setForm({...form,about:e.target.value})}
                  />
                   {errors && <p className="errors">{errors.about}</p>}
                </div>

                <div className="space-y-3">
                  <InputField
                    label="Consultation Fees"
                    name="fees"
                    type="text"
                    placeholder="e.g. ₹500"
                    value={form.fees}
                    onChange={(e)=> setForm({...form,fees:e.target.value})}
                  />
                   {errors && <p className="errors">{errors.fees}</p>}
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-blue-100">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileImage className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Education Certificates
                  </h3>
                </div>

                <div className="border-3 border-dashed border-blue-200 rounded-xl p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <label
                      htmlFor="educationCertificate"
                      className="cursor-pointer block text-lg font-semibold text-gray-700 mb-2"
                    >
                      Upload Education Certificate
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      PNG, JPG, PDF up to 10MB
                    </p>
                    <InputField
                      label="Upload Education Certificate"
                      name="educationCertificate"
                      type="file"
                      onChange={(e) =>
                        setForm({ ...form, educationCertificate: e.target.files || undefined })
                      }
                    />
                     {errors && <p className="errors">{errors.educationCertificate}</p>}
                    <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Choose File
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-green-100">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <FileImage className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Experience Certificates
                  </h3>
                </div>

                <div className="border-3 border-dashed border-green-200 rounded-xl p-8 hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 cursor-pointer group">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                      <Upload className="h-8 w-8 text-green-600" />
                    </div>
                    <label
                      htmlFor="experienceCertificate"
                      className="cursor-pointer block text-lg font-semibold text-gray-700 mb-2"
                    >
                      Upload Experience Certificate
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      PNG, JPG, PDF up to 10MB
                    </p>
                    <InputField
                      label="Upload Experience Certificate"
                      name="experienceCertificate"
                      type="file"
                      onChange={(e) =>
                        setForm({ ...form, experienceCertificate: e.target.files || undefined })
                      }
                    />
                     {errors && <p className="errors">{errors.experienceCertificate
                      }</p>}
                    <div className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Choose File
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <SubmitButton label="Submit Document" isLoading = {isLoading}/>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose = {2000}/>
    </div>
  );
};

export default KYC;
