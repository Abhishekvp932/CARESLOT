import { api } from "@/app/api";
import { API_ROUTES } from "@/constants/apiRoutes";
export const chatApi = api.injectEndpoints({
    endpoints:(builder)=>({
        getCallData:builder.query({
            query:(appoinmentId)=>({
                url:API_ROUTES.CALL.GET_CALL_DATA(appoinmentId),
            }),
        }),
    })
})

export const {
    useGetCallDataQuery,
} = chatApi