import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profile_img:string;
  role:string;
  qualifications?:{
    specialization:string
  };
}
export interface AuthState {
  doctor: Doctor | null ;
  role: string | null;
  isKycSubmited:boolean | null;
}
const initialState : AuthState = {
  doctor: null,
  isKycSubmited: false,
  role: null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    setCredentialsDoctor: (state, action) => {
      state.doctor = action.payload.doctor;
      state.role = action.payload.role;
    },
    updateDoctorInfo: (state, action: PayloadAction<Doctor>) => {
      state.doctor = {
        ...state.doctor,
        ...action.payload,
      };
    },
    setKycStatus: (state, action: PayloadAction<boolean>) => {
      state.isKycSubmited = action.payload;
    },
    logOut: (state) => {
      state.doctor = null;
      state.role = null;
    },
  },
});

export const { logOut, updateDoctorInfo, setKycStatus, setCredentialsDoctor } =
  doctorSlice.actions;

export default doctorSlice.reducer;
