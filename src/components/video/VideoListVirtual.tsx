import React from "react";
import {
  Virtuoso,
  Components,
} from "react-virtuoso";

import { ListVideoCard} from "./VideoCard";
import { ErrorScreen } from "../ErrorComponent";

// flex flex-col w-full md:flex-row flex-wrap  justify-center contain-content gap-4
const List: Components["List"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      style={{ scrollBehavior: "-moz-initial", ...style }}
      {...props}
      ref={ref}
      className="flex flex-col w-full h-full scroll-smooth gap-3"
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
  fetchNextPage: any;
  itemClassName: string;
};

export const VirtualVideoList = ({
  videos,
  fetchNextPage,
  isLoading,
  isSuccess,
  hasNextPage,
  itemClassName,
}: props) => {
  return (
    <>
      {videos.length > 0 ? (
        <Virtuoso<IVideo>
          data={videos}
          useWindowScroll
          components={{
            List: List,
          }}
          
          defaultItemHeight={350}
          itemContent={(_, data) => (
            <ListVideoCard
              className={itemClassName}
              duration={data.duration}
              isLoading={isLoading}
              owner={data?.owner}
              thumbnail={data.thumbnail}
              videoId={data._id}
              title={data.title}
              viewsCount={data.views}
              isSuccess={isSuccess}
              lazyLoading={isLoading}
              avatarClassName=" flex flex-col w-full justify-center "
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
          isScrolling={(val) => console.log(val, "scrolling")}
        />
      ) : (
        <ErrorScreen
          mainMessage="no matching content found"
          secondaryMessage="please try something else"
        />
      )}
    </>
  );
};
