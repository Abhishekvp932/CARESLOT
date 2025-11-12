import { api } from "@/app/api";
import { API_ROUTES } from "@/constants/apiRoutes";

export const doctorApi = api.injectEndpoints({
  endpoints: (builder) => ({
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
          lisence,
          profileImage,
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
        formData.append("lisence", lisence);
        formData.append("educationCertificate", educationCertificate[0]);
        formData.append("experienceCertificate", experienceCertificate[0]);
        formData.append("profileImage", profileImage[0]);
        return {
          url: API_ROUTES.DOCTOR.KYC_SUBMIT(doctorId),
          method: "POST",
          body: formData,
        };
      },
    }),
    getDoctorData: builder.query({
      query: (doctorId: string) => ({
        url: API_ROUTES.DOCTOR.PROFILE(doctorId),
        method: "GET",
      }),
      transformResponse: (response) => response.doctor,
    }),
    editDoctorData: builder.mutation({
      query: ({ doctorId, formData }) => ({
        url: API_ROUTES.DOCTOR.PROFILE(doctorId),
        method: "PUT",
        body: formData,
      }),
    }),
    slotAdd: builder.mutation({
      query: ({ data }) => ({
        url: API_ROUTES.SLOT.ADD,
        method: "POST",
        body: data,
      }),
    }),
    getDoctorSlots: builder.query({
      query: (doctorId: string) => ({
        url: API_ROUTES.SLOT.GET_BY_DOCTOR(doctorId),
        method: "GET",
      }),
    }),
    deleteSlot: builder.mutation({
      query: (slotId: string) => ({
        url: API_ROUTES.SLOT.DELETE(slotId),
        method: "DELETE",
      }),
    }),
    reApplyData: builder.mutation({
      query: ({ doctorId, formData }) => ({
        url: API_ROUTES.DOCTOR.RE_APPLY(doctorId),
        method: "PUT",
        body: formData,
      }),
    }),
    getAllAppoinments: builder.query({
      query: ({ doctorId, page, limit, status }) => ({
        url: API_ROUTES.DOCTOR.APPOINTMENTS(doctorId, page, limit, status),
        method: "GET",
      }),
    }),
    getDoctorWallet: builder.query({
      query: ({ doctorId }) => ({
        url: API_ROUTES.WALLET.DOCTOR(doctorId),
        method: "GET",
      }),
    }),
    getDoctorDashboardData: builder.query({
      query: ({ doctorId, period }) => ({
        url: API_ROUTES.DOCTOR.GET_DASHBOARD_DATA(doctorId, period),
        method: "GET",
      }),
    }),
    createPrescription: builder.mutation({
      query: (data) => ({
        url: API_ROUTES.PRESCRIPTION.CREATE,
        method: "POST",
        body: data,
      }),
    }),
    changeAppoinmentStatus: builder.mutation({
      query: (appoinmentId: string) => ({
        url: API_ROUTES.APPOINTMENT.CHANGE_STATUS(appoinmentId),
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useKycSubmitMutation,
  useGetDoctorDataQuery,
  useEditDoctorDataMutation,
  useSlotAddMutation,
  useGetDoctorSlotsQuery,
  useDeleteSlotMutation,
  useReApplyDataMutation,
  useGetAllAppoinmentsQuery,
  useGetDoctorWalletQuery,
  useGetDoctorDashboardDataQuery,
  useCreatePrescriptionMutation,
  useChangeAppoinmentStatusMutation,
} = doctorApi;
