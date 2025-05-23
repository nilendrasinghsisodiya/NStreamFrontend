import { Skeleton } from "@/components/ui/skeleton";

const VideoSkeleton = () => {
  return(<div className="flex flex-col">
    <Skeleton/>
    <Skeleton/>
    <Skeleton/>
    </div>);
}

export { VideoSkeleton};