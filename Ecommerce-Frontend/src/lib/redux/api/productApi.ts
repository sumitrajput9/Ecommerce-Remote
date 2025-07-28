import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + '/api/',
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<any[], void>({
      query: () => 'products',
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
