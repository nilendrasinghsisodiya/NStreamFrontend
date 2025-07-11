import { useGetUserPlaylists } from "@/api/UserApi";
import { ErrorScreen } from "@/components/ErrorComponent";
import { VideoCardSkeleton } from "@/components/video/VideoCardSkeleton";
import { selectUser } from "@/contexts/auth/authSlice";
import { generateSrcSet} from "@/utils";
import { CircleOff } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

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
          className={`flex flex-col md:flex-row cursor-pointer p-2 w-full max-h-full border-2 ${
            !noHover &&
            "hover:scale-105 selection:border-foreground hover:shadow-[1px_1px_10px_rgba(23,23,255,0.5)]"
          } md:rounded-xl gap-2 my-5  `}
        >
          {isSuccess  ? (
            <>
              {cover?<img
                src={cover}
                alt={`${name}'s thumbnail`}
                srcSet={generateSrcSet(cover)}
                className="aspect-video lg:rounded-3xl m-0.5 max-w-[400px] min-w-[150px] "
                loading={lazyLoading ? "lazy" : "eager"}
                width="100%"
                height="100%"
              /> : <div className="flex justify-center items-center w-full h-full bg-accent rounded-2xl aspect-video max-w-[300px] min-w-[150px]"> <CircleOff className="h-1/2 w-1/2"/></div>}
              <div className="flex flex-col gap-2">
                <span>{name}</span>
              </div>
            </>
          ) : (
            <span>something went wrong</span>
          )}
        </div>
      )}
    </span>
  );
};
const PlaylistPage = () => {
  const { username } = useSelector(selectUser);
  const { playlists, isLoading, isSuccess, isError } = useGetUserPlaylists({
    username,
    isOpen: true,
  });
  return (
    <>
      <div className="h-full w-full">
        { Array.isArray(playlists?.playlists)
          ? playlists.playlists.map((ele, index) => {
            console.log("playlists: ",playlists);
             return( <PlaylistCard
                noHover
                lazyLoading
                cover={ele.cover}
                key={index}
                name={ele.name}
                isLoading={isLoading}
                isSuccess={isSuccess}
                playlistId={ele._id}
              /> )}
            )
          : (!isSuccess && <div><span>no playlists found</span></div>) ||
            (isError && <ErrorScreen mainMessage="something went wrong" />)}
      </div>
    </>
  );
};
export { PlaylistPage };
