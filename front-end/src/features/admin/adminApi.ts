import { api } from "@/app/api";

import { API_ROUTES } from "@/constants/apiRoutes";

export const adminApi = api.injectEndpoints({
    endpoints : (builder)=>({
        getAllUsers : builder.query({
            query : ({page,limit,search})=>({
                url:API_ROUTES.ADMIN.USERS(page,limit,search),
                method:'GET'
            }),
        }),
        getAllDoctors:builder.query({
            query: ({page,limit,search})=>({
                url:API_ROUTES.ADMIN.DOCTORS(page,limit,search),
                method:'GET'
            }),
        }),
       blockUser: builder.mutation({
       query:({userId,isBlocked})=>({
        url:API_ROUTES.ADMIN.USER_BY_ID(userId),
        method:"PATCH",
        body:{isBlocked},
       }),
    }),
    blockDoctor : builder.mutation({
        query:({doctorId,isBlocked,reason})=>({
            url:API_ROUTES.ADMIN.DOCTOR_BY_ID(doctorId),
            method:"PATCH",
            body:{isBlocked,reason}
        }),
    }),
    findUnApprovedDoctors : builder.query({
        query:({page,limit,search})=>({
            url :API_ROUTES.ADMIN.VERIFY_LIST(page,limit,search),
            method:"GET"
        }),
    }),
      doctorApprove : builder.mutation({
        query : (doctorId)=>({
            url : API_ROUTES.ADMIN.DOCTOR_APPROVE(doctorId),
            method:"PATCH",
        }),
      }),
      doctorReject : builder.mutation({
        query:({doctorId,reason})=>({
            url : API_ROUTES.ADMIN.DOCTOR_REJECT(doctorId),
            method:"PUT",
            body:{reason},
        }),
      }),
      getDoctorData:builder.query({
        query:(doctorId)=>({
            url:API_ROUTES.ADMIN.DOCTOR_DETAILS(doctorId),
            method:'GET',
        }),
        transformResponse: (response) => response.doctor,
      }),
      updateUserData:builder.mutation({
        query:({formData,userId})=>({
            url:API_ROUTES.ADMIN.USER_BY_ID(userId),
            method:"PUT",
            body:formData
        }),
      }),
      getEditDoctorData:builder.query({
        query:(doctorId)=>({
            url:API_ROUTES.ADMIN.DOCTOR_BY_ID(doctorId),
            method:"GET",
        }),
         transformResponse: (response) => response.doctor,
      }),
      editDoctorData:builder.mutation<any,{formData:any,doctorId:string}>({
        query:({formData,doctorId})=>({
            url:API_ROUTES.ADMIN.DOCTOR_BY_ID(doctorId),
            method:"PUT",
            body:formData ,
            formData: true
        }),
      }),
      addUser:builder.mutation({
        query:({formData})=>({
            url:API_ROUTES.ADMIN.ADD_USER,
            method:"POST",
            body:formData
        }),
      }),
      addDoctor:builder.mutation({
        query:({formData})=>({
            url:API_ROUTES.ADMIN.ADD_DOCTOR,
            method:"POST",
            body:formData
        }),
      }),
      getAllAdminAppoinments:builder.query({
        query:({status})=>({
            url:API_ROUTES.ADMIN.ADMIN_APPOINTMENTS(status),
            method:'GET'
        }),
      }),
      getAllDoctorSlotsAndAppoinments:builder.query({
        query:(doctorId:string)=>({
            url:API_ROUTES.ADMIN.GET_DOCTOR_SLOTS(doctorId),
            method:'GET'
        }),
      }),
      getAdminDashboardData:builder.query({
        query:(filter:string)=>({
          url:API_ROUTES.ADMIN.GET_DASHBOARD_DATA(filter),
          method:'GET',
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
    useGetAdminDashboardDataQuery,
} = adminApi