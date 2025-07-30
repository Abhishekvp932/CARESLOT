// components/doctor/QualificationSection.tsx
import React from "react";
import { Award, FileText, DollarSign, Shield } from "lucide-react";

interface Props {
  formData: any;
  onChange: (field: string, value: any, isQualification?: boolean) => void;
}

const getFileLabel = (file: any) => {
  if (!file) return "";
  return typeof file === "string" ? file.split("/").pop() : file.name;
};

const QualificationSection: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Award className="mr-3 text-blue-500" />
        Professional Qualifications
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { label: "Degree", field: "degree", placeholder: "e.g., MD, MBBS" },
          {
            label: "Institution",
            field: "institution",
            placeholder: "Institution name",
          },
          {
            label: "Specialization",
            field: "specialization",
            placeholder: "e.g., Cardiology",
          },
          {
            label: "Medical School",
            field: "medicalSchool",
            placeholder: "Medical school name",
          },
        ].map(({ label, field, placeholder }) => (
          <div key={field} className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              {label}
            </label>
            <input
              type="text"
              value={formData?.qualifications?.[field] || ""}
              onChange={(e) => onChange(field, e.target.value, true)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={placeholder}
            />
          </div>
        ))}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Years of Experience
          </label>
          <input
            type="number"
            value={formData?.qualifications?.experince || ""}
            onChange={(e) =>
              onChange("experince", parseInt(e.target.value), true)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Years of experience"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Graduation Year
          </label>
          <input
            type="number"
            value={formData?.qualifications?.graduationYear || ""}
            onChange={(e) =>
              onChange("graduationYear", parseInt(e.target.value), true)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Graduation year"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
            Consultation Fees
          </label>
          <input
            type="text"
            value={formData?.qualifications?.fees || ""}
            onChange={(e) => onChange("fees", e.target.value, true)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Consultation fees"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-blue-500" />
            Medical License
          </label>
          <input
            type="text"
            value={formData?.qualifications?.lisence || ""}
            onChange={(e) => onChange("license", e.target.value, true)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="License number"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-blue-500" />
            About
          </label>
          <textarea
            value={formData?.qualifications?.about || ""}
            onChange={(e) => onChange("about", e.target.value, true)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Tell something about your experience, approach to healthcare..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Education Certificate
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              onChange("educationCertificate", e.target.files?.[0], true)
            }
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData?.qualifications?.educationCertificate && (
            <p className="text-xs text-green-600">
              Selected:{" "}
              {getFileLabel(formData.qualifications.educationCertificate)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Experience Certificate
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              onChange("experienceCertificate", e.target.files?.[0], true)
            }
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData?.qualifications?.experienceCertificate && (
            <p className="text-xs text-green-600">
              Selected:{" "}
              {getFileLabel(formData.qualifications.experienceCertificate)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualificationSection;
