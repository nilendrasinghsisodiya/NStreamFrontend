import { VideoCardSkeleton } from "./VideoCardSkeleton";
import { generateSrcSet } from "@/utils";
import { VideoAvatarStrip } from "../avatar/Avatars";
import { memo } from "react";
import { useNavigate } from "react-router";
import { VideoOptions } from "./VideoOptions";

type Props = {
  thumbnail: string;
  title: string;
  likeCount?: number;
  viewsCount: number;
  style?: React.CSSProperties;
  isLoading: boolean;
  owner: Pick<IUser, "avatar" | "_id" | "username" | "subscriberCount">;
  videoId: string;
  isSuccess: boolean;
  lazyLoading: boolean;
  noHover?: boolean;
};

const VideoCard = ({
  thumbnail,
  title,
  style,
  isLoading,
  owner,
  videoId,
  lazyLoading,
  isSuccess,
  noHover,
}: Props) => {
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
          className={`flex flex-col cursor-pointer p-2 w-full max-h-full border-2 ${
            !noHover &&
            "hover:scale-105 selection:border-foreground hover:shadow-[1px_1px_10px_rgba(23,23,255,0.5)]"
          } md:rounded-xl gap-2 my-5  `}
        >
          {isSuccess ? (
            <>
              <img
                src={thumbnail}
                alt={`${title}'s thumbnail`}
                srcSet={generateSrcSet(thumbnail)}
                className="aspect-video lg:rounded-3xl m-0.5 max-w-full min-w-1/2 "
                loading={lazyLoading ? "lazy" : "eager"}
                width="100%"
                height="100%"
              />
              <div className="flex w-full items-center justify-center">
                <VideoAvatarStrip
                  avatar={owner.avatar}
                  subsCount={owner.subscriberCount}
                  username={owner.username}
                  videoTitle={title}
                  videoId={videoId}
                  className="flex flex-col w-full  z-40 px-5"
                />
                
                  <VideoOptions videoId={videoId} />
               
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

type videoCardPlaylistProps = {thumbnail: string;
  title: string;
  likeCount?: number;
  viewsCount: number;
  style?: React.CSSProperties;
  isLoading: boolean;
  owner: Pick<IUser, "avatar" | "_id" | "username" | "subscriberCount">;
  videoId: string;
  isSuccess: boolean;
  lazyLoading: boolean;
};

export const VideoCardPlaylist = ({ thumbnail,
  title,
  style,
  isLoading,
  owner,
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
          className={`flex  cursor-pointer p-2 w-full max-h-full border-2 md:rounded-xl gap-2 my-5  `}
        >
          {isSuccess ? (
            <>
              <img
                src={thumbnail}
                alt={`${title}'s thumbnail`}
                srcSet={generateSrcSet(thumbnail)}
                className="aspect-video lg:rounded-3xl m-0.5 max-w-1/4 min-w-[200px] "
                loading={lazyLoading ? "lazy" : "eager"}
                width="100%"
                height="100%"
              />
              <div className="flex w-full items-center justify-center">
                <VideoAvatarStrip
                  avatar={owner.avatar}
                  subsCount={owner.subscriberCount}
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
