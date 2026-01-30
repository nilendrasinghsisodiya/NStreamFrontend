import { useGetVideo } from "@/api/VideoApi";
import { convertToHLS } from "@/utils";
import { VideoSkeleton } from "./VideoSkeleton";
import { VideoPlayer } from "./VideoPlayer";
import { useState, useEffect } from "react";
import { ChannelAvatarBar } from "@/components/avatar/Avatars";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToggleVideoLike } from "@/api/LikeApi";
import { AxiosError } from "axios";
import { queryClient } from "@/api/ApiClient";
import { toast } from "sonner";

type Props = {
  videoId: string;
  style?: React.CSSProperties;
  className?: string;
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
const Video = ({ videoId, style, className }: Props) => {
  const { isError, error, data, isLoading, refetch } = useGetVideo(videoId);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { toggleLike } = useToggleVideoLike();

  useEffect(() => {
    queueMicrotask(() => {
      if (data) {
        const url = convertToHLS(data.videoFile);
        setVideoUrl(url);
        setIsLiked(data.isLiked);
      }
    });
  }, [data, setVideoUrl]);
  console.log(data);
  const handleLike = async () => {
    try {
      await toggleLike({ targetId: videoId });
      setIsLiked((prev) => !prev);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["likedVideos"] });
    } catch (error: unknown) {
      if (error instanceof AxiosError) toast.error("failed to like video");
    }
  };
  return (
    <>
      {isLoading || !data ? (
        <VideoSkeleton />
      ) : (
        <div className={`${className}`}>
          <div
            className="flex flex-col w-full h-full gap-4   p-0"
            style={style}
          >
            {isError ? (
              <span className="self-center justify-self-center">
                {error?.message}
              </span>
            ) : (
              <div className="flex flex-col  w-full  py-2  items-center px-1 m-auto ">
                <VideoPlayer
                  url={videoUrl}
                  className=" w-fit main_shadow rounded-md sm:rounded-2xl border-2  contain-content border-transparent
                 "
                />

                <div className="flex flex-col itesm-center  mx-3 h-max-[40px] p-4 w-full h-fit">
                  <span className="flex  text-foreground text-md sm:text-xl md:text-xl lg-text-2xl font-bold text-wrap w-full ml-3 ">
                    {data?.title}
                  </span>
                  <span className="flex  items-center justify-evenly text-secondary-foreground ml-3 gap-3 h-fit w-full">
                    <span className="flex gap-2 w-fit h-full items-center justify-center justify-self-start">
                      <span className=" text-xs xl:text-sm ">
                        {data ? data.views : 0} views
                      </span>
                      <span className=" text-xs xl:text-sm">
                        {data?.likesCount} likes
                      </span>
                    </span>
                    <Button
                      className="h-fit w-fit m-auto"
                      variant={"ghost"}
                      onClick={handleLike}
                    >
                      {isLiked ? <ThumbsUp fill="white" /> : <ThumbsUp />}
                    </Button>
                  </span>

                  {data.owner && (
                    <ChannelAvatarBar
                      username={data.owner.username}
                      subscriberCount={data.owner.subscribersCount}
                      avatar={data.owner.avatar}
                      channelId={data.owner._id}
                      isSubscribed={data.isSubscribed}
                      videoId={videoId}
                    />
                  )}
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
