import { useChannelSearch } from "@/api/ChannelApi";
import type {
  searchType as ISearchType,
  sortBy as ISortBy,
  sortType as ISortType,
} from "@/api/VideoApi";
import { useSearchVideo } from "@/api/VideoApi";
import {
  UserListVirtual,
  UserWIthSubscriptionFlag,
} from "@/components/channel/ChannelSearchResult";
import { ErrorScreen } from "@/components/ErrorComponent";
import { VirtualVideoList } from "@/components/video/VideoListVirtual";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const limit = 15;
  const query = searchParams.get("query") ?? "";
  const searchType = (searchParams.get("type") as ISearchType) ?? "vid";
  const sortBy = (searchParams.get("sortBy") as ISortBy) ?? "views";
  const sortType = (searchParams.get("sortType") as ISortType) ?? "asc";

  const channelSearchQuery = useChannelSearch({
    limit: limit,
    query: query,
    // sortType: params.sortType,
    // sortBy: params.sortBy === "createdAt" ? "createdAt" : "",
    isActive: searchType === "chnl",
  });
  const fetchedUsers = useMemo<UserWIthSubscriptionFlag[]>(() => {
    if (channelSearchQuery.data && channelSearchQuery.data.pages) {
      return channelSearchQuery.data.pages.flatMap((page) => page.Channels);
    } else {
      return [];
    }
  }, [channelSearchQuery.data]);

  const videoSearchQuery = useSearchVideo({
    limit: limit,
    query: query,
    sortBy: sortBy,
    sortType: sortType,
    isActive: searchType === "vid",
  });
  const fetchedVids = useMemo<IVideo[]>(() => {
    if (videoSearchQuery.data && videoSearchQuery.data.pages) {
      return videoSearchQuery.data.pages.flatMap((page) => page.Videos);
    } else {
      return [];
    }
  }, [videoSearchQuery.data]);

  if (searchType === "chnl") {
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
          fetchNextPage={videoSearchQuery.fetchNextPage}
          itemClassName="flex flex-row items-center  h-fit p-2 justify-evenly boder-x-0"
          hasNextPage={videoSearchQuery.hasNextPage}
          isLoading={videoSearchQuery.isLoading}
          isSuccess={videoSearchQuery.isSuccess}
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
