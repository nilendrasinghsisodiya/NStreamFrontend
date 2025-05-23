
import { MemoVideoCard } from "./VideoCard";
import {  memo } from "react";

type Props = {
  
  isSuccess?: boolean;
  isLoading?: boolean;
  data?: IVideo[];
  
};

const VideoList = ({  isSuccess, data, isLoading }: Props) => {
  return (
    <div className="flex flex-col md:flex-row w-full gap-7 flex-wrap justify-center md:gap-6">
      { data && !isLoading && isSuccess ? (
        data.map((ele,index) => (
          <div className=" max-w-[420px] xl:max-w-[600px] w-full min-h-[350px]" key={index}>
          <MemoVideoCard
            isLoading={isLoading?isLoading:false}
            title={ele.title}
            viewsCount={ele.views}
            thumbnail={ele.thumbnail}
            key={ele._id}
            videoId={ele._id}
            owner={ele.owner}
           isSuccess={isSuccess}
           lazyLoading={true}
          />
          </div>
        ))
      ) : (
        <div className="hidden fixed" /> //fixed so it goes out of flow and not obstruct other ele
      )}
    </div>
  );
};


const MemoVideoList = memo(VideoList);

export { VideoList, MemoVideoList };
