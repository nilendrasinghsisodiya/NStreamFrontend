import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeReducers from "./contexts/theme/themeSlices";
import authReducers from "./contexts/auth/authSlice";
import videoPlayerReducers from "./contexts/videoPlayer/videoPlayerSlices";
import comments from "./contexts/comments/commentSlice"
import {
  persistStore,
  persistReducer,
  PAUSE,
  PERSIST,
  REGISTER,
  REHYDRATE,
  FLUSH,
  PURGE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const presistConfig = {
  key: "auth",
  storage,
};
const presistedAuthReducers = persistReducer(presistConfig, authReducers);

const rootReducers = combineReducers({
  auth: presistedAuthReducers,
  theme: themeReducers,
  videoPlayer: videoPlayerReducers,
  comments: comments
});

const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaulMiddleware) =>
    getDefaulMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
const presister = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export { store, presister };
