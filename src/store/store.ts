import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "../slice/cartSlice";
import messageReducer from "../slice/messageSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    message: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
