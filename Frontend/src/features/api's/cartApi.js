import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://shoesify-backend.onrender.com/api/v1/cart/";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: "get-cart",
        method: "GET",
      }),
    }),
    getCartProduct: builder.query({
      query: () => ({
        url: "get",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),
    removeProduct: builder.mutation({
      query: (pid) => ({
        url: "delete",
        method: "DELETE",
        body: {pid},
      }),
      invalidatesTags: ["Products"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "clear",
        method: "POST",
      }),
      invalidatesTags: ["Products"],
    }),
    addToCart: builder.mutation({
      query: (pid) => ({
        url: "add",
        method: "POST",
        body: { pid },
      }),
      invalidatesTags: ["Products"],
    }),
    updateCart: builder.mutation({
      query: ({ pid, quantity }) => ({
        url: "update",
        method: "POST",
        body: { pid, quantity },
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useGetCartProductQuery,
  useAddToCartMutation,
  useClearCartMutation,
  useRemoveProductMutation,
  useUpdateCartMutation,
} = cartApi;
