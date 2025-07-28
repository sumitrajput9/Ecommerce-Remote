import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/orders' }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (payload) => ({
        url: '',
        method: 'POST',
        body: payload,
      }),
    }),
    getOrders: builder.query({ query: () => '' }),
    getOrdersByCustomerId: builder.query<any[], string>({
      query: (customerId) => `/customer/${customerId}`,
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrdersQuery, useGetOrdersByCustomerIdQuery } = orderApi;
