import { useGetUserPlaylists } from "@/api/UserApi";
import { VideoCardSkeleton } from "@/components/video/VideoCardSkeleton";
import { selectUser } from "@/contexts/auth/authSlice";
import { generateSrcSet, toKBMS } from "@/utils";
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
  view: number;
  onClick?:(e:React.MouseEvent)=> void;
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
  view,
  onClick
 
}: Props) => {
  const navigate = useNavigate();

  return (
    <>
      {isLoading ? (
        <VideoCardSkeleton />
      ) : (
        <div
          tabIndex={0}
          style={style}
          onClick={onClick? onClick :() => {
            navigate(`/playlist?playlistId=${playlistId}`);
          }}
          className={`flex flex-col cursor-pointer p-2 w-full max-h-full border-2 ${
            !noHover &&
            "hover:scale-105 selection:border-foreground hover:shadow-[1px_1px_10px_rgba(23,23,255,0.5)]"
          } md:rounded-xl gap-2 my-5  `}
        >
          {isSuccess ? (
            <>
              <img
                src={cover}
                alt={`${name}'s thumbnail`}
                srcSet={generateSrcSet(cover)}
                className="aspect-video lg:rounded-3xl m-0.5 max-w-full min-w-1/2 "
                loading={lazyLoading ? "lazy" : "eager"}
                width="100%"
                height="100%"
              />
              <div className="flex flex-col gap-2">
                <span>{name}</span>
                <span>{toKBMS(view)}</span>
              </div>
            </>
          ) : (
            <span>something went wrong</span>
          )}
        </div>
      )}
    </>
  );
};
const PlaylistPage = () => {
  const { username } = useSelector(selectUser);
  const { playlists, isLoading, isSuccess} = useGetUserPlaylists({ username ,isOpen:true});
  return (
    <>
      <div className="h-full">
        {playlists && playlists?.length > 0 ? (
          playlists?.map((ele, index) => (
            <PlaylistCard
              view={ele.view}
              noHover
              lazyLoading
              cover={ele.cover}
              key={index}
              name={ele.name}
              isLoading={isLoading}
              isSuccess={isSuccess}
              playlistId={ele._id}
            />
          ))
        ) : (
          <div className="flex flex-col h-full w-full justify-center items-center gap-3"><span className="text-5xl">No Playlists found</span><span className="text-3xl">please create one</span></div>
        )}
      </div>
    </>
  );
};
export { PlaylistPage };
