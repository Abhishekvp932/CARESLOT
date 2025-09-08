import { api } from "@/app/api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getResendAppoinments: builder.query({
      query: ({patientId}) => ({
        url: `/patient/resend-appoinment/${patientId}`,
        method: "GET",
      }),
    }),
    updateUserData:builder.mutation({
        query:({formData,userId})=>({
          url:`/patient/profile/${userId}`,
          method:"PUT",
          body:formData
        }),
    }),
    getUserData:builder.query({
        query:(id)=>({
            url:`/patient/profile/${id}`,
            method:"GET"
        }),
        transformResponse: (response) => response.users,
    }),
    getAllApprovedDoctors:builder.query({
      query:({page,limit,search,specialty})=>({
        url:`/patient/doctors?page=${page}&limit=${limit}&search=${search}&specialty=${specialty}`,
        method:"GET"
      }),
    }),
    getDoctorDetailPage :builder.query({
      query:(doctorId)=>({
        url:`/patient/doctor/${doctorId}`,
        method:"GET",
      }),
       transformResponse: (response) => {
         console.log('response',response.doctor);
        return response.doctor;
      },
    }),
    getDoctorSlot:builder.query({
      query:(doctorId)=>({
        url:`/patinet/doctor/${doctorId}`
      }),
    }),
    getSlots:builder.query({
      query:(doctorId)=>({
        url:`/patient/slots/${doctorId}`
      }),
      transformResponse: (response) => response.slots,
    }),
    getAllSpecializations:builder.query({
      query:()=>({
        url:"/patient/specializations",
        method:"GET"
      }),
        transformResponse: (response) => response.specializations,
    }),
    getDoctorAndSlot:builder.query({
      query:({doctorId})=>({
        url:`/patient/checkout/${doctorId}`,
        method:"GET"
      }),
    }),
    getRelatedDoctor:builder.query({
      query:({doctorId,specialization})=>({
        url:`/patient/related-doctors?specialization=${specialization}&doctorId=${doctorId}`,
        method:"GET",
      }),
    }),
    changePassword:builder.mutation({
      query:({formData,userId})=>({
        url:`/patient/change-password/${userId}`,
        method:"PATCH",
        body:formData
      }),
    }),
    bookAppoinment:builder.mutation({
      query:({data})=>({
        url:`/appoinment/appoinment`,
        method:"POST",
        body:data,
      }),
    }),
  }),
});

export const {
   useGetResendAppoinmentsQuery,
   useUpdateUserDataMutation
   ,useGetUserDataQuery,
   useGetAllApprovedDoctorsQuery,
   useGetDoctorDetailPageQuery,
   useGetDoctorSlotQuery,
   useGetSlotsQuery, 
   useGetAllSpecializationsQuery ,
   useGetDoctorAndSlotQuery,
   useGetRelatedDoctorQuery,
   useChangePasswordMutation,
   useBookAppoinmentMutation
  }
   = userApi;
