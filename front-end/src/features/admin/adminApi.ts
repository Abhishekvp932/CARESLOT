import { api } from "@/app/api";


export const adminApi = api.injectEndpoints({
    endpoints : (builder)=>({
        getAllUsers : builder.query({
            query : ()=>({
                url:"/admin/users",
                method:'GET'
            }),
             transformResponse: (response: any) => response.users,
        }),
        getAllDoctors:builder.query({
            query: ()=>({
                url:'/admin/doctors',
                method:'GET'
            }),
            transformResponse: (response: any) => response.doctors,
        }),
       blockUser: builder.mutation({
       query:({userId,isBlocked})=>({
        url:`/admin/users/${userId}`,
        method:"PATCH",
        body:{isBlocked},
       }),
    }),
    blockDoctor : builder.mutation({
        query:({doctorId,isBlocked})=>({
            url:`/admin/doctors/${doctorId}`,
            method:"PATCH",
            body:{isBlocked}
        }),
    }),
    findUnApprovedDoctors : builder.query({
        query:()=>({
            url : '/admin/verification-list',
            method:"GET"
        }),
        transformResponse: (response:any) => response.doctors,
    }),
      doctorApprove : builder.mutation({
        query : ({doctorId})=>({
            url : `/admin/doctor/${doctorId}`,
            method:"PATCH",
        }),
      }),
      doctorReject : builder.mutation({
        query:({doctorId})=>({
            url : `/admin/doctor/${doctorId}`,
            method:"DELETE",
        }),
      }),
      getDoctorData:builder.query({
        query:(doctorId)=>({
            url:`/admin/doctor-details/${doctorId}`,
            method:'GET',
        }),
        transformResponse: (response: any) => response.doctor,
      }),
      updateUserData:builder.mutation({
        query:({formData,userId})=>({
            url:`/admin/users/${userId}`,
            method:"PUT",
            body:formData
        }),
      }),
      getEditDoctorData:builder.query({
        query:(doctorId)=>({
            url:`/admin/doctors/${doctorId}`,
            method:"GET",
        }),
         transformResponse: (response: any) => response.doctor,
      }),
      editDoctorData:builder.mutation<any,{formData:any,doctorId:string}>({
        query:({formData,doctorId})=>({
            url:`/admin/doctors/${doctorId}`,
            method:"PUT",
            body:formData,
            formData: true
        }),
      }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetAllDoctorsQuery,
    useBlockUserMutation,
    useBlockDoctorMutation,
    useFindUnApprovedDoctorsQuery,
    useDoctorApproveMutation,
    useDoctorRejectMutation,
    useGetDoctorDataQuery,
    useUpdateUserDataMutation,
    useGetEditDoctorDataQuery,
    useEditDoctorDataMutation,
} = adminApi