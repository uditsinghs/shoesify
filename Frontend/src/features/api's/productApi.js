import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8080/api/v1/product/";
export const productApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Products", "Product"],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({
        url: "get",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),
    AddProduct: builder.mutation({
      query: ({ inputData }) => ({
        url: "add",
        method: "POST",
        body: inputData,
      }),
      providesTags: ["Products"],
    }),
    getSinglePost: builder.query({
      query: (pid) => ({
        url: `get/${pid}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (pid) => ({
        url: `delete/${pid}`,
        method: "DELETE",
      }),
      providesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ inputData, pid }) => ({
        url: `update/${pid}`,
        method: "PUT",
        body: inputData,
      }),
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetAllProductsQuery,useAddProductMutation,useDeleteProductMutation,useGetSinglePostQuery,useUpdateProductMutation} = productApi;
