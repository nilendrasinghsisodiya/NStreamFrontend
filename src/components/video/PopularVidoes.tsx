import { usePopularVideo } from "@/api/VideoApi";

import React, { useEffect, useState } from "react";
import { VirtuosoGrid, GridComponents } from "react-virtuoso";

import { VideoCard } from "./VideoCard";
import { VideoCardSkeletonScrollSeek } from "./VideoCardSkeleton";
import { useUserRecommendation } from "@/api/UserApi";

// flex flex-col w-full md:flex-row flex-wrap  justify-center contain-content gap-4
const GridList: GridComponents["List"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      style={{ ...style }}
      {...props}
      ref={ref}
      className="grid grid-cols-1 grid-rows-1 min-h-full md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  place-items-center  -100 gap-3 w-full p-3 md:w-[95%]  scroll-smooth">
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
      //className="  md:h-80 md:w-85 h-[320px] w-[300px] min-w-[300px] min-h-[320px] max-w-[400px] xl:max-w-[600px] max-h-[340px] "
    
     className=" aspect-video w-[310px] h-[300px]  ">
      {children}
    </div>
  )
);


const PopularVideos = () => {
  const { data, hasNextPage, fetchNextPage, isSuccess,isLoading} =
    usePopularVideo({
      limit: 10,
    });
    const {data:RecommendedVideos} = useUserRecommendation();
  const [videos, setVideos] = useState<IVideo[] >([]);

  useEffect(()=>{
    if(Array.isArray(RecommendedVideos) && RecommendedVideos.length > 0){
      setVideos((prev)=>[...RecommendedVideos,...prev]);
    }
  },[RecommendedVideos]);

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
          // Footer:()=>{
          //   return <>{isFetchingNextPage && <div>loading....</div>}</>
          // }
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
         height={"100%"}
         style={{"minHeight":"100%"}}
        scrollSeekConfiguration={{
        enter: (velocity) => Math.abs(velocity) > 150,
          exit: (velocity) => Math.abs(velocity) < 10,
        
        }}
        overscan={50}
        isScrolling={(val) => console.log(val, "scrolling")}
        
      />
    </>
  );
};

export { PopularVideos };
