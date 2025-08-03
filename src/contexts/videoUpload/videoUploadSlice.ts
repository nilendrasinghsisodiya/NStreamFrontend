import { RootState } from "@/ContextStore";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUpload {
  id: string;
  state: "pending" | "success" | "error" | "canceled";
  title: string;
  progress: number;
  error?: string;
  uploader: string;
}

const initialState: { uploads: IUpload[] } = { uploads: [] };
const uploadsSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {
    startUpload: (
      state,
      action: PayloadAction<{ id: string; title: string; uploader: string }>
    ) => {
      console.log("inside add reducer");
      if (Array.isArray(state.uploads)) {
        console.log("state.uploads is an array");
        state.uploads.push({
          id: action.payload.id,
          title: action.payload.title,
          uploader: action.payload.uploader,
          progress: 0,
          error: "",
          state: "pending",
        });
      }
    },

    setProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number }>
    ) => {
      const upload = state.uploads.find((u) => u.id === action.payload.id);
      if (upload) upload.progress = action.payload.progress;
    },
    setSuccess: (state, action: PayloadAction<{ id: string }>) => {
      const upload = state.uploads.find((u) => u.id === action.payload.id);
      if (upload) upload.state = "success";
    },
    setError: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const upload = state.uploads.find((u) => u.id === action.payload.id);
      if (upload) {
        upload.state = "error";
        upload.error = action.payload.error;
      }
    },
    removeUpload: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.uploads.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) state.uploads.splice(index, 1);
    },

    resetUpload: (state) => {
      state.uploads.length = 0;
    },
  },
});

export const { startUpload, setProgress, setSuccess, setError, removeUpload } =
  uploadsSlice.actions;
export const selectVideoUpload = (state: RootState) => state.uploads;

export default uploadsSlice.reducer;
