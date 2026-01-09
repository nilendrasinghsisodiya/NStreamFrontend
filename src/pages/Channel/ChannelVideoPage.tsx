import { useChannelVideos } from "@/api/ChannelApi";
import { VirtualVideoList } from "@/components/video/VideoListVirtual";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
export const ChannelVideoPage = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username") as string;
  const { data, fetchNextPage, hasNextPage, isSuccess, isLoading } =
    useChannelVideos({
      limit: 10,
      sortBy: "createdAt",
      sortType: "asc",
      username,
    });
  const fetchedVids = useMemo<IVideo[]>(() => {
    console.log("memo fuction ran");
    if (data && data.pages) {
      return data.pages.flatMap((page) => page.Videos);
    } else {
      return [];
    }
  }, [data]);

  return (
    <div className="w-full h-full m-auto">
      <VirtualVideoList
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isSuccess={isSuccess}
        itemClassName="flex flex-row items-center  h-fit p-2 justify-evenly boder-x-0"
        videos={fetchedVids}
      />
    </div>
  );
};
