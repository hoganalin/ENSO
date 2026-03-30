import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "../slice/cartSlice";
import messageReducer from "../slice/messageSlice";
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    message: messageReducer,
  },
});

//RootState 和 AppDispatch 是 Redux 官方文件慣用的命名
export type RootState = ReturnType<typeof store.getState>;
// typeof store.getState → 取得 getState 函式的型別
// ReturnType<...> → 取得那個函式的回傳值型別
// 結果就是整個 Redux state 的型別
export type AppDispatch = typeof store.dispatch;
