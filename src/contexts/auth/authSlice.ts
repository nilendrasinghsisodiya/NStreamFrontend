import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/ContextStore";


const initialState: IUser = {
  accessToken:"",
    _id: "",
  username: "",
  avatar: "",
  coverImage: "",
  description: "",
  createdAt: "",
  updated_at: "",
  fullname: "",
  email: "",
  subscriberCount:0,
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
        username:string;
      }>
    ) => {
   state.accessToken =user.payload.accessToken;
   state._id = user.payload._id;
   state.username = user.payload.username;
   state.createdAt = user.payload.createdAt;
   state.email = user.payload.email;
    },

    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, reset, setRegistration } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth;
export default authSlice.reducer;
