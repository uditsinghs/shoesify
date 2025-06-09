import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://shoesify-backend.onrender.com/api/v1/product/";
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Products", "Product"],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({
        url: "get-product",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),
    addProduct: builder.mutation({
      query: (formData) => ({
        url: "add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    getSingleProduct: builder.query({
      query: (pid) => ({
        url: `get/${pid}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getRelatedProduct: builder.query({
      query: (pid) => ({
        url: `products/${pid}/related`,
        method: "GET",
      }),
    }),
    deleteProduct: builder.mutation({
      query: (pid) => ({
        url: `delete/${pid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ inputData, pid }) => ({
        url: `update/${pid}`,
        method: "PUT",
        body: inputData,
      }),
      invalidatesTags: ["Products"],
    }),
    getWishlist: builder.query({
      query: () => ({
        url: "get-wishlist",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),
    addToWishist: builder.mutation({
      query: (pid) => ({
        url: `add-wishlist/${pid}`,
        method: "POST",
      }),
      invalidatesTags: ["Products"],
    }),
    getPaginatedProducts: builder.query({
      query: ({ page = 1, search = "" }) => ({
        url: `products?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),
    removeFromWishlist: builder.mutation({
      query: (pid) => ({
        url: `delete-wishlist/${pid}`,
        method: "POST",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useAddToWishistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useGetRelatedProductQuery,
  useGetPaginatedProductsQuery
} = productApi;
