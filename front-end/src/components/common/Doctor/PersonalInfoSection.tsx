import React from "react";
import { Calendar, Camera, Mail, Phone, User } from "lucide-react";

interface Props {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const PersonalInfoSection: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <User className="mr-3 text-blue-500" />
        Personal Information
      </h2>

      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
            {formData?.profileImage instanceof File ? (
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="Preview"
                className="w-full h-full rounded-full object-cover"
              />
            ) : formData?.profile_img ? (
              <img
                src={formData.profile_img}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              formData?.name?.[0] || "?"
            )}
          </div>

          {/* File input */}
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
            <Camera className="w-4 h-4 text-blue-500" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange("profileImage", file);
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <User className="w-4 h-4 mr-2 text-blue-500" />
            Full Name
          </label>
          <input
            type="text"
            value={formData?.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-blue-500" />
            Email Address
          </label>
          <input
            type="email"
            value={formData?.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-blue-500" />
            Phone Number
          </label>
          <input
            type="tel"
            value={formData?.phone || ""}
            onChange={(e) => onChange("phone", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
        </div>

        {/* DOB */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            Date of Birth
          </label>
          <input
            type="date"
            value={formData?.DOB?.split("T")[0] || ""}
            onChange={(e) => onChange("DOB", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-gray-700">Gender</label>
          <div className="flex space-x-4">
            {["male", "female", "others"].map((gender) => (
              <label
                key={gender}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData?.gender === gender}
                  onChange={(e) => onChange("gender", e.target.value)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700 capitalize">{gender}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
