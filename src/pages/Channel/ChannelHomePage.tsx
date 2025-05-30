import { useChannelVideos } from "@/api/ChannelApi";
import { Button } from "@/components/ui/button";
import { VideoList } from "@/components/video/VideoList";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams ,Link} from "react-router";

export const ChannelHomePage = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username") as string;
  const [videos, setVideos] = useState<IVideo[] | []>([]);
  const { data, isLoading, isSuccess } = useChannelVideos({
    limit: 3,
    sortBy: "created_at",
    sortType: "asc",
    username,
  });
  useEffect(() => {
    if (data && data.pages) {
      const fetchVideos = data.pages.flatMap((page) => page.videos);
      setVideos(fetchVideos);
    }
  }, [data, setVideos]);

  return (
    <div className="flex flex-col h-full overflow-scroll w-full gap-y-2 ">
      <h2 className="text-foreground text-3xl font-bold">Videos</h2>
      <div className=" flex flex-col min-w-full overflow-x-scroll min-h-[400px] justify-center items-center">
      <VideoList data={videos} isLoading={isLoading} isSuccess={isSuccess} className="flex flex-col md:flex-row overflow-x-scroll w-full max-h-full gap-3 items-center" />
      <Button variant={"ghost"} className="max-w-3 max-h-3">
        <Link to={`/channel/videos?username=${username}`}><ChevronDown/></Link>
      </Button>
    </div>
    </div>
  );
};
