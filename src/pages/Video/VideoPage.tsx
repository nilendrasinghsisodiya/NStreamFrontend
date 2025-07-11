import { useSearchParams } from "react-router";
import { Video } from "@/components/video/Video";
import { CommentPanel } from "@/components/comment/CommentPanel";

const VideoPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("videoId") as string;
  return (
    <>
      <div className="flex flex-col  p-4 gap-2 items-center 
      min-w-screen overflow-y-scroll min-h-screen ">
        <Video
          videoId={videoId}
          className=" max-w-full min-w-[350px]  " />
        <CommentPanel
          videoId={videoId}
          className="  border-3 h-250 rounded-2xl border-accent  min-w-full p-6
          "
        />
      </div>
    </>
  );
};

export { VideoPage };
