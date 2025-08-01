import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddDoctorMutation } from "@/features/admin/adminApi";
import { toast, ToastContainer } from "react-toastify";
import EditDoctorTabs from "@/components/common/Doctor/EditDoctorTabs";
import SaveCancelButtons from "@/components/common/Doctor/SaveCancelButtons";
import QualificationSection from "@/components/common/Doctor/QualificationSection";
import PersonalInfoSection from "@/components/common/Doctor/PersonalInfoSection";

const AddDoctorPage = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [addDoctor] = useAddDoctorMutation();
  const navigate = useNavigate();
type DoctorFormData = {
  name: string;
  email: string;
  phone: string;
  DOB: string;
  gender: string;
  profileImage: File | null;
  qualifications: {
    degree: string;
    institution: string;
    specialization: string;
    medicalSchool: string;
    experince: number;
    graduationYear: number;
    fees: number;
    license: string;
    about: string;
    educationCertificate: File | null;
    experienceCertificate: File | null;
  };
};

  const [formData, setFormData] = useState<DoctorFormData>({
    name: "",
    email: "",
    phone: "",
    DOB: "",
    gender: "",
    profileImage: null,
    qualifications: {
      degree: "",
      institution: "",
      specialization: "",
      medicalSchool: "",
      experince: 0,
      graduationYear: 0,
      fees: 0,
      license: "",
      about: "",
      educationCertificate: null,
      experienceCertificate: null,
    },
  });

  const handleInputChange = (
    field: string,
    value: any,
    isQualification = false
  ) => {
    setFormData((prev) => {
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
    try {
      const fd = new FormData();
    
      
      fd.append("name", formData.name || "");
      fd.append("email", formData.email || "");
      fd.append("phone", formData.phone || "");
      fd.append("DOB", formData.DOB || "");
      fd.append("gender", formData.gender || "");

      if (formData?.profileImage instanceof File) {
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

      if (q?.educationCertificate instanceof File) {
        fd.append("educationCertificate", q.educationCertificate);
      }

      if (q?.experienceCertificate instanceof File) {
        fd.append("experienceCertificate", q.experienceCertificate);
      }

      const res = await addDoctor({ formData: fd }).unwrap();
      toast.success(res?.msg);
      setTimeout(() => navigate("/admin/doctors"), 1000);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          Add Doctor Profile
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter new doctor’s information
        </p>

        <EditDoctorTabs
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {activeSection === "personal" && (
            <PersonalInfoSection
              formData={formData}
              onChange={handleInputChange}
            />
          )}
          {activeSection === "qualifications" && (
            <QualificationSection
              formData={formData}
              onChange={handleInputChange}
            />
          )}
          <SaveCancelButtons onSave={handleSave} />
        </div>
      </div>
      <ToastContainer autoClose={200} />
    </div>
  );
};

export default AddDoctorPage;
