import { IDoctor } from "../interface/IDoctor";

import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema<IDoctor>(
  {
    email: {
      type: String,
      required: false,
      unique: true,
    },
    name: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    profile_img: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: false,
      default: "male",
    },
    DOB: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["doctors"],
      default: "doctors",
    },
    qualifications: {
      degree: { type: String },
      institution: { type: String },
      experince: { type: Number },
      educationCertificate: { type: String,required:false},
      experienceCertificate: { type: String,required: false},
      graduationYear: { type: Number },
      specialization: { type: String },
      medicalSchool: { type: String },
      about: { type: String },
      fees: {type: Number},
      lisence:{type:String}
    },
    otp: {
      type: String,
    },
    otpExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model<IDoctor>("Doctor", doctorSchema);
export default Doctor;
