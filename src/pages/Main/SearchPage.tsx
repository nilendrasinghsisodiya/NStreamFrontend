import { useChannelSearch } from "@/api/ChannelApi";
import {
  
  searchType,
  sortBy,
  sortType,
  useSearchVideo,
} from "@/api/VideoApi";
import { UserListVirtual, UserWIthSubscriptionFlag } from "@/components/channel/ChannelSearchResult";
import { ErrorScreen } from "@/components/ErrorComponent";
import { VirtualVideoList } from "@/components/video/VideoListVirtual";
import { resetSearch, selectSearch, setSearch } from "@/contexts/search/searchSlice";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
 
  const dispatch = useDispatch();
   
 
  useEffect(() => {
    
    if (searchParams) {
      dispatch(
        setSearch({
          query: searchParams.get("query") as string,
          type: searchParams.get("type") as searchType,
          sortBy:searchParams.get("sortBy") as sortBy,
          sortType:searchParams.get("sorttype") as sortType,
          limit:Number(searchParams.get("limit"))
        })
      );
     
    }
  }, [searchParams, dispatch]);

  useEffect(()=>{
    return ()=>{
      dispatch(resetSearch());
    }
  },[dispatch]);

   const {sortBy,sortType,query,type,limit} = useSelector(selectSearch)
  const channelSearchQuery = useChannelSearch({
    limit: limit,
    query: query,
    // sortType: params.sortType,
    // sortBy: params.sortBy === "createdAt" ? "createdAt" : "",
    isActive: type === "chnl",
  });

  const fetchedUsers = useMemo<UserWIthSubscriptionFlag[]>(() => {
    if (channelSearchQuery.data && channelSearchQuery.data.pages) {
      return channelSearchQuery.data.pages.flatMap((page) => page.Channels);
    } else {
      return [];
    }
  }, [channelSearchQuery]);

  const { data, hasNextPage, isLoading, isSuccess, fetchNextPage } =
    useSearchVideo({
      limit: limit,
      query:query as string,
      sortBy:sortBy,
      sortType: sortType,
      isActive: type === "vid",
    });
  const fetchedVids = useMemo<IVideo[]>(() => {
    if (data && data.pages) {
      return data.pages.flatMap((page) => page.Videos);
    } else {
      return [];
    }
  }, [data]);

  if (type === "chnl") {
    return (
      <UserListVirtual
        fetchNextPage={channelSearchQuery.fetchNextPage}
        itemClassName="flex w-full min-h-[250px] gap-3 p-2  items-center justify-evenly border-2 border-accent my-2 border-x-0 "
        users={fetchedUsers}
        hasNextPage={channelSearchQuery.hasNextPage}
        useWindowScroll
      />
    );
  }
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
};
export { SearchPage };
