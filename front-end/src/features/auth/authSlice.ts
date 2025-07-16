import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user : null,
    token : null,
    role : null,

};
const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.role;
        },
        logOut:(state)=>{
            state.user = null;
            state.token = null;
            state.role = null
        }
    }
})


export const {setCredentials,logOut} = authSlice.actions;

export default authSlice.reducer