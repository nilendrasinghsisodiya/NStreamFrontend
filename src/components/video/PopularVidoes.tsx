import { usePopularVideo } from "@/api/VideoApi";

import React, { useEffect, useState } from "react";
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
      className=" grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 lg-grid-cols-4  place-items-center gap-y-1 sm:gap-y-2 md:gap-y-3 gap-x-1 p-0 mt-2 xl:gap-3"
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
      className=" aspect-video w-[310px] h-[300px] "
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
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [recommendedAdded, setRecommendedAdded] = useState(false);

 

  useEffect(() => {
    if (data && data.pages) {
      const popular = data.pages.flatMap((page) => page.Videos || []);
      let merged = popular;
      if (
        Array.isArray(RecommendedVideos) &&
        RecommendedVideos.length > 0 &&
        !recommendedAdded
      ) {
        merged = [...RecommendedVideos, ...popular];
        setRecommendedAdded(true);
      }
      setVideos(merged);
    }
  }, [data, RecommendedVideos, recommendedAdded]);

  return (
    <>
      <VirtuosoGrid
        data={videos}
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
