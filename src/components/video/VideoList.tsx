import { ErrorScreen } from "../ErrorComponent";
import { MemoVideoCard } from "./VideoCard";
import { memo } from "react";

type Props = {
  className?: string;
  isSuccess?: boolean;
  isLoading?: boolean;
  data?: IVideo[] | IWatchHistory[];
  isError?: boolean;
};

const VideoList = ({
  isSuccess,
  data,
  isLoading,
  className,
  isError,
}: Props) => {
  return (
    <div className={className}>
      {data && isSuccess ? (
        data.map((ele, index) => (
          <div
            className="h-65 w-70 md:w-75 md:h-65 xl:w-75 xl:h-65  aspect-square col-span-1"
            key={index}
          >
            <MemoVideoCard
              isLoading={isLoading ? isLoading : false}
              title={ele.title}
              viewsCount={ele.views}
              thumbnail={ele.thumbnail}
              key={ele._id}
              duration={ele.duration}
              videoId={ele._id}
              owner={ele.owner}
              isSuccess={isSuccess}
              lazyLoading={false}
            />
          </div>
        ))
      ) : (
        //fixed so it goes out of flow and not obstruct other ele
        <>
          {isError && (
            <ErrorScreen
              mainMessage="something went wrong"
              secondaryMessage="please refresh the page or check your internet connection"
            />
          )}
        </>
      )}
    </div>
  );
};

const MemoVideoList = memo(VideoList);

export { VideoList, MemoVideoList };
