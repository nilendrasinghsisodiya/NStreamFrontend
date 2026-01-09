import { useGetUserWatchHistory } from "@/api/UserApi";
import { ErrorScreen } from "@/components/ErrorComponent";
import { VideoList } from "@/components/video/VideoList";
import { useEffect, useState } from "react";

export const WatchHistoryPage = () => {
  const { data, isLoading, isError, isSuccess } = useGetUserWatchHistory(true);
  const [videos, setVideos] = useState<IWatchHistory[]>([]);
  useEffect(() => {
    if (data) {
      setVideos(data);
    }
  }, [data]);
  return (
    <div className="h-full w-full m-auto p-4">
      {data ? (
        <VideoList
          data={videos}
          isError={isError}
          isLoading={isLoading}
          isSuccess={isSuccess}
          className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 gap-2 sm:gap-3 place-items-center-safe "
        />
      ) : (
        <ErrorScreen mainMessage="No History Found" />
      )}
    </div>
  );
};
