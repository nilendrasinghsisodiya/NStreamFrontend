import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/ContextStore";

export type ThemeType = "light" | "dark" | "system";

const initialState:ThemeType = "system" as ThemeType;

const themeSlice = createSlice({
  name: "theme",
  initialState:initialState,
  reducers: {
    setTheme: (_state, action: PayloadAction<ThemeType>) => {
      return action.payload ; // Returning the new state
    },
    reset: () => {
      return "light" as ThemeType; // Returning default state
    },
  },
});

export const { setTheme, reset } = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme; // Fixed selector
export default themeSlice.reducer;
