import { Skeleton } from "@/components/ui/skeleton";

const VideoCardSkeleton = () => {
  return (
    <div className=" flex justify-center items-center  h-80 w-95  p-3">
      <div className="flex flex-col  gap-4 h-full w-full justify-center items-center outline-1 outline-transparent ">
        <Skeleton className="w-full h-5/7 flex-1 rounded-2xl" />
        <Skeleton className="w-full h-1/7 rounded-2xl "/>
        <span className=" flex w-full h-1/7 gap-2.5">
          <Skeleton className="aspect-square  rounded-full" />
          <Skeleton className="flex-1 rounded-2xl" />
        </span>
      </div>
     </div>
  );
};

export { VideoCardSkeleton };
