import { VideoCardSkeleton } from "./VideoCardSkeleton";
import { generateSrcSet, toHms } from "@/utils";
import { VideoAvatarStrip } from "../avatar/Avatars";
import { memo } from "react";
import { useNavigate } from "react-router";
import { VideoOptions } from "./VideoOptions";
import { CircleSlash } from "lucide-react";

interface IVideoCardProps {
  thumbnail: string;
  title: string;
  likesCount?: number;
  viewsCount: number;
  style?: React.CSSProperties;
  owner: Pick<IUser, "avatar" | "_id" | "username" | "subscribersCount">;
  videoId: string;
  isSuccess: boolean;
  lazyLoading: boolean;
  avatarClassName?: string;
  isLoading: boolean;
  duration: number;
}

const VideoCard = ({
  thumbnail,
  title,
  style,
  viewsCount,
  owner,
  videoId,
  lazyLoading,
  isSuccess,
  duration,
  avatarClassName,
}: IVideoCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      tabIndex={0}
      style={style}
      onClick={() => {
        navigate(`/watch?videoId=${videoId}`);
      }}
      //className={`flex flex-col cursor-pointer p-1 w-full h-full border-2 md:rounded-xl gap-2   ${className}`}
      className={` flex flex-col p-1 border-2 sm:rounded-md md:rounded-lg lg:rounded-xl gap-2 w-full h-full `}
    >
      {isSuccess ? (
        <>
          {thumbnail.length > 0 ? (
            <span className="relative w-full aspect-video shrink-0">
              <img
                src={thumbnail}
                alt={`${title}'s thumbnail`}
                srcSet={generateSrcSet(thumbnail)}
                className="absolute inset-0 w-full h-full object-cover md:rounded-2xl"
                loading={lazyLoading ? "lazy" : "eager"}
              />
              <span className="absolute bottom-1 right-1 text-[10px] px-1 py-0.5 rounded-sm bg-foreground text-background">
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
              subscribersCount={owner.subscribersCount}
              username={owner.username}
              videoTitle={title}
              views={viewsCount}
              navigateOnAvatarClick
              
              className={`flex flex-col w-full   px-2  ${avatarClassName}`}
            />

            <VideoOptions videoId={videoId} />
          </div>
        </>
      ) : (
        <span className="p-1 border-2  sm:rounded-md md:round-lg lg:round-xl gap-2 w-full h-full text-center text-md ">something went wrong</span>
      )}
    </div>
  );
};
export interface ListVideoCardProps extends IVideoCardProps {
  avatarClassName: string;
  className:string;
}
const ListVideoCard = ({
  thumbnail,
  title,
  style,
  owner,
  videoId,
  lazyLoading,
  avatarClassName,
  isLoading,
  isSuccess,
  duration,
  className,
  viewsCount,
}: ListVideoCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      tabIndex={0}
      style={style}
      onClick={() => {
        navigate(`/watch?videoId=${videoId}`);
      }}
      //className={`flex flex-col cursor-pointer p-1 w-full h-full border-2 md:rounded-xl gap-2   ${className}`}
      className={`  p-0 m-0 border-2  gap-2 ${className}`}
    >
      {!isLoading ? (
        isSuccess ? (
          <>
            {thumbnail.length > 0 ? (
              <span className="relative w-2/5   aspect-video shrink-0">
                <img
                  src={thumbnail}
                  alt={`${title}'s thumbnail`}
                  srcSet={generateSrcSet(thumbnail)}
                  className="absolute inset-0 aspect-video  rounded-xl shrink-0 m-1    "
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
                subscribersCount={owner.subscribersCount}
                username={owner.username}
                videoTitle={title}
                views={viewsCount}
                className={`${avatarClassName}`}
              />

              <VideoOptions videoId={videoId} />
            </div>
          </>
        ) : (
          <span className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">something went wrong</span>
        )
      ) : (
        <VideoCardSkeleton />
      )}
    </div>
  );
};





export const MemoVideoCard = memo(VideoCard);

export { VideoCard, ListVideoCard };
