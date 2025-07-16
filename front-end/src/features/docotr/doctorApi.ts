import { api } from "@/app/api";

export const doctorApi = api.injectEndpoints({
    endpoints : (builder) =>({
 kycSubmit: builder.mutation({
  query: (payload) => {
    const {
      doctorId,
      degree,
      institution,
      experience,
      specialization,
      medicalSchool,
      graduationYear,
      about,
      fees,
      educationCertificate,
      experienceCertificate,
    } = payload;

    const formData = new FormData();
    formData.append("degree", degree);
    formData.append("institution", institution);
    formData.append("experience", experience.toString());
    formData.append("specialization", specialization);
    formData.append("medicalSchool", medicalSchool);
    formData.append("graduationYear", graduationYear.toString());
    formData.append("about", about);
    formData.append("fees", fees ?? "");

    formData.append("educationCertificate", educationCertificate[0]);
    formData.append("experienceCertificate", experienceCertificate[0]);

    return {
      url: `/doctor/kycSubmit/${doctorId}`,
      method: "POST",
      body: formData,
    };
  },
}),


    })
})


export const {
    useKycSubmitMutation
} = doctorApi