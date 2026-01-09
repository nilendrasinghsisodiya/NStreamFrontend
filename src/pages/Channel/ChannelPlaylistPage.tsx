import { useGetUserPlaylists } from "@/api/UserApi";
import { ErrorScreen } from "@/components/ErrorComponent";
import { PlaylistCard } from "../Main/PlaylistPage";
import { useSearchParams } from "react-router-dom";

const ChannelPlaylistPage = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username") as string;
  const { playlists, isSuccess, isError, isLoading } = useGetUserPlaylists({
    username,
    isOpen: true,
  });
  return (
    <>
      {!isError ? (
        isLoading ? (
          <div>loading screen props here</div>
        ) : playlists?.playlists.length && isSuccess ? (
          <div className="w-full h-full m-auto">
            {playlists.playlists.map((ele, index) => (
              <PlaylistCard
                cover={ele.cover}
                name={ele.name}
                playlistId={ele._id}
                isLoading={isLoading}
                isSuccess={isSuccess}
                key={index + ele._id}
              />
            ))}
          </div>
        ) : (
          <div>no playlist found on the channel</div>
        )
      ) : (
        <ErrorScreen
          mainMessage="something went wrong "
          secondaryMessage="please try again"
        />
      )}
    </>
  );
};
export { ChannelPlaylistPage };
