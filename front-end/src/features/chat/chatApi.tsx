import { api } from "@/app/api";

export const chatApi = api.injectEndpoints({
    endpoints:(builder)=>({
        getUserChat:builder.query({
            query:({patientId})=>({
                url:`/chat/user-chat/${patientId}`,
                method:'GET'
            }),
        }),
        sendMessage:builder.mutation({
            query:(formData)=>({
                url:'/chat/send-message',
                method:'POST',
                body:formData,
                formData:true,
            }),
        }),
        getDoctorChat:builder.query({
            query:({doctorId})=>({
                url:`/chat/doctor-chat/${doctorId}`,
                method:'GET',
            }),
        }),
        getDoctorMessages:builder.query({
            query:(chatId)=>({
                url:`/chat/doctor-messages/${chatId}`,
                method:'GET'
            }),
        }),
        getPatientMessage:builder.query({
            query:(chatId)=>({
                url:`/chat/patient-messages/${chatId}`,
                method:'GET'
            }),
        }),
        deleteMessage:builder.mutation({
            query:(messageId)=>({
                url:`/chat/delete-message/${messageId}`,
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