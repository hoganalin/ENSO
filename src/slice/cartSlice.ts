import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addCartApi,
  deleteAllCartApi,
  deleteSingleCartApi,
  getCartApi,
  updateCartApi,
} from "../services/cart";

interface CartItem {
  id: string;
  product_id: string;
  qty: number;
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
}

interface CartState {
  carts: CartItem[];
  total: number;
  final_total: number;
}

const initialState: CartState = {
  carts: [],
  total: 0,
  final_total: 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCart: (state, action) => {
      state.carts = action.payload.carts;
      state.total = action.payload.total;
      state.final_total = action.payload.final_total;
    },
  },
});

// 取得購物車內容清單
export const createAsyncGetCart = createAsyncThunk(
  "cart/createAsyncGetCart",
  async (_, { dispatch }) => {
    try {
      const response = await getCartApi();

      dispatch(updateCart(response.data.data));
    } catch (error) {
      console.log(error?.response || error.message);
    }
  },
);

// 新增商品至購物車
export const createAsyncAddCart = createAsyncThunk(
  "cart/createAsyncAddCart",
  async ({ id, qty = 1 }: { id: string; qty?: number }, { dispatch }) => {
    try {
      await addCartApi({ product_id: id, qty });
      // 新增成功後重新取得最新購物車狀態
      dispatch(createAsyncGetCart());
    } catch (error) {
      console.log(error?.response || error.message);
    }
  },
);

// 刪除購物車單一商品
export const createAsyncDeleteSingleCart = createAsyncThunk(
  "cart/createAsyncDeleteSingleCart",
  async (id: string, { dispatch }) => {
    try {
      await deleteSingleCartApi(id);
      // 刪除後重新取得購物車狀態以同步畫面
      dispatch(createAsyncGetCart());
    } catch (error) {
      console.log(error?.response || error.message);
    }
  },
);

// 清空全部購物車
export const createAsyncDeleteAllCart = createAsyncThunk(
  "cart/createAsyncDeleteAllCart",
  async (_, { dispatch }) => {
    try {
      const response = await deleteAllCartApi();
      dispatch(createAsyncGetCart());
      return response.data;
    } catch (error) {
      console.log(error?.response || error.message);
    }
  },
);

// 更新/修改購物車中產品的數量
export const createAsyncUpdateCart = createAsyncThunk(
  "cart/createAsyncUpdateCart",
  async (
    { id, product_id, qty }: { id: string; product_id: string; qty: number },
    { dispatch },
  ) => {
    try {
      await updateCartApi(id, { product_id, qty });
      // 更新後同步最新金額與品項資料
      dispatch(createAsyncGetCart());
    } catch (error) {
      console.log(error?.response || error.message);
    }
  },
);

export const { updateCart } = cartSlice.actions;
export default cartSlice.reducer;
