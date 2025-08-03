import { useSearchParams } from "react-router";
import { Video } from "@/components/video/Video";
import { CommentPanel } from "@/components/comment/CommentPanel";
import { VirtualVideoList } from "@/components/video/VideoListVirtual";
import { useRelatedVideos } from "@/api/VideoApi";
import { useEffect, useState } from "react";

const VideoPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("videoId") as string;

  const [videos, setVideos] = useState<IVideo[]>([]);
  const { data, fetchNextPage, hasNextPage, isLoading, isSuccess } =
    useRelatedVideos({ videoId, limit: 10 });
  useEffect(() => {
    if (data && data.pages) {
      console.log("data.pages", data.pages);

      // Ensure `popularVideos` exists and is an array
      const newVideos = data.pages.flatMap((page) => page.popularVideos || []);
      console.log("new videos", newVideos);

      setVideos((prev) => [...prev, ...newVideos]);
    }
  }, [data]);
  const [isActive,setIsActive]= useState<boolean>(false);

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gird-rows-3 md:grid-rows-2   gap-0 items-center 
      w-full h-full   justify-center"
      >
     
          
          <Video
            videoId={videoId}
            className=" max-w-full min-w-[300px]  col-span-1 row-span-1 
            "
          />
          <CommentPanel
          onFocus={()=>setIsActive(true)}
          onBlur={()=>setIsActive(false)}
          aria-focused={true}
            videoId={videoId}
            
            className={` col-span-1 row-span-2 border-3   md:h-full w-full min-w-70 rounded-2xl border-accent   m-auto py-2 px-4
            aria-focused:bg-black
            overflow-hidden ${isActive&& "h-full"}
          `}
          /> 
         { !isActive &&<div className="h-full  row-span-1 md:col-start-2 md:row-start-1 md:col-end-3 md:row-end-2">
            <span>related videos</span>
            <VirtualVideoList
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              videos={videos}
              isLoading={isLoading}
              isSuccess={isSuccess}
            />
          </div>}
        </div>
    </>
  );
};

export { VideoPage };
