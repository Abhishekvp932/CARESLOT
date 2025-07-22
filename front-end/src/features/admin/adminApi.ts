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
        transformResponse: (response: any) => response.doctors,
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
    }),
});

export const {
    useGetAllUsersQuery,
    useGetAllDoctorsQuery,
    useBlockUserMutation,
    useBlockDoctorMutation,
    useFindUnApprovedDoctorsQuery,
    useDoctorApproveMutation,
    useDoctorRejectMutation
} = adminApi