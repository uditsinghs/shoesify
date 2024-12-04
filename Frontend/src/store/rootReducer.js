import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/Slices/userSlice";
import { userApi } from "@/features/api's/userApi";

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  user: userReducer,
});

export default rootReducer;
