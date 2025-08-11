import { api } from "@/app/api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getResendAppoinments: builder.query({
      query: () => ({
        url: `/patient/profile`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.doctors;
      },
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
   useGetAllSpecializationsQuery 
  }
   = userApi;
