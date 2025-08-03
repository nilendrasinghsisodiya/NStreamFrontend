import { Skeleton } from "@/components/ui/skeleton";
import { GridComponents } from "react-virtuoso";

const VideoCardSkeletonScrollSeek: GridComponents["ScrollSeekPlaceholder"] = () => {
  return (
<div className=" aspect-video w-[310px] h-[300px] p-3 rounded-xl bg-background shadow-sm flex flex-col gap-3">
  <Skeleton className="aspect-video w-full rounded-xl" />
  <Skeleton className="h-4 w-3/4 rounded" />
  <div className="flex items-center gap-2 mt-auto">
    <Skeleton className="w-8 h-8 rounded-full" />
    <Skeleton className="h-4 w-1/2 rounded" />
  </div>
</div>

  );
};


const VideoCardSkeleton = ()=>{
  return (
     <div className="w-[320px] h-[310px] p-3 rounded-xl bg-background shadow-sm flex flex-col gap-3">
  <Skeleton className="aspect-video w-full rounded-xl" />
  <Skeleton className="h-4 w-3/4 rounded" />
  <div className="flex items-center gap-2 mt-auto">
    <Skeleton className="w-8 h-8 rounded-full" />
    <Skeleton className="h-4 w-1/2 rounded" />
  </div>
</div>
  );
}

export { VideoCardSkeletonScrollSeek, VideoCardSkeleton };
