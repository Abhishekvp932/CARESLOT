import { api } from "@/app/api";


export const adminApi = api.injectEndpoints({
    endpoints : (builder)=>({
        getAllUsers : builder.query({
            query : ({page,limit,search})=>({
                url:`/admin/users?page=${page}&limit=${limit}&search=${search || ''}`,
                method:'GET'
            }),
        }),
        getAllDoctors:builder.query({
            query: ({page,limit,search})=>({
                url:`/admin/doctors?page=${page}&limit=${limit}&search=${search || ''}`,
                method:'GET'
            }),
        }),
       blockUser: builder.mutation({
       query:({userId,isBlocked})=>({
        url:`/admin/users/${userId}`,
        method:"PATCH",
        body:{isBlocked},
       }),
    }),
    blockDoctor : builder.mutation({
        query:({doctorId,isBlocked,reason})=>({
            url:`/admin/doctors/${doctorId}`,
            method:"PATCH",
            body:{isBlocked,reason}
        }),
    }),
    findUnApprovedDoctors : builder.query({
        query:({page,limit,search})=>({
            url : `/admin/verification-list?page=${page}&limit=${limit}&search=${search || ''}`,
            method:"GET"
        }),
    }),
      doctorApprove : builder.mutation({
        query : (doctorId)=>({
            url : `/admin/doctor/${doctorId}`,
            method:"PATCH",
        }),
      }),
      doctorReject : builder.mutation({
        query:({doctorId,reason})=>({
            url : `/admin/doctor/${doctorId}`,
            method:"PUT",
            body:{reason},
        }),
      }),
      getDoctorData:builder.query({
        query:(doctorId)=>({
            url:`/admin/doctor-details/${doctorId}`,
            method:'GET',
        }),
        transformResponse: (response) => response.doctor,
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
         transformResponse: (response) => response.doctor,
      }),
      editDoctorData:builder.mutation<any,{formData:any,doctorId:string}>({
        query:({formData,doctorId})=>({
            url:`/admin/doctors/${doctorId}`,
            method:"PUT",
            body:formData,
            formData: true
        }),
      }),
      addUser:builder.mutation({
        query:({formData})=>({
            url:"/admin/users",
            method:"POST",
            body:formData
        }),
      }),
      addDoctor:builder.mutation({
        query:({formData})=>({
            url:'/admin/doctors',
            method:"POST",
            body:formData
        }),
      }),
      getAllAdminAppoinments:builder.query({
        query:()=>({
            url:'/admin/appoinments',
            method:'GET'
        }),
      }),
      getAllDoctorSlotsAndAppoinments:builder.query({
        query:(doctorId)=>({
            url:`/admin/getSlots/${doctorId}`,
            method:'GET'
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
    useAddUserMutation,
    useAddDoctorMutation,
    useGetAllAdminAppoinmentsQuery,
    useGetAllDoctorSlotsAndAppoinmentsQuery,
} = adminApi