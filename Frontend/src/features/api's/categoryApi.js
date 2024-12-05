import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8080/api/v1/category/";
export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: () => ({
        url: "admin/getall",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (categoryname) => ({
        url: "admin/create",
        method: "POST",
        body: { categoryname },
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (cid) => ({
        url: `admin/delete/${cid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ categoryname, cid }) => ({
        url: `admin/edit/${cid}`,
        method: "PUT",
        body: { categoryname },
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
  useUpdateCategoryMutation,
} = categoryApi;
