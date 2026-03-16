import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addCartApi, deleteSingleCartApi, getCartApi } from "../services/cart";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    carts: [],
    total: 0,
    final_total: 0,
  },
  reducers: {
    updateCart: (state, action) => {
      state.carts = action.payload.carts;
      state.total = action.payload.total;
      state.final_total = action.payload.final_total;
    },
  },
});

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

export const createAsyncAddCart = createAsyncThunk(
  "cart/createAsyncAddCart",
  async ({ id, qty = 1 }, { dispatch }) => {
    try {
      await addCartApi({ product_id: id, qty });
      dispatch(createAsyncGetCart());
    } catch (error) {
      console.log(error?.response || error.message);
    }
  },
);

export const createAsyncDeleteSingleCart = createAsyncThunk(
  "cart/createAsyncDeleteSingleCart",
  async (id, { dispatch }) => {
    try {
      await deleteSingleCartApi(id);
      dispatch(createAsyncGetCart());
    } catch (error) {
      console.log(error?.response || error.message);
    }
  },
);

export const { updateCart } = cartSlice.actions;
export default cartSlice.reducer;
