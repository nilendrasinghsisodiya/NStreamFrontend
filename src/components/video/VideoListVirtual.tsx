import React from "react";
import { VirtuosoGrid, GridComponents } from "react-virtuoso";


import { VideoCard } from "./VideoCard";
import { VideoCardSkeletonScrollSeek } from "./VideoCardSkeleton";

// flex flex-col w-full md:flex-row flex-wrap  justify-center contain-content gap-4
const GridList: GridComponents["List"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      style={{ scrollBehavior: "-moz-initial", ...style }}
      {...props}
      ref={ref}
      className="grid grid-cols-1 grid-rows-1   place-items-center gap-3 p-0  h-full max-w-120 scroll-smooth "
    >
      {children}
    </div>
  )
);
const GridItem: GridComponents["Item"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{ height: "320px", width: "350px", ...style }}
    >
      {children}
    </div>
  )
);
type props = {
  videos: IVideo[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isSuccess: boolean;
  fetchNextPage: any;}

export const VirtualVideoList = ({
  videos,
  fetchNextPage,
  isLoading,
  isSuccess,
  hasNextPage,
}: props) => {
  return (
    <>
      <VirtuosoGrid
        data={videos}
        useWindowScroll
        className="w-120 h-159"
        components={{
          List: GridList,
          Item: GridItem,
          ScrollSeekPlaceholder: VideoCardSkeletonScrollSeek,
        }}
        itemContent={(_, data) => (
          <VideoCard
          duration={data.duration}
            isLoading={isLoading}
            owner={data?.owner}
            thumbnail={data.thumbnail}
            videoId={data._id}
            title={data.title}
            viewsCount={data.views}
            key={data._id}
            isSuccess={isSuccess}
            lazyLoading={isLoading}
          />
        )}
        endReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        scrollSeekConfiguration={{
          enter: (vel) => Math.abs(vel) > 150,
          exit: (vel) => Math.abs(vel) < 90,
        }}
        computeItemKey={(_, val) => val._id}
        increaseViewportBy={600}
        overscan={15}
        isScrolling={(val) => console.log(val, "scrolling")}
      />
    </>
  );
};
