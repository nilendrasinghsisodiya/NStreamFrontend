import { useSearchParams } from "react-router";
import { Video } from "@/components/video/Video";
import { CommentPanel } from "@/components/comment/CommentPanel";

const VideoPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("videoId") as string;
  return (
    <>
      <div className="flex flex-col p-5 gap-y-10 w-full items-center justify-center h-full ">
        <Video
          videoId={videoId}
          className="flex w-full   h-full  max-h-110 md:max-h-150 xl:max-h-165 outline-1  outline-amber-300 z-10   items-center xl:max-w-2/3 max-w-full p-2 "
        />
        <CommentPanel
          videoId={videoId}
          className="w-full outline-1 outline-green-500 p-5 min-h-400  "
        />
      </div>
    </>
  );
};

export { VideoPage };
