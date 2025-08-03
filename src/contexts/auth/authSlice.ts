import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/ContextStore";

const initialState: IUser = {
  accessToken: "",
  _id: "",
  username: "",
  avatar: "",
  coverImage: "",
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
    setUser: (state, user: PayloadAction<IUser>) => {
      Object.assign(state, user.payload);
    },

    setRegistration: (
      state,
      user: PayloadAction<{
        _id: string;
        email: string;
        createdAt: string;
        accessToken?: string;
        username: string;
      }>
    ) => {
     return { ...state,accessToken : user.payload.accessToken,
      _id: user.payload._id,
      username : user.payload.username,
      createdAt : user.payload.createdAt,
      email :user.payload.email}
    },

    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, reset, setRegistration } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth;
export default authSlice.reducer;
