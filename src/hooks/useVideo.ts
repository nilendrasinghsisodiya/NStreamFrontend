import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useHls } from "@/hooks/useHls";
import type { Quality } from "@/hooks/useHls";
import { useThrottle } from "./useThrottle";
type props = {
	videoUrl: string;
	videoRef: React.RefObject<HTMLVideoElement>;
};
export function useVideo({ videoUrl, videoRef }: props) {
	// hooks
	const { qualities, hlsRef, totalDuration } = useHls({ videoUrl });
	// states
	const [qual, setQual] = useState<Quality>(qualities[hlsRef.current.currentLevel]);
	const [ps, setPs] = useState<number>(1.0);
	const [curTime, setCurTime] = useState<number>(0);
	const [vol, setVol] = useState<number>(0.5);
	const [isMute, setIsMute] = useState<boolean>(false);
	const [isPlaying, setIsPlaying] = useState<boolean>(true);
	const [controls, setControls] = useState<boolean>(true);


	const sct = () => {
		if (videoRef && videoRef.current) {
			setCurTime(videoRef.current.currentTime);
		}
	}
	const throttledCurrentTime = useThrottle(sct, 200);

	// utility functions
	const setPlay = useCallback((b: boolean) => {
		const video = videoRef.current;
		if (b) {
			video?.play();
		}
		else {
			video?.pause();
		}
	}, [videoRef]);
	const togglePlayPause = useCallback(() => {
		const video = videoRef.current;
		if (isPlaying) {
			video?.pause();

		} else {
			video?.play();
		}

	}, [videoRef]);
	const setQuality = useCallback((q: Quality) => {
		const hls = hlsRef.current;
		const qNum = q.index;
		hls.currentLevel = qNum;
		setQual(q);
	}, [hlsRef]);
	const setVolume = useCallback((n: number) => {
		const video = videoRef.current;
		video.volume = n;
	}, [videoRef]);
	const setPlaybackSpeed = useCallback((n: number) => {
		const video = videoRef.current;
		video.playbackRate = n;
	}, [videoRef]);
	const toggleControls = useCallback(() => {
		setControls((prev) => !prev);
	}, []);
	const toggleMute = useCallback(() => {
		const video = videoRef.current;
		video.muted = !video.muted;
	}, [videoRef]);
	const toggleFullScreen = useCallback(() => {
		videoRef.current.requestFullscreen();
	}, [videoRef]);
	const setSeek = useCallback((n: number) => {
		videoRef.current.currentTime = n;
	}, [videoRef]);


	// effects

	// state sync
	useEffect(() => {
		const video = videoRef.current;

		// handlers
		const currentTimeHandler = () => { throttledCurrentTime(); }
		const volHandler = () => {
			setVol(video.volume);
			setIsMute(video.muted)
		}
		const psHandler = () => {
			setPs(video.playbackRate)
		}
		const playHandler = () => {
			setIsPlaying(true)
		}
		const pauseHandler = () => { setIsPlaying(false); }

		// event listeners
		video.addEventListener("timeupdate", currentTimeHandler);
		video.addEventListener("play", playHandler);
		video.addEventListener("pause", pauseHandler)
		video.addEventListener("volumechange", volHandler)
		video.addEventListener("ratechangee", psHandler);

		// clean up
		return () => {
			video.removeEventListener("timeupdate", currentTimeHandler);
			video.removeEventListener("play", playHandler);
			video.removeEventListener("pause", pauseHandler);
			video.removeEventListener("ratechange", psHandler);
			video.removeEventListener("volumechange", volHandler);
		}
	}, [videoRef])

	// load video source
	useEffect(() => {
		if (hlsRef && hlsRef.current) {
			if (videoRef && videoRef.current) {
				const hls = hlsRef.current;
				hls.attachMedia(videoRef.current);
			}
		}

	}, [hlsRef, videoRef])

	return {
		// togglers
		toggleControls,
		togglePlayPause,
		toggleMute,
		toggleFullScreen,

		// setters
		setPlay,
		setQuality,
		setVolume,
		setSeek,
		setPlaybackSpeed,

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
	}
}
