import React, { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
import { convertToHLS, getQualityLabel } from "@/utils";

type props = {
  videoUrl: string;
  videoRef: React.RefObject<HTMLVideoElement>;
};
type HlsObject = {
  qualities: Quality[];
  totalDuration: number;
  hlsRef: React.RefObject<Hls>;
};
type QualityLabel =
  | "360p"
  | "480p"
  | "720p"
  | "1080p"
  | "1440p"
  | "240p"
  | "2160p";
export type Quality = { label: QualityLabel; index: number; height: number };

export function useHls({ videoUrl, videoRef }: props): HlsObject {
  const [qualities, setQualities] = useState<Quality[]>([]);
  const hlsRef = useRef<Hls | null>(null);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  useEffect(() => {
    if (!videoUrl) return;
    if (!Hls.isSupported()) {
      console.log("hls not supported");
      return;
    }
    if (videoRef.current && !hlsRef.current) {
      console.log("hlsRef init");
      hlsRef.current = new Hls();
      console.log("videoURl", videoUrl);
      const hlsSrc = convertToHLS(videoUrl);
      console.log("hlssrc", hlsSrc);
      const hls = hlsRef.current;
      console.log("hls attaching media");
      hls.attachMedia(videoRef.current);
      hls.loadSource(hlsSrc);
      const quals: Quality[] = [];
      hls.on(Hls.Events.MEDIA_ATTACHED, () =>
        console.log("HLS media attached"),
      );
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const levels = data.levels;
        console.log("video levels", levels);
        levels.map((level, index) => {
          const label = getQualityLabel(level.height) as QualityLabel;
          quals.push({ label, height: level.height, index });
        });
        hls.currentLevel = -1;
        const uQuals = [
          ...new Map(quals.map((item) => [item.label, item])).values(),
        ];
        console.log("uQuals", uQuals);
        setQualities(uQuals);
        hls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
          if (data.details) {
            setTotalDuration(data.details.totalduration);
          }
        });
        hls.on(Hls.Events.ERROR, (_, error) => {
          console.error("hls error:: ", error);
        });
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }
  }, [videoUrl]);
  return { qualities, totalDuration, hlsRef };
}
