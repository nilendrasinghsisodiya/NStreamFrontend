import { ErrorScreen } from "../ErrorComponent";
import { MemoVideoCard } from "./VideoCard";
import { memo } from "react";

type Props = {
  className?: string;
  isSuccess?: boolean;
  isLoading?: boolean;
  data?: IVideo[];
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
            className="w-95 h-80 max-w-[420px] xl:max-w-[600px] aspect-square col-span-1"
            key={index}
          >
            <MemoVideoCard
              isLoading={isLoading ? isLoading : false}
              title={ele.title}
              viewsCount={ele.views}
              thumbnail={ele.thumbnail}
              key={ele._id}
              videoId={ele._id}
              owner={ele.owner}
              isSuccess={isSuccess}
              lazyLoading={false}
              noHover
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
