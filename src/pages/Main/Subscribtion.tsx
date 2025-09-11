import {  useSubscribedVideos } from "@/api/ChannelApi"
import { ErrorScreen } from "@/components/ErrorComponent";
import { VirtualVideoList } from "@/components/video/VideoListVirtual"
import { useMemo } from "react";

export const SubscribptionPage = ()=>{

    const { data, hasNextPage, isLoading, isSuccess, fetchNextPage } =
    useSubscribedVideos({limit:10});
     const fetchedVids = useMemo<IVideo[]>(()=>{
     if (data && data.pages) {
      return data.pages.flatMap((page) => page.Videos);}else{
        return [];
      }
  },[data]);
 
  return (
    <>
      {fetchedVids.length > 0 ? (
        <VirtualVideoList
          fetchNextPage={fetchNextPage}
          itemClassName="flex flex-row items-center  h-fit p-2 justify-evenly boder-x-0"
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isSuccess={isSuccess}
          videos={fetchedVids}
        />
      ) : (
        <ErrorScreen
          mainMessage="no search result found"
          secondaryMessage="please try something else"
        />
      )}
    </>
  );
}