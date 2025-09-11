import React from "react";
import {
  GridComponents,
  VirtuosoGrid,
} from "react-virtuoso";

import { ListVideoCard} from "./VideoCard";
import { ErrorScreen } from "../ErrorComponent";
import { Skeleton } from "../ui/skeleton";

// flex flex-col w-full md:flex-row flex-wrap  justify-center contain-content gap-4
const List: GridComponents["List"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      style={{ scrollBehavior: "-moz-initial", ...style }}
      {...props}
      ref={ref}
      className="grid grid-cols-1 w-full h-full scroll-smooth gap-3 p-0 m-0"
    >
      {children}
    </div>
  )
);

const ScrollSeekPlaceholder = ({className}:{className:string;})=>{
  return <div className={ `p-0 m-0 border-2  gap-2 h-fit  ${className}`}>
    <Skeleton className="aspect-video w-2/5"/>
    <Skeleton className="w-3/5 flex-1 aspect-[3/1]"></Skeleton>
  </div>

}

type props = {
  videos: IVideo[];
  useWindowScroll?:boolean;
  isLoading: boolean;
  hasNextPage?: boolean;
  isSuccess: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchNextPage: any;
  itemClassName: string;
  header?:GridComponents['Header'];
};


export const VirtualVideoList = ({
  videos,
  useWindowScroll=true,
  fetchNextPage,
  isLoading,
  isSuccess,
  hasNextPage,
  itemClassName,
  header,
}: props) => {
  return (
    <>
      {videos.length > 0 ? (
        <VirtuosoGrid<IVideo>
          data={videos}
          useWindowScroll={useWindowScroll}
          components={{
            List: List,
            Header: header,
            ScrollSeekPlaceholder:()=><ScrollSeekPlaceholder className={itemClassName}/>,
            
          }}
          
          itemContent={(_, data) => (
            <ListVideoCard
              className={itemClassName}
              duration={data.duration}
              isLoading={isLoading}
              owner={data.owner}
              thumbnail={data.thumbnail}
              videoId={data._id}
              title={data.title}
              viewsCount={data.views}
              isSuccess={isSuccess}
              lazyLoading={true}
              avatarClassName=" flex flex-col  justify-center  w-3/5 "
            />
          )}
          endReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          scrollSeekConfiguration={{
            enter: (vel) => Math.abs(vel) > 150,
            exit: (vel) => Math.abs(vel) < 10,
          }}
          computeItemKey={(index, val) => val._id + index}
          increaseViewportBy={700}
          overscan={5}
          // isScrolling={(val) => console.log(val, "scrolling")}
        />
      ) : (
        <ErrorScreen
          mainMessage="no videos found"
        />
      )}
    </>
  );
};
