import { VideoCardSkeleton } from "./VideoCardSkeleton";
import { generateSrcSet, toHms } from "@/utils";
import { VideoAvatarStrip } from "../avatar/Avatars";
import { memo } from "react";
import { useNavigate } from "react-router";
import { VideoOptions } from "./VideoOptions";
import { CircleSlash } from "lucide-react";

type Props = {
  thumbnail: string;
  title: string;
  likesCount?: number;
  viewsCount: number;
  style?: React.CSSProperties;
  owner: Pick<IUser, "avatar" | "_id" | "username" | "subscribersCount">;
  videoId: string;
  isSuccess: boolean;
  lazyLoading: boolean;
  className?: string;
  isLoading: boolean;
  duration: number;
};

const VideoCard = ({
  thumbnail,
  title,
  style,
  owner,
  videoId,
  lazyLoading,
  isLoading,
  isSuccess,
  duration,
  className,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div
      tabIndex={0}
      style={style}
      onClick={() => {
        navigate(`/watch?videoId=${videoId}`);
      }}
      //className={`flex flex-col cursor-pointer p-1 w-full h-full border-2 md:rounded-xl gap-2   ${className}`}
      className={` flex flex-col p-1 border-2 rounded-xl gap-2 ${className}`}
    >
      {!isLoading ? (
        isSuccess ? (
          <>
            {thumbnail.length > 0 ? (
              <span className="relative w-full">
                <img
                  src={thumbnail}
                  alt={`${title}'s thumbnail`}
                  srcSet={generateSrcSet(thumbnail)}
                  className="object-cover aspect-video  md:rounded-2xl lg:rounded-2xl m-0.5   "
                  loading={lazyLoading ? "lazy" : "eager"}
                  width="100%"
                  height="100%"
                />
                <span className="absolute bottom-1 text-[3px] right-1 p-0.5 rounded-sm  bg-foreground text-background">
                  {toHms(duration)}
                </span>
              </span>
            ) : (
              <span className="max-w-full min-w-1/2 lg:rounded-3xl aspect-video m-0.5 bg-accent">
                <CircleSlash className="h-1/2 w-1/2" />
              </span>
            )}
            <div className="flex w-full items-center justify-center">
              <VideoAvatarStrip
                avatar={owner.avatar}
                subsCount={owner.subscribersCount}
                username={owner.username}
                videoTitle={title}
                videoId={videoId}
                className={`flex flex-col w-full  z-40 px-2  ${className}`}
              />

              <VideoOptions videoId={videoId} />
            </div>
          </>
        ) : (
          <span>something went wrong</span>
        )
      ) : (
        <VideoCardSkeleton />
      )}
    </div>
  );
};

type videoCardPlaylistProps = {
  thumbnail: string;
  title: string;
  likesCount?: number;
  viewsCount: number;
  style?: React.CSSProperties;
  isLoading: boolean;
  duration:number;
  owner: Pick<IUser, "avatar" | "_id" | "username" | "subscribersCount">;
  videoId: string;
  isSuccess: boolean;
  lazyLoading: boolean;
};

export const VideoCardPlaylist = ({
  thumbnail,
  title,
  style,
  isLoading,
  owner,
  duration,
  videoId,
  lazyLoading,
  isSuccess,
}: videoCardPlaylistProps) => {
  const navigate = useNavigate();

  return (
    <>
      {isLoading ? (
        <VideoCardSkeleton />
      ) : (
        <div
          tabIndex={0}
          style={style}
          onClick={() => {
            navigate(`/watch?videoId=${videoId}`);
          }}
          className={`flex  flex-col  justify-items-center  cursor-pointer p-2  h-full w-full border-2 md:rounded-xl gap-2 my-5  `}
        >
          {isSuccess ? (
            <><span className="w-full h-full aspect-video relative">
              <img
                src={thumbnail}
                alt={`${title}'s thumbnail`}
                srcSet={generateSrcSet(thumbnail)}
                className="object-cover aspect-video  md:rounded-2xl lg:rounded-3xl m-0.5   min-h-50  "
                loading={lazyLoading ? "lazy" : "eager"}
                width="100%"
                height="100%"
              />
              <span className="absolute text-[3px] text-background bg-foreground bottom-3 p-0.5 rounded-sm right-1  ">{toHms(duration)}</span>
              </span>
              <div className="flex w-full items-center justify-center">
                <VideoAvatarStrip
                  avatar={owner.avatar}
                  subsCount={owner.subscribersCount}
                  username={owner.username}
                  videoTitle={title}
                  videoId={videoId}
                  className="flex flex-col w-full  z-40 px-5"
                />
              </div>
            </>
          ) : (
            <span>something went wrong</span>
          )}
        </div>
      )}
    </>
  );
};

export const MemoVideoCard = memo(VideoCard);

export { VideoCard };
