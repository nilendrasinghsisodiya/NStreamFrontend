import { VirtuosoGrid, GridComponents } from "react-virtuoso";
import { useGetPlaylist } from "@/api/PlaylistApi";
import { VideoCardPlaylist } from "@/components/video/VideoCard";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { AddVideosToPlaylist } from "@/components/comment/AddVideosToPlaylists";
import { selectUser } from "@/contexts/auth/authSlice";
import { useSelector } from "react-redux";

const List: GridComponents["List"] = React.forwardRef(
  ({ style, children, ...props }, ref) => (
    <div
      style={{ ...style }}
      {...props}
      ref={ref}
      className="grid grid-cols-1 grid-rows-1 xl:grid-cols-3 max-w-full justify-center items-center md:items-center  md:gap-10  "
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
      className=" w-full md:w-120 h-80 max-w-full  "
    >
      {children}
    </div>
  )
);

const PlaylistHeader = ({
  title,
  isOwner,
  playlistId,
  className,
}: {
  title: string;
  isOwner: boolean;
  playlistId: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      <span className="text-md font-semibold tracking-tight">{title}</span>
      {isOwner && <AddVideosToPlaylist playlistId={playlistId} className="max-w-120 max-h-120 overflow-y-scroll" />}
    </div>
  );
};
export const PlaylistPage = () => {
  const [videos, setVideos] = useState<IVideo[] | []>([]);
  const [playlistName, setPlaylistsName] = useState<string>("");
  const [playlistDescription, setPlaylistDescription] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const { _id: userId } = useSelector(selectUser);
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
        setPlaylistDescription(page.playlist.description);
        setIsOwner(page.playlist.owner === userId);
        return page.playlist?.videos || [];
      });
      console.log("new videos", newVideos);

      setVideos(newVideos);
    }
  }, [data, setVideos, userId]);

  return (
    <>
      {videos.length > 0 ? (
        <>
          <h2>{playlistName}</h2>
          <div>{playlistDescription}</div>
          <VirtuosoGrid
            components={{
              Item: GridItem,
              List: List,
              Header: () => {
                return (
                  <>
                    <PlaylistHeader
                      title={playlistName}
                      className=""
                      playlistId={playlistId}
                      isOwner={isOwner}
                    />
                  </>
                );
              },
            }}
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
              duration={data.duration}
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
