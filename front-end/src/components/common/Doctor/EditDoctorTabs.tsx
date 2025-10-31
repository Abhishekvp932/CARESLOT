// components/doctor/EditDoctorTabs.tsx
import { User, Award } from "lucide-react";

interface Props {
  activeSection: string;
  setActiveSection: (value: string) => void;
}

export default function EditDoctorTabs({ activeSection, setActiveSection }: Props) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-full p-1 shadow-lg border">
        <button
          onClick={() => setActiveSection("personal")}
          className={`px-6 py-2 rounded-full transition-all duration-300 ${
            activeSection === "personal"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          <User className="inline w-4 h-4 mr-2" />
          Personal Info
        </button>

        <button
          onClick={() => setActiveSection("qualifications")}
          className={`px-6 py-2 rounded-full transition-all duration-300 ${
            activeSection === "qualifications"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          <Award className="inline w-4 h-4 mr-2" />
          Qualifications
        </button>
      </div>
    </div>
  );
}
