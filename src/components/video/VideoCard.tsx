// import { useEffect, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
import { useGetVideo } from "@/api/VideoApi";
import { VideoCardSkeleton } from "./VideoCardSkeleton";
import { generateSrcSet } from "@/utils";
import { VideoAvatarStrip } from "../avatar/Avatars";
import { memo } from "react";
import { useNavigate } from "react-router";

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
  noHover?:boolean;
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
          onClick={() =>{  navigate(`/watch?videoId=${videoId}`); } }
          className={`flex flex-col cursor-pointer p-2 w-full max-h-full border-2 ${!noHover && 'hover:scale-105 selection:border-foreground hover:shadow-[1px_1px_10px_rgba(23,23,255,0.5)]'} md:rounded-xl gap-2 my-5  `}
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
              <VideoAvatarStrip
                avatar={owner.avatar}
                subsCount={owner.subscriberCount}
                username={owner.username}
                videoTitle={title}
                className="flex flex-col w-full  z-50 px-5"
              />
            </>
          ) : (
            <span>something went wrong</span>
          )}
        </div>
      )}
    </>
  );
};

/* will be avialabe after i create videoApi.ts with fetchVideo hooks  */
type videoFetchProps = {
  videoId: string;
  style?: React.CSSProperties;
  className?: string;
};


const VideoCardFetch = ({ videoId, style, className }: videoFetchProps) => {
  const { data, isSuccess } = useGetVideo(videoId);
  const navigate = useNavigate();
  return (
    <div
      tabIndex={0}
      style={style}
      onClick={() => navigate(`/watch?videoId=${videoId}`)}
      className={`flex flex-col cursor-pointer p-2 w-full max-h-full border-2 hover:scale-105 selection:border-foreground hover:shadow-[1px_1px_10px_rgba(23,23,255,0.5)] md:rounded-xl gap-2 my-5 ${className} `}
    >
      {isSuccess && data ? (
        <div className="flex-1 aspect-auto ">
          <img
            srcSet={generateSrcSet(data.thumbnail)}
            src={data.thumbnail}
            alt={`videoId${data._id}thumbnail`}
            className="aspect-video  md:rounded-2xl w-full"
            loading="lazy"
          />
          <div className="flex flex-col">
            <span className="text-xl text-foreground">{data.title}</span>
            <div className="flex gap-20">
              <span className="text-foreground text-xs">
                {data.likesCount} likes
              </span>
              <span className="text-foreground text-xs">
                {data.views} views
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <VideoCardSkeleton />
        </div>
      )}
    </div>
  );
};
export const MemoVideoCard = memo(VideoCard);
export { VideoCardFetch };

export { VideoCard };
