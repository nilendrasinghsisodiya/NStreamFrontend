import { usePopularVideo } from "@/api/VideoApi";

import React, { useEffect, useState } from "react";
import { VirtuosoGrid, GridComponents } from "react-virtuoso";

import { VideoCard } from "./VideoCard";
import { VideoCardSkeleton } from "./VideoCardSkeleton";

// flex flex-col w-full md:flex-row flex-wrap  justify-center contain-content gap-4
const GridList: GridComponents["List"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      style={{ ...style }}
      {...props}
      ref={ref}
      className="grid grid-cols-1 grid-rows-1  md:grid-cols-2 justify-items-center gap-2 ">
      {children}
    </div>
  )
);
const GridItem: GridComponents["Item"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{ ...style }}
      className=" w-full max-w-[420px] xl:max-w-[600px] aspect-square min-h-[350px]"
    >
      {children}
    </div>
  )
);


const PopularVideos = () => {
  const { isLoading, data, hasNextPage, fetchNextPage, isSuccess } =
    usePopularVideo({
      limit: 5,
    });
  const [videos, setVideos] = useState<IVideo[] | []>([]);

  useEffect(() => {
    if (data && data.pages) {
      console.log("data.pages", data.pages);

      // Ensure `popularVideos` exists and is an array
      const newVideos = data.pages.flatMap((page) => page.popularVideos || []);
      console.log("new videos", newVideos);

      setVideos(newVideos);
    }
  }, [data]);

  return (
    <>
      <VirtuosoGrid
        data={videos}
        useWindowScroll
        components={{
          List: GridList,
          Item: GridItem,
          ScrollSeekPlaceholder: VideoCardSkeleton,
        }}
        itemContent={(_, data) => (
          <VideoCard
            isLoading={isLoading}
            owner={data?.owner}
            thumbnail={data.thumbnail}
            videoId={data._id}
            title={data.title}
            viewsCount={data.views}
            key={data._id}
            isSuccess={isSuccess}
            lazyLoading={false}
          />
        )}
        endReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        computeItemKey={(_, val) => val._id}
        increaseViewportBy={200}
        scrollSeekConfiguration={{
          enter: (velocity) => Math.abs(velocity) > 900,
          exit: (velocity) => Math.abs(velocity) < 100,
        
        }}
        overscan={15}
        isScrolling={(val) => console.log(val, "scrolling")}
        
      />
    </>
  );
};

export { PopularVideos };
