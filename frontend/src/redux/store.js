import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import auctionReducer from './auctionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    auction: auctionReducer,
  },
});