import { useGetUserPlaylists } from "@/api/UserApi";
import { ErrorScreen } from "@/components/ErrorComponent";
import { CreatePlaylist } from "@/components/Popovers";
import { VideoCardSkeleton } from "@/components/video/VideoCardSkeleton";
import { selectUser } from "@/contexts/auth/authSlice";
import { generateSrcSet } from "@/utils";
import { CircleOff } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type Props = {
  className?: string;
  isSuccess?: boolean;
  isLoading?: boolean;
  cover: string;
  name: string;
  style?: React.CSSProperties;
  noHover?: boolean;
  lazyLoading?: boolean;
  playlistId: string;
  onClick?: (e: React.MouseEvent) => void;
};
export const PlaylistCard = ({
  cover,
  playlistId,
  name,
  style,
  isLoading,
  lazyLoading,
  isSuccess,
  noHover,
  onClick,
}: Props) => {
  const navigate = useNavigate();

  return (
    <span>
      {isLoading ? (
        <VideoCardSkeleton />
      ) : (
        <div
          tabIndex={0}
          style={style}
          onClick={
            onClick
              ? onClick
              : () => {
                  navigate(`/playlist?playlistId=${playlistId}`);
                }
          }
          className={`flex flex-col md:flex-row cursor-pointer p-2 w-full overflow-y-scroll border-2 border-x-0 ${
            !noHover &&
            "hover:scale-105 selection:border-foreground hover:shadow-[1px_1px_10px_rgba(23,23,255,0.5)]"
          } md:rounded-xl gap-2 lg:my-5 lg:p-5 justify-center items-center`}
        >
          {isSuccess ? (
            <>
              {cover ? (
                <img
                  src={cover}
                  alt={`${name}'s thumbnail`}
                  srcSet={generateSrcSet(cover)}
                  className="aspect-video rounded-sm md:rounded-lg lg:rounded-xl m-0.5 max-w-[500px] min-w-[150px] "
                  loading={lazyLoading ? "lazy" : "eager"}
                  width="100%"
                  height="100%"
                />
              ) : (
                <div className="flex justify-center items-center max-w-[500px] min-w-[150px] w-full h-full bg-accent rounded-sm md:rounded-lg lg:rounded-xl aspect-video ">
                  {" "}
                  <CircleOff className="h-1/2 w-1/2" />
                </div>
              )}
              <div className="flex flex-col md:items-start lg:justify-center w-full gap-2 m-2 lg:m-4">
                <span className="text-md md:text-2xl text-center ">{name}</span>
              </div>
            </>
          ) : (
            <span className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
              something went wrong
            </span>
          )}
        </div>
      )}
    </span>
  );
};
const PlaylistPage = () => {
  const { username} = useSelector(selectUser);
  const { playlists, isLoading, isSuccess, isError } = useGetUserPlaylists({
    username,
    isOpen: true,
  });
  return (
    <>
      <div className="h-full w-full flex flex-col gap-3 justify-center items-center">
        <span className="flex gap-2 w-fit h-fit items-center justify-center">
          <span className="text-md tracking-tight">Create playlist</span>
          <CreatePlaylist />
        </span>
        <div>
          {Array.isArray(playlists?.playlists) && playlists.playlists.length > 0
            ? playlists.playlists.map((ele, index) => {
                console.log("playlists: ", playlists);
                return (
                  <PlaylistCard
                    noHover
                    lazyLoading
                    cover={ele.cover}
                    key={index}
                    className="w-full"
                    name={ele.name}
                    isLoading={isLoading}
                    isSuccess={isSuccess}
                    playlistId={ele._id}
                  />
                );
              })
            : (isSuccess && (
                <>
                  {/* <div className="w-full h-fit p-3">
                  <span>create playlists</span> <CreatePlaylist />
                </div> */}
                  <ErrorScreen
                    mainMessage="no playlist found "
                    secondaryMessage="please create one"
                  />
                </>
              )) ||
              (isError && <ErrorScreen mainMessage="something went wrong" />)}
        </div>
      </div>
    </>
  );
};
export { PlaylistPage };
