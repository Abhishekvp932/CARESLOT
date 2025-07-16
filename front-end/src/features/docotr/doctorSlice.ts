  import { createSlice} from "@reduxjs/toolkit";
  import type {PayloadAction} from '@reduxjs/toolkit'
  const initialState = {
      doctor : null as any,
      token : null,
      role : null,
      isKycSubmited:false
  };

  const doctorSlice = createSlice({
      name : 'doctor',
      initialState,
      reducers:{
          setCredentials:(state,action)=>{
              state.doctor = action.payload.doctor;
              state.token = action.payload.token;
              state.role = action.payload.role;
              state.isKycSubmited = action.payload.user?.qualifications ? true : false;
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
              state.token = null;
              state.role = null
          }
      }
  })


  export const {setCredentials,logOut,updateDoctorInfo,setKycStatus} = doctorSlice.actions;

  export default doctorSlice.reducer