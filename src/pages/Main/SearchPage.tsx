import {
  searchQueryParams,
  searchType,
  sortBy,
  sortType,
  useSearchVideo,
} from "@/api/VideoApi";
import { VirtualVideoList } from "@/components/video/VideoListVirtual";
import { resetSearch, setSearch } from "@/contexts/search/searchSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router";

const SearchPage = () => {
  const [vids, setVids] = useState<IVideo[]>([]);
  const [searchParams] = useSearchParams();
  const [params, setParams] = useState<searchQueryParams>({
    query: "",
    limit: 10,
    sortBy: "createdAt",
    sortType: "asc",
    type: "vid",
  });
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(searchParams)
    if (searchParams) {
      setParams({
        query: searchParams.get("query") as string,
        sortBy: searchParams.get("sortBy") as sortBy,
        sortType: searchParams.get("sortType") as sortType,
        type: searchParams.get("type") as searchType,
        limit:10,
      });
      dispatch(
        setSearch({
          query: searchParams.get("query") as string,
          type: searchParams.get("type") as searchType,
        })
      );
      return ()=>{
        dispatch(resetSearch());
      }
    }
  }, [searchParams, dispatch]);

  const { data, hasNextPage, isLoading, isSuccess, fetchNextPage } =
    useSearchVideo(params);
  useEffect(() => {
    if (data && data.pages) {
      const videos = data.pages.flatMap((ele) => ele.Videos);
      setVids(videos);
    }
  }, [data]);
  return (
    <VirtualVideoList
      fetchNextPage={fetchNextPage}
      itemClassName="flex flex-row items-center"
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      isSuccess={isSuccess}
      videos={vids}
    />
  );
};
export { SearchPage };
