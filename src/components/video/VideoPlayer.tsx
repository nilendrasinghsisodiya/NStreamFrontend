import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Settings,
  Volume2,
  VolumeOff,
  Maximize,
} from "lucide-react";
import type { Quality } from "@/hooks/useHls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@radix-ui/react-dropdown-menu";
import { toHms } from "@/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "../ui/slider";
import { useVideo } from "@/hooks/useVideo";

type Props = {
  url: string;
  style?: React.CSSProperties;
  className?: string;
};
// better design would be using separate hooks for video state managment and hls
const VideoPlayer = ({ url, style, className }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);

  const {
    setControls,
    isMute,
    isPlaying,
    controls,
    toggleMute,
    totalDuration,
    currentTime,
    togglePlayPause,
    setSeek,
    setVolume,
    setQuality,
    setPlaybackSpeed,
    playbackSpeed,
    volume,
    quality,
    qualities,
  } = useVideo({ videoUrl: url, videoRef });

  useEffect(() => {
    if (!isPlaying) return;

    const timeout = setTimeout(() => {
      setControls(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isPlaying, controls]);

  const toggleFullScreen = useCallback(() => {
    videoWrapperRef.current.requestFullscreen();
  }, [videoWrapperRef]);
  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target) {
      const vol = Number(e.target.value);
      setVolume(vol);
    }
  };

  const handleVolumeClick = () => {
    toggleMute();
  };

  const handleSeeking = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target) {
      const time = parseFloat(e.target.value);
      setSeek(time);
    }
  };

  const handlePlaybackSpeed = (num: number) => {
    if (num) {
      const rate = num;
      setPlaybackSpeed(rate);
    }
  };

  const PlayBackOptions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <div className={` ${className}`}>
      <div
        ref={videoWrapperRef}
        tabIndex={0}
        onMouseEnter={() => setControls(true)}
        className=" relative flex justify-center items-center aspect-video"
      >
        <video
          tabIndex={0}
          ref={videoRef}
          autoPlay
          className="
        flex-1 z-10  contain-content  aspect-video max-h-full"
          style={style}
        />

        {controls && (
          <div className="absolute bottom-0 z-20 flex flex-col w-full pb-1 gap-y-2.5 max-w-full">
            <div className="flex items-basline justify-end gap-0.5 px-2 ">
              <button onClick={handleVolumeClick} tabIndex={0}>
                {isMute ? (
                  <VolumeOff className=" h-3 xl:h-6" />
                ) : (
                  <Volume2 className=" h-3 xl:h-6" />
                )}
              </button>
              <Slider
                sliderTrackValue={volume * 100}
                tabIndex={0}
                className=" h-0.5 rounded-2xl slider max-w-12 xl:max-w-15 p-0 self-end m-1 "
                name="volume"
                min={0}
                max={1}
                step={0.05}
                onChange={handleVolumeChange}
                value={volume}
              />

              <span className="text-[.5rem]">{toHms(currentTime)}/</span>
              <span className="text-[.5rem]">{toHms(totalDuration)}</span>
              <button
                tabIndex={0}
                className="bg-transparent"
                onClick={() => {
                  toggleFullScreen();
                }}
              >
                <Maximize className="h-3 xl:h-6" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="bg-transparent " tabIndex={0}>
                    <Settings className="h-3 xl:h-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-20">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>

                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <div className="flex justify-between p-0 gap-3 items-center">
                          <span>Quality</span>
                          <span
                            className="text-secondary-foreground"
                            tabIndex={0}
                          >
                            {quality?.label}
                          </span>
                        </div>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {qualities ? (
                          qualities.map((qual: Quality, index) => (
                            <DropdownMenuItem key={index}>
                              <Button
                                tabIndex={0}
                                variant="ghost"
                                onClick={() => {
                                  setQuality(qual);
                                }}
                                key={index}
                              >
                                {qual.label}
                              </Button>
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <span>error</span>
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <div className="flex justify-between p-0 gap-3 items-center">
                          <span>Speed</span>
                          <span
                            className="text-secondary-foreground"
                            tabIndex={0}
                          >
                            {playbackSpeed}x
                          </span>
                        </div>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {PlayBackOptions.map((opt, index) => (
                          <DropdownMenuItem
                            onClick={() => handlePlaybackSpeed(opt)}
                            key={index}
                          >
                            <Button
                              variant={"ghost"}
                              className="w-full"
                              tabIndex={0}
                            >
                              {opt}x
                            </Button>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex max-w-full px-2 pb-0.5 items-center gap-2">
              <button
                className="text-foreground"
                onClick={togglePlayPause}
                tabIndex={0}
              >
                {isPlaying ? (
                  <Pause className="h-3 xl:h-3" />
                ) : (
                  <Play fill={"#fff"} className=" h-4 xl:h-6 " />
                )}
              </button>

              <Slider
                tabIndex={0}
                name="progressBar"
                className="appearance-none bg-accent h-1 rounded-full flex-1 w-[90%]  slider"
                value={currentTime}
                sliderTrackValue={(currentTime / totalDuration) * 100}
                min={0.0}
                max={totalDuration}
                step={totalDuration > 600 ? 1 : 0.1}
                onChange={handleSeeking}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { VideoPlayer };
