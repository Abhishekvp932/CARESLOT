import { api } from "@/app/api";
import { API_ROUTES } from "@/constants/apiRoutes";

export const chatApi = api.injectEndpoints({
    endpoints:(builder)=>({
        getUserChat:builder.query({
            query:({patientId})=>({
                url:API_ROUTES.CHAT.USER_CHAT(patientId),
                method:'GET'
            }),
        }),
        sendMessage:builder.mutation({
            query:(formData)=>({
                url:API_ROUTES.CHAT.SEND_MESSAGE,
                method:'POST',
                body:formData,
                formData:true,
            }),
        }),
        getDoctorChat:builder.query({
            query:({doctorId})=>({
                url:API_ROUTES.CHAT.DOCTOR_CHAT(doctorId),
                method:'GET',
            }),
        }),
        getDoctorMessages:builder.query({
            query:(chatId)=>({
                url:API_ROUTES.CHAT.DOCTOR_MESSAGES(chatId),
                method:'GET'
            }),
        }),
        getPatientMessage:builder.query({
            query:(chatId)=>({
                url:API_ROUTES.CHAT.PATIENT_MESSAGES(chatId),
                method:'GET'
            }),
        }),
        deleteMessage:builder.mutation({
            query:(messageId)=>({
                url:API_ROUTES.CHAT.DELETE_MESSAGE(messageId),
                method:'DELETE',
            })
        })
    }),
});

export const  {
    useGetUserChatQuery,
    useSendMessageMutation,
    useGetDoctorChatQuery,
    useGetDoctorMessagesQuery,
    useGetPatientMessageQuery,
    useDeleteMessageMutation,
} = chatApi