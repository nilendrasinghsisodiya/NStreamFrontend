import { useGetUserPlaylists } from "@/api/UserApi";
import { ErrorScreen } from "@/components/ErrorComponent";
import { PlaylistCard } from "../Main/PlaylistPage";
import { useSearchParams } from "react-router";

const ChannelPlaylistPage = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username") as string;
  const { playlists, isSuccess, isError, isLoading } = useGetUserPlaylists({
    username, isOpen:true
  });
  return (
    <>
      {!isError ? (
        isLoading ? (
          <div>loading screen props here</div>
        ) : playlists?.length && isSuccess ? (
          <div>
            {playlists.map((ele, index) => (
              <PlaylistCard
                cover={ele.cover}
                name={ele.name}
                playlistId={ele._id}
                view={ele.view}
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
