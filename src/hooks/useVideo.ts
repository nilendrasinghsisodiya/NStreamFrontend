import React, { useState, useCallback, useMemo } from "react";
import { useHls } from "@/hooks/useHls";
import type { Quality } from "@/hooks/useHls";
type props = {
  videoUrl: string;
  videoRef: React.RefObject<HTMLVideoElement>;
};
export function useVideo({ videoUrl, videoRef }: props) {
  // hooks
  const { qualities, hlsRef, totalDuration } = useHls({ videoUrl, videoRef });
  // states
  const [quality, setQuality] = useState<Quality>("480p");
  const [ps, setPs] = useState<number>(1.0);
  const [curTime, setCurTime] = useState<number>(0);
  const [vol, setVol] = useState<number>(0.5);
  const [isMute, setIsMute] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [controls, setControls] = useState<boolean>(true);

  // utility functions
  const setPlay = useCallback((b: boolean) => {}, []);
  const togglePlayPause = useCallback(() => {}, []);
  const setQual = useCallback((q: Quality) => {}, []);
  const setVolume = useCallback((n: number) => {}, []);
  const setCurrentTime = useCallback((n: number) => {}, []);
  const setPlaybackSpeed = useCallback((n: number) => {}, []);
  const toggleControls = useCallback(() => {}, []);
  const toggleMute = useCallback(() => {}, []);
  const toggleFullScreen = useCallback(() => {}, []);
  const api = useMemo(() => {
    return {
      // togglers
      toggleControls,
      togglePlayPause,
      toggleMute,
      toggleFullScreen,

      // setters
      setPlay,
      setQual,
      setVolume,
      setCurrentTime,
      setPlaybackSpeed,

      // state
      volume: vol,
      playbackSpeed: ps,
      currentTime: curTime,
      isPlaying,
      controls,
      quality,
      isMute,
      qualities,
      totalDuration,
    };
  }, [
    // setters
    setPlay,
    setVolume,
    setCurrentTime,
    setQuality,
    setPlaybackSpeed,
    toggleFullScreen,

    // togglers
    toggleControls,
    togglePlayPause,
    toggleMute,

    // states
    vol,
    ps,
    curTime,
    isPlaying,
    isMute,
    quality,
    qualities,
    totalDuration,
  ]);

  return api;
}
