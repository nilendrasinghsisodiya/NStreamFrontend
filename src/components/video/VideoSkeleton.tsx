import { Skeleton } from "@/components/ui/skeleton";

const VideoSkeleton = () => {
  return (
    <div className="flex flex-col p-2 mt-1   gap-1 h-full aspect-video py-1 ">
		<Skeleton className="h-6/7 w-full"/>
		<Skeleton className="h-1/7 w-full"/>
    </div>
  );
};

export { VideoSkeleton };
