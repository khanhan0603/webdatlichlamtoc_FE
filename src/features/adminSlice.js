import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    currentAdmin: null, 
    
  },
  reducers: {
    adminLoginSuccess: (state, action) => {
      state.currentAdmin = action.payload.admin;
      
    },
    adminLogout: (state) => {
      state.currentAdmin = null;
    },
  },
});

export const { adminLoginSuccess, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
