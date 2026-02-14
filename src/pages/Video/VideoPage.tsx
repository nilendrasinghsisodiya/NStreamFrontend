import { useSearchParams } from "react-router-dom";
import { Video } from "@/components/video/Video";
import { CommentPanel } from "@/components/comment/CommentPanel";
import { VirtualVideoList } from "@/components/video/VideoListVirtual";
import { useRelatedVideos } from "@/api/VideoApi";
import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const VideoPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("videoId") as string;
  const isMobile = useIsMobile();
  const { data, fetchNextPage, hasNextPage, isLoading, isSuccess } =
    useRelatedVideos({
      videoId,
      limit: isMobile ? 3 : 10,
      pageLimit: isMobile ? 4 : 100,
    });
  const fetchedVids = useMemo<IVideo[]>(() => {
    if (data && data.pages) {
      return data.pages.flatMap((page) => page.Videos);
    } else {
      return [];
    }
  }, [data]);

  return (
    <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 grid-rows-5 sm:grid-rows-12 gap-4">
      {/* Main Video */}
      <Video
        videoId={videoId}
        className="h-fit w-fit min-w-75 col-span-1 row-span-1 col-start-1 col-end-2 row-start-1 row-end-2 -mx-2"
      />

      {/* Related Videos Virtual List */}
      <div
        className="
     col-span-1 row-span-2 sm:row-span-12 sm:col-start-2 row-start-2 sm:row-start-1 sm:row-end-13 p-2
sm:max-w-75     "
      >
        <span className="capitalize text-xs tracking-tighter">
          related videos
        </span>
        <VirtualVideoList
          itemClassName="flex "
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          videos={fetchedVids}
          isLoading={isLoading}
          isSuccess={isSuccess}
          useWindowScroll={false}
          className="h-full"
          avatarClassName=" h-full w-full p-0.5"
        />
      </div>

      {/* Comments */}
      <CommentPanel
        videoId={videoId}
        className="
     col-span-1 row-start-4 sm:row-start-2 row-span-2 sm:row-span-11 contain-content 
    "
      />
    </div>
  );
};

export { VideoPage };
