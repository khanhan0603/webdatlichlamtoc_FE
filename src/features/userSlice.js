// src/features/userSlice.js
import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    token: localStorage.getItem("token") || null,  
  },
  reducers: {
    userLoginSuccess: (state, action) => {
      state.currentUser = action.payload.user      
      state.token = action.payload.token
      localStorage.setItem("token", action.payload.token)
    },
    userLogout: (state) => {
      state.currentUser = null
      state.token = null
      localStorage.removeItem("token")
    },
  },
})

export const { userLoginSuccess, userLogout } = userSlice.actions
export default userSlice.reducer