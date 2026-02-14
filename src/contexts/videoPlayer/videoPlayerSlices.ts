import { RootState } from "@/ContextStore";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type Quality = "1080p" | "720p" | "480p" | "360p" | "240p";
export interface videoPlayStateType {
  totalTime: number;
  quality: Quality;
  playbackSpeed: number;
  volume: number;
  avalQuality: Quality[] | [];
  isFullScreen: boolean;
}
const initialState: videoPlayStateType = {
  totalTime: 0.0,
  quality: "480p",
  playbackSpeed: 1,
  volume: 0.5,
  avalQuality: [],
  isFullScreen: false,
};
const VideoPlayerSlice = createSlice({
  name: "videoPlayerSlice",
  initialState,
  reducers: {
    setTotalTime: (state, action: PayloadAction<number>) => {
      state.totalTime = action.payload;
    },
    setQuality: (state, action: PayloadAction<Quality>) => {
      state.quality = action.payload;
    },
    setPlaybackSpeed: (state, action: PayloadAction<number>) => {
      const allowedSpeeds = [0.5, 0.75, 0.25, 1, 1.25, 1.5, 1, 75, 2];
      if (allowedSpeeds.includes(action.payload)) {
        state.playbackSpeed = action.payload;
      }
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.min(100, Math.max(0, action.payload));
    },
    setAvalQuality: (state, action: PayloadAction<Quality[]>) => {
      const options: Quality[] = ["1080p", "720p", "480p", "360p", "240p"];
      const params = action.payload;
      console.log("avalQualityset", params);
      params.map((p: Quality, index: number) => {
        if (options.includes(p)) {
          console.log(state.avalQuality);
          state.avalQuality[index] = p;
        }
      });
    },

    toggleFullScreen: (state) => {
      state.isFullScreen = !state.isFullScreen;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setVolume,
  setTotalTime,
  setQuality,
  setPlaybackSpeed,
  setAvalQuality,
  toggleFullScreen,
  reset,
} = VideoPlayerSlice.actions;
export const selectVideoPlayer = (state: RootState) => state.videoPlayer;
export default VideoPlayerSlice.reducer;
