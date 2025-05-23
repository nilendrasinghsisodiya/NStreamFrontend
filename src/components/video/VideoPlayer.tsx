import { ChangeEvent, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Settings,
  Volume2,
  VolumeOff,
  Maximize,
} from "lucide-react";

import Hls from "hls.js";
import "plyr-react/plyr.css";
import {
  Quality,
  selectVideoPlayer,
  setAvalQuality,
  setCurrentTime,
  setPlaybackSpeed,
  setQuality,
  setTotalTime,
  setVolume,
  togglePlay,
  toggleControls,
  toggleFullScreen,
  reset
  
} from "@/contexts/videoPlayer/videoPlayerSlices";
import { useSelector } from "react-redux";
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
import { useDispatch } from "react-redux";
import { toHms } from "@/utils";
import { Button } from "@/components/ui/button";

type Props = {
  url: string;
  style?: React.CSSProperties;
  className?: string;
};

const VideoPlayer = ({ url, style, className }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dispatch = useDispatch();
  const {
    currentTime,
    isPlaying,
    playbackSpeed,
    quality,
    totalTime,
    volume,
    avalQuality,
    controls,
  } = useSelector(selectVideoPlayer);

  useEffect(() => {
    if (videoRef.current && Hls.isSupported()) {
      const hls = new Hls();
      dispatch(reset())
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log("event", event, "data", data);
        const levels = data.levels;
        const options: Quality[] = [];
        levels.map((level) => {
          switch (level.width) {
            case 1080:
              options.push("1080p");
              break;
            case 720:
              options.push("720p");
              break;
            case 480:
              options.push("480p");
              break;
            case 360:
              options.push("360p");
              break;
            case 240:
              options.push("240p");
              break;
            default:
              break;
          }
        });
        console.log("options", options);
        dispatch(setAvalQuality(options));
      });

      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        console.log("event", event, "data", data);
        const details = data.details;
        if (data.details) {
          console.log("deatails", details);
          dispatch(setCurrentTime(details.driftStartTime));
          dispatch(setTotalTime(details.totalduration));
        }
      });
      hls.on(Hls.Events.ERROR, (event, err) => {
        console.log("event", event, "err", err);
      });
    }
  }, [url, dispatch]);
  useEffect(() => {
    if (videoRef.current) {
      const ele = videoRef.current;
      const updateTime = () => dispatch(setCurrentTime(ele.currentTime || 0));
      videoRef.current.addEventListener("timeupdate", updateTime);
      return () => ele.removeEventListener("timeupdate", updateTime);
    }
  }, [currentTime, dispatch]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
      const currTime = videoRef.current.currentTime;
      dispatch(setCurrentTime(currTime));
      dispatch(togglePlay());
    }
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      const curTime = videoRef.current.currentTime;
      dispatch(setCurrentTime(curTime));
    }
  }, [isPlaying, dispatch, currentTime]);

  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        if (controls) {
          dispatch(toggleControls());
        }
      }, 4500);
    }
  }, [dispatch, isPlaying, controls]);

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && videoRef.current) {
      const eVolume = parseFloat(e.target.value);
      dispatch(setVolume(eVolume));
      videoRef.current.volume = eVolume / 100; // to keep it in a acceptable range of [0,1]
    }
  };

  const handleVolumeClick = () => {
    if (volume > 0 && videoRef.current) {
      dispatch(setVolume(0));
      videoRef.current.volume = 0; // to keep it in a acceptable range of [0,1]
    } else {
      if (videoRef.current && volume === 0) {
        dispatch(setVolume(50));
        videoRef.current.volume = 0.5;
      }
    }
  };

  const handleSeeking = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && videoRef.current) {
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
      dispatch(setCurrentTime(time));
    }
  };

  const handlePlaybackSpeed = (num: number) => {
    if (num && videoRef.current) {
      const rate = num;
      dispatch(setPlaybackSpeed(rate));
      videoRef.current.playbackRate = rate;
    }
  };

  const PlayBackOptions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <div
      className={` ${className}`}
      onClick={() => {
        if (!controls) {
          dispatch(toggleControls());
        }
      }}
    >
      <div
        tabIndex={0}
        className=" relative main_shadow flex justify-center contain-content items-center aspect-video"
      >
        <video
          ref={videoRef}
          className="
        flex-1 z-10  contain-content lg:rounded-2xl aspect-video max-h-full"
          style={style}
        />

        {controls && (
          <div className="absolute bottom-0 controls z-20 flex flex-col w-full p-2">
            <div className="flex control-icons h-2 my-0.5 self-end p-5 gap-3">
              <div className="volumeControls  flex w-[50%] p-0 justify-center items-center  self-baseline gap-3">
                <Button variant="ghost"onClick={handleVolumeClick}>
                  {volume === 0 ? (
                    <VolumeOff className=" icons-s" />
                  ) : (
                    <Volume2 className=" icons-s" />
                  )}
                </Button>
                <input
                  className="slider bg-foreground h-[2px] flex-1 max-w-[80px]"
                  type="range"
                  name="volume"
                  min={0}
                  max={100}
                  step={5}
                  onChange={handleVolumeChange}
                  value={volume}
                />
              </div>

              <div className="flex items-center self-baseline md:m-0 justify-end gap-2">
                <DropdownMenu modal>
                  <DropdownMenuTrigger>
                    <div className="flex gap-3 p-0 justify-center items-center text-accent-foreground md:text-md text-2xl outline-2 outline-red-300 ">
                      <Settings className="text-foreground  icons-s  items-center " />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-20">
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>

                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <div className="flex justify-between p-0 gap-3 items-center">
                            <span>Quality</span>
                            <span className="text-secondary-foreground">
                              {quality}
                            </span>
                          </div>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {avalQuality ? (
                            avalQuality.map((qual: Quality, index) => (
                              <DropdownMenuItem
                              >
                                <Button variant="ghost" onClick={() => {
                                  dispatch(setQuality(qual));
                                }}
                                key={index}>
                                {qual}
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
                            <span className="text-secondary-foreground">
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
                              <Button variant={"ghost"} className="w-full">
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
              <div className="self-baseline p-2 text-xs md:text-md lg:text-xl mx-3">
                <span>{toHms(currentTime)}/</span>
                <span>{toHms(totalTime)}</span>
              </div>
              <div className="maximize">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.requestFullscreen();
                      dispatch(toggleFullScreen());
                    }
                  }}
                >
                  <Maximize className="flex items-center self-baseline" />
                </Button>
              </div>
            </div>

            <div className="flex w-[95%] items-center gap-2">
              
                <button className="text-foreground" onClick={handlePlayPause}>
                  {isPlaying ? (
                    <Pause className="icons-m" />
                  ) : (
                    <Play fill={"#fff"} className=" icons-m" />
                  )}
                </button>
            
              <input
                name="progressBar"
                className="slider bg-foreground h-[2px] flex-1 w-[90%]  border-[0.5px] border-foreground"
                type="range"
                value={currentTime}
                min={0.0}
                max={totalTime}
                step={totalTime > 600 ? 1 : 0.1}
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
