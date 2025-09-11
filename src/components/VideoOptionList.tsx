import React from "react";
import { GridComponents, VirtuosoGrid } from "react-virtuoso";
import { ErrorScreen } from "./ErrorComponent";

// flex flex-col w-full md:flex-row flex-wrap  justify-center contain-content gap-4
const List: GridComponents["List"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
    style={{ scrollBehavior: "-moz-initial", ...style }}
    {...props}
    ref={ref}
    className="grid grid-cols-1 w-full h-full scroll-smooth gap-4 p-0 m-0"
    >
      {children}
    </div>
  )
);

type props<T extends object> = {
  videos: IVideo[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isSuccess: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchNextPage: any;
  itemClassName: string;
  header?: GridComponents["Header"];
  Child: React.ComponentType<T>;
};
const ListItem: GridComponents["Item"] = React.forwardRef(({style,children,...props},ref)=>(
  <div ref={ref} style={{...style}} {...props} className="w-full h-[250px] p-2" >{children}</div>
));
export function VideoOptionList<T extends object>({
  videos,
  fetchNextPage,
  hasNextPage,
  itemClassName,
  header,
  Child,
}: props<T>) {
  return (
    <>
      {videos.length > 0 ? (
        <VirtuosoGrid<IVideo & {uniqueId?:string} >
          data={videos}
          useWindowScroll
          components={{
            List: List,
            Header: header,
            Item:ListItem,
          }}
          itemContent={(_, data) => (
            <Child {...(data as T)} className={itemClassName} key={data.uniqueId ? data.uniqueId : data._id}/>
          )}
          endReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          computeItemKey={(index, val) => val._id + index }
          increaseViewportBy={700}
          overscan={10}
          />
        ) : (
        <ErrorScreen mainMessage="no videos found" />
      )}
    </>
  );
}