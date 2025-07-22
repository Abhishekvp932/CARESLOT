  import { createSlice} from "@reduxjs/toolkit";
  import type {PayloadAction} from '@reduxjs/toolkit'
  const initialState = {
      doctor : null as any,
      isKycSubmited:false,
      role : null
  };

  const doctorSlice = createSlice({
      name : 'doctor',
      initialState,
      reducers:{
         setCredentialsDoctor:(state,action)=>{
            state.doctor = action.payload.doctor;
            state.role = action.payload.role;
        },
          updateDoctorInfo: (state, action: PayloadAction<any>) => {
            state.doctor = {
          ...state.doctor,
          ...action.payload,
        };
      },
      setKycStatus: (state, action: PayloadAction<boolean>) => {
        state.isKycSubmited = action.payload;
      },
          logOut:(state)=>{
              state.doctor = null;
              state.role = null
          }
      }
  })


  export const {logOut,updateDoctorInfo,setKycStatus,setCredentialsDoctor} = doctorSlice.actions;

  export default doctorSlice.reducer