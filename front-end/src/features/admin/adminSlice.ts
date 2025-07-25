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
        AdminlogOut:(state)=>{
            state.admin = null;
            state.admin = null
        }
    }
})


export const {AdminlogOut,setCredentialsAdmin} = AdminSlice.actions;

export default AdminSlice.reducer