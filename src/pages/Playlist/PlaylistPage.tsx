import { VirtuosoGrid, GridComponents } from "react-virtuoso";
import { useGetPlaylist } from "@/api/PlaylistApi";
import {  VideoCardPlaylist } from "@/components/video/VideoCard";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const List: GridComponents["List"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      style={{ ...style }}
      {...props}
      ref={ref}
      className="flex flex-col  md:flex-row flex-wrap  max-w-full justify-center md:items-center contain-content md:gap-10  "
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
      className=" min-w-full max-w-[420px] xl:max-w-[600px] aspect-square min-h-[350px]"
    >
      {children}
    </div>
  )
);

export const PlaylistPage = () => {
  const [videos, setVideos] = useState<IVideo[] | []>([]);
  const [playlistName, setPlaylistsName] = useState<string>("");
  const [playlistDescription,setPlaylistDescription] = useState<string>("");
  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get("playlistId") as string;

  const { data, hasNextPage, fetchNextPage, isLoading, isSuccess } =
    useGetPlaylist({
      playlistId,
      limit: 5,
    });
  useEffect(() => {
    if (data && data.pages) {
      console.log("data.pages", data.pages);

      const newVideos = data.pages.flatMap((page) => {
        setPlaylistsName(page.playlist.name);
        setPlaylistDescription(page.playlist.description)
        return page.playlist?.videos || [];
      });
      console.log("new videos", newVideos);

      setVideos(newVideos);
    }
  }, [data, setVideos]);

  return (
    <>
      {videos.length > 0 ? (
        <>
          <h2>{playlistName}</h2>
          <div>{playlistDescription}</div>
          <VirtuosoGrid
            components={{ Item: GridItem, List: List }}
            style={{ height: "100%" }}
            data={videos}
            useWindowScroll
            endReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            isScrolling={(val) => console.log(val, "scrolling")}
            itemContent={(_, data) => (
              <VideoCardPlaylist
                isLoading={isLoading}
                owner={data.owner}
                thumbnail={data.thumbnail}
                videoId={data._id}
                title={data.title}
                viewsCount={data.views}
                key={data._id}
                isSuccess={isSuccess}
                lazyLoading={false}
              />
            )}
          />
        </>
      ) : (
        <div>playlist is empty</div>
      )}
    </>
  );
};
