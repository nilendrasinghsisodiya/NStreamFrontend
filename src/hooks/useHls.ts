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
type Qualities =
	"360p"
	| "480p"
	| "720p"
	| "1080p"
	| "1440p"
	| "240p"
	| "2160p";
export type Quality = { q: Qualities; index: number; }

export function useHls({ videoUrl, videoRef }: props): HlsObject {
	const [qualities, setQualities] = useState<Quality[]>([]);
	const hlsRef = useRef<Hls | null>(null);
	const [totalDuration, setTotalDuration] = useState<number>(0);
	useEffect(() => {
		if(!videoUrl) return;
		if (!Hls.isSupported()) { console.log("hls not supported"); return; }
		if (videoRef.current && !hlsRef.current) {
			console.log("hlsRef init");
			hlsRef.current = new Hls();
			console.log("videoURl",videoUrl);
			const hlsSrc = convertToHLS(videoUrl);
			console.log("hlssrc", hlsSrc)
			const hls = hlsRef.current;
			console.log("hls attaching media")
			hls.attachMedia(videoRef.current);
			hls.loadSource(hlsSrc);
			const quals: Quality[] = [];
			hls.on(Hls.Events.MEDIA_ATTACHED, () => console.log("HLS media attached"))
			hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
				const levels = data.levels;
				console.log("video levels", levels);
				levels.map((level, index) => {
					switch (level.height) {
						case 1080:
							quals.push({ q: "1080p", index });
							break;
						case 720:
							quals.push({ q: "720p", index });
							break;
						case 360:
							quals.push({ q: "360p", index });
							break;
						case 480:
							quals.push({ q: "480p", index });
							break;
						case 240:
							quals.push({ q: "240p", index });
							break;
						case 1440:
							quals.push({ q: "1440p", index });
							break;
						case 2160:
							quals.push({ q: "2160p", index });
							break;
						default:
							break;
					}
					setQualities(quals);
					console.log(quals);
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
		}
	}, [videoUrl]);
	return { qualities, totalDuration, hlsRef };
}
