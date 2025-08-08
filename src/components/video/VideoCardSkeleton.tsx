import { Skeleton } from "@/components/ui/skeleton";
import { Components, GridComponents } from "react-virtuoso";

const VideoCardSkeletonScrollSeek: GridComponents["ScrollSeekPlaceholder"] = () => {
  return (
    <div className="aspect-video w-[320px] h-[310px] flex flex-col p-1 border-2 sm:rounded-md md:rounded-lg lg:rounded-xl gap-2">
      <div className="relative w-full aspect-video shrink-0">
        <Skeleton className="absolute inset-0 w-full h-full md:rounded-2xl" />
      </div>
      <Skeleton className="h-4 w-3/4 rounded" />
      <div className="flex items-center justify-between mt-auto w-full px-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
        <Skeleton className="h-4 w-4 rounded" />
      </div>
    </div>
  );
};


const VideoCardSkeletonScrollSeekSingle: Components["ScrollSeekPlaceholder"] = () => {
  return (
<div className=" aspect-video h-full w-full p-3 rounded-xl bg-background shadow-sm flex flex-col gap-3">
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

export { VideoCardSkeletonScrollSeek, VideoCardSkeleton ,VideoCardSkeletonScrollSeekSingle};
