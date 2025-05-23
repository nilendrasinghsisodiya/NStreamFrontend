import { useChannelVideos } from "@/api/ChannelApi";
import { ChannelPanel } from "@/components/channel/channelPanel";
import { VideoList } from "@/components/video/VideoList";
import { useSearchParams } from "react-router";

const ChannelPage = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username") as string;
  const {data,isSuccess,isLoading} = useChannelVideos({limit:10,sortBy:"createdAt",sortType:"asc",username})
  return (
    <div className="flex flex-col justify-center items-center h-full w-full p-3">
      <ChannelPanel username={username} className="gap-6 outline-2 outline-red-500 max-h-200 " />
      <VideoList data={data?.videos? data.videos:[]} isLoading={isLoading} isSuccess={isSuccess}/>
    </div>
  );
};

export { ChannelPage };
