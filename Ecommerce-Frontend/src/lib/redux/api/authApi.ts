import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api' }),
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; user: any }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<any, { fullName: string; email: string; password: string }>({
      query: (userData) => ({
        url: '/customers',
        method: 'POST',
        body: userData,
      }),
    }),
     getCustomerById: builder.query<any, string>({
      query: (id) => `/customers/${id}`,
    }),

    updateCustomer: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: data,
      }),
   
  }),
  }),
});

export const { useLoginMutation ,useRegisterMutation,useGetCustomerByIdQuery,useUpdateCustomerMutation} = authApi;
