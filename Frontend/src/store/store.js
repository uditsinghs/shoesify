import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { userApi } from "@/features/api's/userApi";
import { categoryApi } from "@/features/api's/categoryApi";
import { productApi } from "@/features/api's/productApi";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(userApi.middleware,categoryApi.middleware,productApi.middleware),
});

const initializeApp = async () => {
  await store.dispatch(
    userApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
};

initializeApp();
