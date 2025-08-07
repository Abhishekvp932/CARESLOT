import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditDoctorDataMutation, useGetEditDoctorDataQuery } from "@/features/admin/adminApi";
import { toast, ToastContainer } from "react-toastify";
import EditDoctorTabs from '@/components/common/Doctor/EditDoctorTabs'
import SaveCancelButtons from "@/components/common/Doctor/SaveCancelButtons";
import QualificationSection from "@/components/common/Doctor/QualificationSection";
import PersonalInfoSection from "@/components/common/Doctor/PersonalInfoSection";
import isEqual from "lodash.isequal";
const DoctorEditProfile = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const { doctorId } = useParams<{ doctorId: string }>();
  const { data: doctor } = useGetEditDoctorDataQuery(doctorId);
  const [formData, setFormData] = useState<typeof doctor | null>(null);
  const [original,setOriginal] = useState<typeof doctor | null>(null);
  const [editDoctorData] = useEditDoctorDataMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (doctor){
      setFormData(doctor)
      setOriginal(doctor);
    };
  }, [doctor]);

  const handleInputChange = (field: string, value: any, isQualification = false) => {
    setFormData((prev: any) => {
      if (!prev) return prev;
      if (isQualification) {
        return {
          ...prev,
          qualifications: {
            ...prev.qualifications,
            [field]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

const handleSave = async () => {
  if (!formData || !doctorId) return;
   if(isEqual(formData,original)){
    toast.info('No change detected');
    setTimeout(()=>{
      navigate(-1);
    },1000);
    return;
   }
  try {
    const fd = new FormData();

  
    fd.append("name", formData.name || "");
    fd.append("email", formData.email || "");
    fd.append("phone", formData.phone || "");
    fd.append("DOB", formData.DOB || "");
    fd.append("gender", formData.gender || "");

    if (formData.profileImage instanceof File) {
      fd.append("profileImage", formData.profileImage);
    }

    const q = formData.qualifications || {};
    fd.append("degree", q.degree || "");
    fd.append("institution", q.institution || "");
    fd.append("specialization", q.specialization || "");
    fd.append("medicalSchool", q.medicalSchool || "");
    fd.append("experince", q.experince?.toString() || "");
    fd.append("graduationYear", q.graduationYear?.toString() || "");
    fd.append("fees", q.fees?.toString() || "");
    fd.append("license", q.license || "");
    fd.append("about", q.about || "");


    if (
      q.educationCertificate instanceof File ||
      (typeof q.educationCertificate === "string" && q.educationCertificate.trim())
    ) {
      fd.append("educationCertificate", q.educationCertificate);
    }

    if (
      q.experienceCertificate instanceof File ||
      (typeof q.experienceCertificate === "string" && q.experienceCertificate.trim())
    ) {
      fd.append("experienceCertificate", q.experienceCertificate);
    }

    const res = await editDoctorData({ formData: fd, doctorId }).unwrap();
    toast.success(res?.msg);
    setTimeout(() => navigate(-1), 1000);
  } catch (error: any) {
    console.error(error);
    toast.error(error?.data?.msg || "Doctor update error");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Edit Doctor Profile</h1>
        <p className="text-gray-600 text-center mb-8">Update doctor personal Information</p>

        <EditDoctorTabs activeSection={activeSection} setActiveSection={setActiveSection} />

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {activeSection === "personal" && (
            <PersonalInfoSection formData={formData} onChange={handleInputChange} />
          )}
          {activeSection === "qualifications" && (
            <QualificationSection formData={formData} onChange={handleInputChange} />
          )}
          <SaveCancelButtons onSave={handleSave} />
        </div>
      </div>
      <ToastContainer autoClose={200} />
    </div>
  );
};

export default DoctorEditProfile;
