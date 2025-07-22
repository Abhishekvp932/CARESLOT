import { api } from "@/app/api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getResendAppoinments: builder.query({
      query: () => ({
        url: `/patient/profile`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
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
        transformResponse: (response: any) => response.users,
    })
  }),
});

export const { useGetResendAppoinmentsQuery,useUpdateUserDataMutation,useGetUserDataQuery} = userApi;
