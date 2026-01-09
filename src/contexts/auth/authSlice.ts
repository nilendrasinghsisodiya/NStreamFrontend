import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/ContextStore";
import { useSelector } from "react-redux";
export interface IAuthState extends IUser {
  isAuthenticated: boolean;
  isEmailVerfied: boolean;
}
const initialState: IAuthState = {
  isAuthenticated: false,
  _id: "",
  username: "",
  avatar: "",
  isEmailVerfied: false,
  description: "",
  createdAt: "",
  updated_at: "",
  fullname: "",
  email: "",
  subscribersCount: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, user: PayloadAction<IAuthState>) => {
      Object.assign(state, user.payload);
    },
    resetIsAuthenticated: (state) => {
      state.isAuthenticated = false;
    },
    setIsAuthenticated: (state) => {
      state.isAuthenticated = true;
    },
    setRegistration: (
      state,
      action: PayloadAction<{
        _id: string;
        email: string;
        createdAt: string;
        username: string;
        isAuthenticated: boolean;
        isEmailVerfied: boolean;
      }>,
    ) => {
      state.username = action.payload.username;
      state._id = action.payload._id;
      state.createdAt = action.payload.createdAt;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isEmailVerfied = action.payload.isEmailVerfied;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setUser,
  reset,
  setRegistration,
  resetIsAuthenticated,
  setIsAuthenticated,
} = authSlice.actions;

export const selectUser = (state: RootState) => state.auth;
export default authSlice.reducer;

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useSelector(selectUser);
  return isAuthenticated;
};
