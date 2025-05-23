import { useGetVideo } from "@/api/VideoApi";
import { convertToHLS} from "@/utils";
import { VideoSkeleton } from "./VideoSkeleton";
import { VideoPlayer } from "./VideoPlayer";
import { useState, useEffect } from "react";
import { ChannelAvatarBar } from "@/components/avatar/Avatars";

type Props = {
  videoId: string;
  style?: React.CSSProperties;
  className?:string;
};

/**
 * @component - displays a custom VideoPlayer component with HLS enabled and videoTitle and number of view and like that video have.
 * @example
 * ```tsx
 *  <IVideo videoUrl="43akjdfkasnknsa20kljj"  style={{backgroundColor:"black"}}/>
 *
 * @params -Object -Props
 * @param videoId - a string contain videoId from mongoDb
 * @param style - a object - React.CSSProperties for forced styling and applying in-line styling
 */
const Video = ({ videoId, style,className }: Props) => {
  const { isError, error, data, isLoading } = useGetVideo(videoId);
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    if (data) {
      const url = convertToHLS(data.videoFile);
      setVideoUrl(url);
    }
  }, [data, setVideoUrl]);
  console.log(data);

  return (
    <>
      {isLoading || !data ? (
        <VideoSkeleton />
      ) : (
        <div className={`${className}`}>
          <div className="flex flex-col w-full h-full gap-4   p-0" style={style}>
            {isError ? (
              <span className="self-center justify-self-center">
                {error?.message}
              </span>
            ) : (
              <div className="flex flex-col  w-full  py-2  items-center ">
                <VideoPlayer
                  url={videoUrl}
                  className="
                  outline-1 outline-red-400 md:rounded-2xl max-w-full max-h-full md:w-3/4 md:h-full aspect-video
                 "
                />
                <div className="flex self-start">
                  <div className="flex flex-col itesm-center mx-3 h-max-[40px]">
                    <span className="flex  text-foreground text-[1.5rem] md:text-[2rem] font-bold text-wrap w-full self-start ml-3">
                      {data?.title}
                    </span>
                    <span className="flex  items-center text-secondary-foreground ml-3">
                      <span className=" text-xl ">
                        {data ? (data.views) : 0} views
                      </span>
                      <span className=" text-xl ">{data?.likesCount}</span>
                    </span>

                    {data.ownerDetails && (
                      <ChannelAvatarBar
                        username={data.ownerDetails.username}
                        subscriberCount={data.subscriberCount}
                        avatar={data.ownerDetails.avatar}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export { Video };
