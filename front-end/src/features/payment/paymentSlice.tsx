import { api } from "@/app/api";
import { API_ROUTES } from "@/constants/apiRoutes";

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (amount) => ({
        url: API_ROUTES.PAYMENT.CREATE_ORDER,
        method: "POST",
        body: { amount },
      }),
    }),
    verifyOrder: builder.mutation({
      query: ({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        doctorId,
        patientId,
        date,
        startTime,
        endTime,
        amount,
        paymentMethod,
      }) => ({
        url: API_ROUTES.PAYMENT.VERIFY_ORDER,
        method: "POST",
        body: {
          razorpay_order_id,
          razorpay_payment_id,
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
    walletPayment: builder.mutation({
      query: (paymentData) => ({
        url: API_ROUTES.PAYMENT.WALLET_PAYMENT,
        method: "POST",
        body: paymentData,
      }),
    }),

    verifySubscriptionPlanPayment:builder.mutation({
      query:({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planId,
        patientId,
        amount,
        paymentMethod,
      })=>({
        url:API_ROUTES.PAYMENT.VERIFY_PLAN_PAYMENT,
        method:'POST',
        body:{
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planId,
        patientId,
        amount,
        paymentMethod,
        },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyOrderMutation,
  useWalletPaymentMutation,
  useVerifySubscriptionPlanPaymentMutation
} = paymentApi;
