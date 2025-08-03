import { useChannelVideos } from "@/api/ChannelApi";
import { VideoCard } from "@/components/video/VideoCard";
import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Virtuoso, Components } from "react-virtuoso";

const List: Components["List"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      style={{ ...style }}
      {...props}
      ref={ref}
      className="flex flex-col w-full h-full "
    >
      {children}
    </div>
  )
);

export const ChannelVideoPage = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username") as string;
  const { data, fetchNextPage, hasNextPage, isSuccess, isLoading } =
    useChannelVideos({
      limit: 10,
      sortBy: "createdAt",
      sortType: "asc",
      username,
    });
  const [videos, setVideos] = useState<IVideo[] >([]);
  useEffect(() => {
    if (data && data.pages) {
      const fetchVideos = data.pages.flatMap((page) => page.Videos);
      setVideos(fetchVideos);
    }
  }, [data, setVideos]);
  return (
    <>
      <Virtuoso<IVideo>
        useWindowScroll
        className="w-full h-full"
        data={videos}
        components={{
          List,
          Item: React.forwardRef(({ style, children, ...props },ref) => (
            <div
              style={style}
              ref={ref as React.LegacyRef<HTMLDivElement>}
              {...props}
              className="flex flex-col max-w-full "
            >
              {children}
            </div>
          )),
        }}
        itemContent={(_, data) => (
          <VideoCard
            isLoading={isLoading}
            isSuccess={isSuccess}
            lazyLoading={false}
            owner={data?.owner}
            thumbnail={data.thumbnail}
            title={data.title}
            videoId={data._id}
            viewsCount={data.views}
            key={data._id}
            likesCount={data.likesCount}
            
            noHover
            className="grid grid-cols-2 w-full"
          
            
          />
        )}
        endReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
      />
    </>
  );
};
