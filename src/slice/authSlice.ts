import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  token: string | null;
  user: {
    email: string;
    [key: string]: any;
  } | null;
  isAuthenticated: boolean;
}

const localAuth = localStorage.getItem("auth");
const initialAuth: UserState = localAuth
  ? JSON.parse(localAuth)
  : { token: null, user: null, isAuthenticated: false };

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuth,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ token: string; user: { email: string } }>,
    ) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem("auth", JSON.stringify(state));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth");
    },
    restoreAuth(
      state,
      action: PayloadAction<{ token: string; user: { email: string } }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("auth", JSON.stringify(state));
    },
  },
});

export const { loginSuccess, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
