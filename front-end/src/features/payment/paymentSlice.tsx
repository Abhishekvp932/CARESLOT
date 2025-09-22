import { api } from "@/app/api";

export const paymentApi = api.injectEndpoints({
    endpoints : (builder) => ({
         createOrder:builder.mutation({
            query:(amount)=>({
                url : '/payment/order',
                method:'POST',
                body:{amount}
            }),
         }),
         verifyOrder:builder.mutation({
            query:({razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                doctorId,
                patientId,
                date,
                startTime,
                endTime,
                amount,
                paymentMethod,
            })=>({
                url:'/payment/verifyOrder',
                method:'POST',
                body:{razorpay_order_id
                    ,razorpay_payment_id,
                    razorpay_signature,
                    doctorId,
                    patientId,
                    date,
                    startTime,
                    endTime,
                    amount,
                    paymentMethod,
                },
            }),
         }),
         walletPayment:builder.mutation({
            query:(paymentData)=>({
                url:'/payment/wallet-payment',
                method:'POST',
                body:paymentData
            }),
         }),
    })
});

export const {
    useCreateOrderMutation,
    useVerifyOrderMutation,
    useWalletPaymentMutation,
} = paymentApi
 