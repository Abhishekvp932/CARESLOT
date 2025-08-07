import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user : null,
    role : null,

};
const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            state.user = action.payload.user;
            state.role = action.payload.role;
        },
        logOut:(state)=>{
            state.user = null;
            state.role = null
        }
    }
})


export const {setCredentials,logOut} = authSlice.actions;

export default authSlice.reducer