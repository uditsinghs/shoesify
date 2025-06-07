import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/Slices/userSlice";
import { userApi } from "@/features/api's/userApi";
import { categoryApi } from "@/features/api's/categoryApi";
import { productApi } from "@/features/api's/productApi";
import { cartApi } from "@/features/api's/cartApi";
import { orderApi } from "@/features/api's/orderApi";

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  user: userReducer,
});

export default rootReducer;
