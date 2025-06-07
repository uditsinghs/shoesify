import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../api's/userApi";
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // NEW: to show loading while checking auth
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userApi.endpoints.loadUser.matchFulfilled,
        (state, action) => {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.isLoading = false;
        }
      )
      .addMatcher(
        userApi.endpoints.loadUser.matchRejected,
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
        }
      );
  },
});

export const { userLoggedIn, userLoggedOut } = userSlice.actions;
export default userSlice.reducer;
