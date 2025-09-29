import { api } from "@/app/api";

export const chatApi = api.injectEndpoints({
    endpoints:(builder)=>({
        getCallData:builder.query({
            query:(appoinmentId)=>({
                url:`/call/call/${appoinmentId}`
            }),
        }),
    })
})

export const {
    useGetCallDataQuery,
} = chatApi