import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeReducers from "../../../src/contexts/theme/themeSlices.ts";
import authReducers from "../../../src/contexts/auth/authSlice";
import videoPlayerReducers from "../../../src/contexts/videoPlayer/videoPlayerSlices";
import videoUploadReducers from "../../../src/contexts/videoUpload/videoUploadSlice";
const rootReducers = combineReducers({
  auth: authReducers,
  theme: themeReducers,
  videoPlayer: videoPlayerReducers,
  uploads: videoUploadReducers,
});

const store = configureStore({
  reducer: rootReducers,
});

function getTestStore() {
  return store;
}

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export { getTestStore };
