import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "../slice/cartSlice";
import messageReducer from "../slice/messageSlice";
import authReducer from "../slice/authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    message: messageReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
