export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    VERIFY_OTP: "/auth/verify-otp",
    LOGOUT: "/auth/logout",
    RESEND_OTP: "/auth/resend-otp",
    SEND_OTP: "/auth/send-otp",
    VERIFY_EMAIL: "/auth/verify-email",
    FORGOT_PASSWORD: "/auth/forgot-password",
    ME: "/auth/me",
  },

  ADMIN: {
    USERS: (page?: number, limit?: number, search?: string) =>
      `/admin/users?page=${page}&limit=${limit}&search=${search || ""}`,
    USER_BY_ID: (patientId: string) => `/admin/users/${patientId}`,
    ADD_USER: "/admin/users",
    ADD_DOCTOR: "/admin/doctors",
    DOCTORS: (page?: number, limit?: number, search?: string) =>
      `/admin/doctors?page=${page}&limit=${limit}&search=${search || ""}`,
    DOCTOR_BY_ID: (doctorId: string) => `/admin/doctors/${doctorId}`,
    VERIFY_LIST: (page?: number, limit?: number, search?: string) =>
      `/admin/verification-list?page=${page}&limit=${limit}&search=${
        search || ""
      }`,
    DOCTOR_APPROVE: (doctorId: string) => `/admin/doctor/${doctorId}`,
    DOCTOR_REJECT: (doctorId: string) => `/admin/doctor/${doctorId}`,
    DOCTOR_DETAILS: (doctorId: string) => `/admin/doctor-details/${doctorId}`,
    ADMIN_APPOINTMENTS: (status: string, page: number, limit: number) =>
      `/admin/appoinments?status=${status || ""}&page=${page}&limit=${limit}`,
    GET_DOCTOR_SLOTS: (doctorId: string) => `/admin/getSlots/${doctorId}`,
    GET_DASHBOARD_DATA: (filter: string) => `/admin/dashboard?filter=${filter}`,
  },

  DOCTOR: {
    KYC_SUBMIT: (doctorId: string) => `/doctor/kycSubmit/${doctorId}`,
    PROFILE: (doctorId: string) => `/doctor/profile/${doctorId}`,
    RE_APPLY: (doctorId: string) => `/doctor/reApply/${doctorId}`,
    APPOINTMENTS: (
      doctorId: string,
      page: number,
      limit: number,
      status: string
    ) =>
      `/doctor/appoinments/${doctorId}?page=${page}&limit=${limit}&status=${status}`,
    GET_DASHBOARD_DATA: (doctorId: string, filter: string) =>
      `/doctor/dashboard/${doctorId}?filter=${filter}`,
  },

  SLOT: {
    ADD: "/slots/slots",
    GET_BY_DOCTOR: (slotId: string) => `/slots/slots/${slotId}`,
    DELETE: (slotId: string) => `/slots/slots/${slotId}`,
  },

  PAYMENT: {
    CREATE_ORDER: "/payment/order",
    VERIFY_ORDER: "/payment/verifyOrder",
    WALLET_PAYMENT: "/payment/wallet-payment",
    VERIFY_PLAN_PAYMENT:'/payment/plan-payment',
  },

  CHAT: {
    USER_CHAT: (patientId: string) => `/chat/user-chat/${patientId}`,
    SEND_MESSAGE: "/chat/send-message",
    DOCTOR_CHAT: (doctorId: string) => `/chat/doctor-chat/${doctorId}`,
    DOCTOR_MESSAGES: (chatId: string) => `/chat/doctor-messages/${chatId}`,
    PATIENT_MESSAGES: (chatId: string) => `/chat/patient-messages/${chatId}`,
    DELETE_MESSAGE: (messageId: string) => `/chat/delete-message/${messageId}`,
  },

  CALL: {
    GET_CALL_DATA: (appoinmentId: string) => `/call/call/${appoinmentId}`,
  },

  PATIENT: {
    RESEND_APPOINTMENT: (patientId: string) =>
      `/patient/resend-appoinment/${patientId}`,
    PROFILE: (patientId: string) => `/patient/profile/${patientId}`,
    DOCTORS: (
      page: number,
      limit: number,
      search: string,
      specialty: string,
      sortBy: string
    ) =>
      `/patient/doctors?page=${page}&limit=${limit}&search=${search}&specialty=${specialty}&sortBy=${sortBy}`,
    DOCTOR_DETAILS: (doctorId: string) => `/patient/doctor/${doctorId}`,
    SLOTS_BY_DATE: (doctorId: string, date: string) =>
      `/patient/slots/${doctorId}?date=${date}`,
    SPECIALIZATIONS: "/patient/specializations",
    CHECKOUT: (doctorId: string) => `/patient/checkout/${doctorId}`,
    RELATED_DOCTORS: (specialization: string, doctorId: string) =>
      `/patient/related-doctors?specialization=${specialization}&doctorId=${doctorId}`,
    CHANGE_PASSWORD: (userId: string) => `/patient/change-password/${userId}`,
    APPOINTMENTS: (patientId: string, page: number, limit: number) =>
      `/patient/appoinment/${patientId}?page=${page}&limit=${limit}`,
    GET_SLOTS: (doctorId: string, date: Date) =>
      `/patient/slots/${doctorId}?date=${date}`,
  },

  NOTIFICATION: {
    GET_ALL: (patientId: string) => `/notification/notification/${patientId}`,
    UPDATE: (notificationId: string) =>
      `/notification/notification/${notificationId}`,
    DELETE: (notificationId: string) =>
      `/notification/notification/${notificationId}`,
    DELETE_ALL: (userId: string) =>
      `/notification/deleteAll-notification/${userId}`,
    READ_ALL: (userId: string) =>
      `/notification/readAll-notification/${userId}`,
  },

  WALLET: {
    DOCTOR: (doctorId: string) => `/wallet/doctorWallet/${doctorId}`,
    PATIENT: (patientId: string, page: number, limit: number) =>
      `/wallet/userWallet/${patientId}?page=${page}&limit=${limit}`,
  },

  RATING: {
    ADD: (doctorId: string) => `/rating/rating/${doctorId}`,
    GET: (doctorId: string) => `/rating/rating/${doctorId}`,
  },

  CHATBOT: {
    MESSAGE: "/chatbot/chat",
  },

  APPOINTMENT: {
    CREATE: "/appoinment/appoinment",
    CANCEL: (appoinmentId: string) => `/appoinment/appoinment/${appoinmentId}`,
    CHANGE_STATUS: (appoinmentId: string) =>
      `/appoinment/change-status/${appoinmentId}`,
  },

  PRESCRIPTION: {
    CREATE: "/prescription/prescription",
    GETAPPOINMENTPRESCRIPTION:(appoinmentId:string)=> `/prescription/prescription/${appoinmentId}`,
    UPDATEPRESCRIPTION:(appoinmentId:string)=> `/prescription/update-prescription/${appoinmentId}`
  },
  CONTACT: {
    CREATE: (name: string, email: string, phone: string, message: string) =>
      `/contact/contact?name=${name}&email=${email}&phone=${phone}&message=${message}`,
    GETCONTACTDATA: (search?: string, page?: number, limit?: string) =>
      `/contact/getContacts?search=${search}&page=${page}&limit=${limit}`,
  },
  SUBSCRIPTION:{
    CREATE:'/subscription/subscription', 
    GETAllSUBSCRIPTIONS:'/subscription/subscription',
    DELETESUBSCRIPTION:(subscriptionId:string)=> `/subscription/subscription/${subscriptionId}`,
    GETACTIVESUBSCRIPTION:'/subscription/active-subscriptions'
  },
  USERSUBSCRIPTION:{
    findAllSubscriptionList:(page:number,limit:number)=>`/userSubscription/findAll?page=${page}&limit=${limit}`,
  }
};
