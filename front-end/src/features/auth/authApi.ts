import { api } from "@/app/api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    signup: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (payload: { email: string; otp: string }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: payload,
      }),
    }),
    LogOut: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
        credentials: "include",
      }),
    }),
    resendOTP: builder.mutation({
      query: (payload: { email: string }) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: payload,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (payload: { email: string }) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: payload,
      }),
    }),
    verifyEmailOTP: builder.mutation({
      query: (payload: { email: string; otp: string }) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: payload,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (payload: { email: string; newPassword: string }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: payload,
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
} = authApi;
