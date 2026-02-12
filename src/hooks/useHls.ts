import React, { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
import { convertToHLS } from "@/utils";

type props = {
  videoUrl: string;
  videoRef: React.RefObject<HTMLVideoElement>;
};
type HlsObject = {
  qualities: Quality[];
  totalDuration: number;
  hlsRef: React.RefObject<Hls>;
};
export type Quality =
  | "360p"
  | "480p"
  | "720p"
  | "1080p"
  | "1440p"
  | "240p"
  | "2160p";

export function useHls({ videoUrl, videoRef }: props): HlsObject {
  const [qualities, setQualities] = useState<Quality[]>([]);
  const hlsRef = useRef<Hls | null>(null);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  useEffect(() => {
    if (!Hls.isSupported()) return;
    if (hlsRef && hlsRef.current) return;
    if (!videoRef && !videoRef.current) return;
    hlsRef.current = new Hls();
    const hlsSrc = convertToHLS(videoUrl);
    const hls = hlsRef.current;
    const video = videoRef.current;
    hls.loadSource(hlsSrc);
    hls.attachMedia(video);
    const quals: Quality[] = [];
    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      const levels = data.levels;
      console.log("video levels", levels);
      levels.map((level) => {
        switch (level.width) {
          case 1080:
            quals.push("1080p");
            break;
          case 720:
            quals.push("720p");
            break;
          case 360:
            quals.push("360p");
            break;
          case 480:
            quals.push("480p");
            break;
          case 240:
            quals.push("240p");
            break;
          case 1440:
            quals.push("1440p");
            break;
          case 2160:
            quals.push("2160p");
            break;
          default:
            break;
        }
        setQualities(quals);
      });
      hls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
        if (data.details) {
          setTotalDuration(data.details.totalduration);
        }
      });
      hls.on(Hls.Events.ERROR, (_, error) => {
        console.error("hls error:: ", error);
      });
    });

    return () => hls.destroy();
  }, [videoUrl, videoRef]);
  return { qualities, totalDuration, hlsRef };
}
