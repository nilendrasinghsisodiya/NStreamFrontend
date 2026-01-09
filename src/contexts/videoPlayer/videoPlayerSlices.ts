import { RootState } from "@/ContextStore";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type Quality = "1080p" | "720p" | "480p" | "360p" | "240p";
export interface videoPlayStateType {
  currentTime: number;
  totalTime: number;
  isPlaying: boolean;
  quality: Quality;
  playbackSpeed: number;
  volume: number;
  avalQuality: Quality[] | [];
  isFullScreen: boolean;
  controls: boolean;
}
const initialState: videoPlayStateType = {
  currentTime: 0.0,
  totalTime: 0.0,
  isPlaying: false,
  quality: "480p",
  playbackSpeed: 1,
  volume: 0.5,
  avalQuality: [],
  isFullScreen: false,
  controls: true,
};
const VideoPlayerSlice = createSlice({
  name: "videoPlayerSlice",
  initialState,
  reducers: {
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },

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
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
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
    toggleControls: (state) => {
      state.controls = !state.controls;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  togglePlay,
  setVolume,
  setCurrentTime,
  setTotalTime,
  setQuality,
  setPlaybackSpeed,
  setAvalQuality,
  toggleControls,
  toggleFullScreen,
  reset,
} = VideoPlayerSlice.actions;
export const selectVideoPlayer = (state: RootState) => state.videoPlayer;
export default VideoPlayerSlice.reducer;
