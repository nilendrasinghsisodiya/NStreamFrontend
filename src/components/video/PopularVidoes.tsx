import { usePopularVideo } from "@/api/VideoApi";

import React, {  useMemo, useState } from "react";
import { VirtuosoGrid, GridComponents } from "react-virtuoso";

import { VideoCard } from "./VideoCard";
import { VideoCardSkeletonScrollSeek } from "./VideoCardSkeleton";
import { useUserRecommendation } from "@/api/UserApi";

const GridList: GridComponents["List"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      style={{ ...style }}
      {...props}
      ref={ref}
      className=" grid gird-cols-1 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4  place-items-center gap-y-1 sm:gap-y-2 md:gap-y-3 gap-x-1 p-0 mt-2 xl:gap-y-3 "
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
      style={{ ...style }}
      className=" aspect-video w-[320px] h-[310px] sm:w-[380px] sm:h-[360px]  "
    >
      {children}
    </div>
  )
);

const PopularVideos = () => {
  const { data, hasNextPage, fetchNextPage, isSuccess, isLoading } =
    usePopularVideo({
      limit: 10,
    });
  const { data: RecommendedVideos } = useUserRecommendation();
  const [recommendedAdded, setRecommendedAdded] = useState(false);

  const merged = useMemo<IVideo[]>(() => {
    if (data && data.pages) {
      const popular = data.pages.flatMap((page) => page.Videos);
      let vids = popular;
      if (
        Array.isArray(RecommendedVideos) &&
        RecommendedVideos.length > 0 &&
        !recommendedAdded
      ) {
        setRecommendedAdded(true);
        vids = [...RecommendedVideos, ...popular];
      }
      return vids;
    } else {
      return [];
    }
  }, [data, recommendedAdded, RecommendedVideos]);

  

  return (
    <>
      <VirtuosoGrid
        data={merged}
        useWindowScroll
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
            isSuccess={isSuccess}
            lazyLoading={true}
            
          />
        )}
        endReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        computeItemKey={(index, val) => `${val._id}_${index}`}
        increaseViewportBy={900}
        scrollSeekConfiguration={{
          enter: (velocity) => Math.abs(velocity) > 350,
          exit: (velocity) => Math.abs(velocity) < 10,
        }}
        overscan={25}
      />
    </>
  );
};

export { PopularVideos };
