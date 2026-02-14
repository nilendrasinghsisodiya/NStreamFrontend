import React, { useState, useCallback, useEffect } from "react";
import { useHls } from "@/hooks/useHls";
import type { Quality } from "@/hooks/useHls";
import { useThrottle } from "./useThrottle";
import Hls from "hls.js";
type props = {
  videoUrl: string;
  videoRef: React.RefObject<HTMLVideoElement>;
};
export function useVideo({ videoUrl, videoRef }: props) {
  // hooks
  const { qualities, hlsRef, totalDuration } = useHls({ videoUrl, videoRef });
  // states
  const [qual, setQual] = useState<Quality | {}>({});
  const [ps, setPs] = useState<number>(1.0);
  const [curTime, setCurTime] = useState<number>(0);
  const [vol, setVol] = useState<number>(0.5);
  const [isMute, setIsMute] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [controls, setControls] = useState<boolean>(true);

  const sct = () => {
    if (videoRef && videoRef.current) {
      console.log("updating current time");
      setCurTime(videoRef.current.currentTime);
    }
  };
  const throttledCurrentTime = useThrottle(sct, 80);

  // utility functions
  const setPlay = useCallback(
    (b: boolean) => {
      const video = videoRef.current;
      if (b) {
        video?.play();
      } else {
        video?.pause();
      }
    },
    [videoRef],
  );
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (video.paused) {
      video?.play();
    } else {
      video?.pause();
    }
  }, [videoRef]);
  const setQuality = useCallback(
    (q: Quality) => {
      if (hlsRef && hlsRef.current) {
        const hls = hlsRef.current;
        const qNum = q.index;
        hls.currentLevel = qNum;
        setQual(q);
      }
    },
    [hlsRef],
  );
  const setVolume = useCallback(
    (n: number) => {
      const video = videoRef.current;
      video.volume = n;
    },
    [videoRef],
  );
  const setPlaybackSpeed = useCallback(
    (n: number) => {
      const video = videoRef.current;
      video.playbackRate = n;
    },
    [videoRef],
  );
  const toggleControls = useCallback(() => {
    setControls((prev) => !prev);
  }, []);
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    video.volume = 0;
    video.muted = !video.muted;
  }, [videoRef]);
  const setSeek = useCallback(
    (n: number) => {
      videoRef.current.currentTime = n;
    },
    [videoRef],
  );

  const setCtrls = (b: boolean) => setControls(b);

  // effects

  // state sync
  useEffect(() => {
    const video = videoRef.current;

    // handlers
    const currentTimeHandler = () => {
      throttledCurrentTime();
    };
    const volHandler = () => {
      setVol(video.volume);
      setIsMute(video.muted);
    };
    const psHandler = () => {
      setPs(video.playbackRate);
    };
    const playHandler = () => {
      setIsPlaying(true);
    };
    const pauseHandler = () => {
      setIsPlaying(false);
    };

    // event listeners
    video.addEventListener("timeupdate", currentTimeHandler);
    video.addEventListener("play", playHandler);
    video.addEventListener("pause", pauseHandler);
    video.addEventListener("volumechange", volHandler);
    video.addEventListener("ratechange", psHandler);

    // clean up
    return () => {
      video.removeEventListener("timeupdate", currentTimeHandler);
      video.removeEventListener("play", playHandler);
      video.removeEventListener("pause", pauseHandler);
      video.removeEventListener("ratechange", psHandler);
      video.removeEventListener("volumechange", volHandler);
    };
  }, [videoRef]);

  useEffect(() => {
    if (!qualities) return;
    if (!hlsRef.current) return;
    if (hlsRef.current) {
      const hls = hlsRef.current;
      const handler = () => {
        console.log("hls level switching");
        if (qualities) {
          const qual = qualities[hls.currentLevel];
          console.log("qaul swtiched to", qual);
          setQual(qual);
        }
      };
      hls.on(Hls.Events.LEVEL_SWITCHED, handler);
    }
  }, [hlsRef, qualities]);
  return {
    // togglers
    toggleControls,
    togglePlayPause,
    toggleMute,

    // setters
    setPlay,
    setQuality,
    setVolume,
    setSeek,
    setPlaybackSpeed,
    setControls: setCtrls,

    // state
    volume: vol,
    playbackSpeed: ps,
    currentTime: curTime,
    isPlaying,
    controls,
    quality: qual,
    isMute,
    qualities,
    totalDuration,
  };
}
