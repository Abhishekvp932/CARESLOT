import { api } from "@/app/api";
import { API_ROUTES } from "@/constants/apiRoutes";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getResendAppoinments: builder.query({
      query: ({ patientId }) => ({
        url: API_ROUTES.PATIENT.RESEND_APPOINTMENT(patientId),
        method: "GET",
      }),
    }),
    updateUserData: builder.mutation({
      query: ({ formData, userId }) => ({
        url: API_ROUTES.PATIENT.PROFILE(userId),
        method: "PUT",
        body: formData,
      }),
    }),
    getUserData: builder.query({
      query: (patientId) => ({
        url: API_ROUTES.PATIENT.PROFILE(patientId),
        method: "GET",
      }),
      transformResponse: (response) => response.users,
    }),
    getAllApprovedDoctors: builder.query({
      query: ({ page, limit, search, specialty, sortBy }) => ({
        url: API_ROUTES.PATIENT.DOCTORS(page, limit, search, specialty, sortBy),
        method: "GET",
      }),
    }),
    getDoctorDetailPage: builder.query({
      query: (doctorId) => ({
        url: API_ROUTES.PATIENT.DOCTOR_DETAILS(doctorId),
        method: "GET",
      }),
      transformResponse: (response) => {
        console.log("response", response.doctor);
        return response.doctor;
      },
    }),
    getDoctorSlot: builder.query({
      query: (doctorId) => ({
        url: API_ROUTES.PATIENT.DOCTOR_DETAILS(doctorId),
      }),
    }),
    getSlots: builder.query({
      query: ({ doctorId, date }) => ({
        url: API_ROUTES.PATIENT.GET_SLOTS(doctorId, date),
      }),
      transformResponse: (response) => response.slots,
    }),
    getAllSpecializations: builder.query({
      query: () => ({
        url: API_ROUTES.PATIENT.SPECIALIZATIONS,
        method: "GET",
      }),
      transformResponse: (response) => response.specializations,
    }),
    getDoctorAndSlot: builder.query({
      query: ({ doctorId }) => ({
        url: API_ROUTES.PATIENT.CHECKOUT(doctorId),
        method: "GET",
      }),
    }),
    getRelatedDoctor: builder.query({
      query: ({ doctorId, specialization }) => ({
        url: API_ROUTES.PATIENT.RELATED_DOCTORS(doctorId, specialization),
        method: "GET",
      }),
    }),
    changePassword: builder.mutation({
      query: ({ formData, userId }) => ({
        url: API_ROUTES.PATIENT.CHANGE_PASSWORD(userId),
        method: "PATCH",
        body: formData,
      }),
    }),
    bookAppoinment: builder.mutation({
      query: ({ data }) => ({
        url: API_ROUTES.APPOINTMENT.CREATE,
        method: "POST",
        body: data,
      }),
    }),
    chatBoat: builder.mutation({
      query: (message) => ({
        url: API_ROUTES.CHATBOT.MESSAGE,
        method: "POST",
        body: { message },
      }),
    }),
    getUserNotification: builder.query({
      query: ({ patientId }) => ({
        url: API_ROUTES.NOTIFICATION.GET_ALL(patientId),
        method: "GET",
      }),
    }),
    notificationUnread: builder.mutation({
      query: (notificationId) => ({
        url: API_ROUTES.NOTIFICATION.UPDATE(notificationId),
        method: "PATCH",
      }),
    }),
    notificationDelete: builder.mutation({
      query: (notificationId) => ({
        url: API_ROUTES.NOTIFICATION.DELETE(notificationId),
        method: "DELETE",
      }),
    }),
    deleteAllNotification: builder.mutation({
      query: (userId) => ({
        url: API_ROUTES.NOTIFICATION.DELETE_ALL(userId),
        method: "DELETE",
      }),
    }),
    readAllNotification: builder.mutation({
      query: (userId) => ({
        url: API_ROUTES.NOTIFICATION.READ_ALL(userId),
        method: "PUT",
      }),
    }),
    getAllPatientAppoinments: builder.query({
      query: ({ patientId, page, limit }) => ({
        url: API_ROUTES.PATIENT.APPOINTMENTS(patientId, page, limit),
        method: "GET",
      }),
    }),
    cancelAppoinment: builder.mutation({
      query: (appoinmentId) => ({
        url: API_ROUTES.APPOINTMENT.CANCEL(appoinmentId),
        method: "PATCH",
      }),
    }),
    getWalletData: builder.query({
      query: ({ patientId, page, limit }) => ({
        url: API_ROUTES.WALLET.PATIENT(patientId, page, limit),
        method: "GET",
      }),
    }),
    addRating: builder.mutation({
      query: ({ doctorId, patientId, rating, review }) => ({
        url: API_ROUTES.RATING.ADD(doctorId),
        method: "POST",
        body: { patientId, rating, review },
      }),
    }),
    findDoctorRatings: builder.query({
      query: (doctorId) => ({
        url: API_ROUTES.RATING.GET(doctorId),
        method: "GET",
      }),
    }),
    createContactInformation: builder.mutation({
      query: ({ name, email, phone, message }) => ({
        url: API_ROUTES.CONTACT.CREATE(name, email, phone, message),
        method: "POST",
      }),
    }),
    getAllActiveSubscription:builder.query({
      query:()=>({
        url:API_ROUTES.SUBSCRIPTION.GETACTIVESUBSCRIPTION,
        method:'GET'
      }),
    }),
  }),
});

export const {
  useGetResendAppoinmentsQuery,
  useUpdateUserDataMutation,
  useGetUserDataQuery,
  useGetAllApprovedDoctorsQuery,
  useGetDoctorDetailPageQuery,
  useGetDoctorSlotQuery,
  useGetSlotsQuery,
  useGetAllSpecializationsQuery,
  useGetDoctorAndSlotQuery,
  useGetRelatedDoctorQuery,
  useChangePasswordMutation,
  useBookAppoinmentMutation,
  useChatBoatMutation,
  useGetUserNotificationQuery,
  useNotificationUnreadMutation,
  useNotificationDeleteMutation,
  useDeleteAllNotificationMutation,
  useGetAllPatientAppoinmentsQuery,
  useCancelAppoinmentMutation,
  useGetWalletDataQuery,
  useReadAllNotificationMutation,
  useAddRatingMutation,
  useFindDoctorRatingsQuery,
  useCreateContactInformationMutation,
  useGetAllActiveSubscriptionQuery
} = userApi;
