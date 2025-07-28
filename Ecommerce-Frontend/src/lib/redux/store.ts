// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { productApi } from './api/productApi'; // your existing one
import { orderApi } from './api/orderApi'; // your existing order API
import cartReducer from './slices/cartSlice'; // your existing cart slice
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    cart: cartReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, productApi.middleware, orderApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
