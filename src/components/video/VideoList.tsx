
import { MemoVideoCard } from "./VideoCard";
import {  memo } from "react";

type Props = {
  className?:string;
  isSuccess?: boolean;
  isLoading?: boolean;
  data?: IVideo[];
  
};

const VideoList = ({  isSuccess, data, isLoading ,className}: Props) => {
  return (
    <div className={className}>
      { data && !isLoading && isSuccess ? (
        data.map((ele,index) => (
          <div className=" max-w-[420px] xl:max-w-[600px] w-full min-h-[350px] min-w-[450px]" key={index}>
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
