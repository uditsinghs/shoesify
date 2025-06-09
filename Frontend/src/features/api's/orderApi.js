import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // make sure you use `/react`

const BASE_URL = "https://shoesify-backend.onrender.com/api/v1/order/";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["orders", "adminorders"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: "userorders",
        method: "GET",
      }),
      providesTags: ["orders"],
    }),
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `order/${orderId}`,
        method: "GET"
      })

    }),
    getAllOrders: builder.query({
      query: () => ({
        url: "admin/orders",
        method: "GET",
      }),
      providesTags: ["adminorders"],
    }),


    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `admin/status/${orderId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["adminorders"],
    }),

    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `delete/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
} = orderApi;
