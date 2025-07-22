import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin : null,
    role : 'admin',

};
const AdminSlice = createSlice({
    name : 'admin',
    initialState,
    reducers:{
        setCredentialsAdmin:(state,action)=>{
            state.admin = action.payload.admin;
            state.role = action.payload.role;
        },
        logOut:(state)=>{
            state.admin = null;
            state.admin = null
        }
    }
})


export const {logOut,setCredentialsAdmin} = AdminSlice.actions;

export default AdminSlice.reducer