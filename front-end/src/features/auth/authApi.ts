import { api } from "@/app/api";
import { API_ROUTES } from "@/constants/apiRoutes";
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: API_ROUTES.AUTH.LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),

    signup: builder.mutation({
      query: (credentials) => ({
        url: API_ROUTES.AUTH.SIGNUP,
        method: "POST",
        body: credentials,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (payload: { email: string; otp: string }) => ({
        url: API_ROUTES.AUTH.VERIFY_OTP,
        method: "POST",
        body: payload,
      }),
    }),
    LogOut: builder.mutation<void, void>({
      query: () => ({
        url: API_ROUTES.AUTH.LOGOUT,
        method: "POST",
      }),
    }),
    resendOTP: builder.mutation({
      query: (payload: { email: string }) => ({
        url: API_ROUTES.AUTH.RESEND_OTP,
        method: "POST",
        body: payload,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (payload: { email: string }) => ({
        url: API_ROUTES.AUTH.SEND_OTP,
        method: "POST",
        body: payload,
      }),
    }),
    verifyEmailOTP: builder.mutation({
      query: (payload: { email: string; otp: string }) => ({
        url: API_ROUTES.AUTH.VERIFY_EMAIL,
        method: "POST",
        body: payload,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (payload: { email: string; newPassword: string }) => ({
        url: API_ROUTES.AUTH.FORGOT_PASSWORD,
        method: "POST",
        body: payload,
      }),
    }),
    getMe:builder.query({
      query:()=>({
        url:API_ROUTES.AUTH.ME,
        method:"GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useLogOutMutation,
  useResendOTPMutation,
  useVerifyEmailMutation,
  useVerifyEmailOTPMutation,
  useForgotPasswordMutation,
  useGetMeQuery,
} = authApi;
