import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./ApiClient";
import { handleResponse } from "@/utils";
import { useSelector } from "react-redux";
import { selectUser } from "@/contexts/auth/authSlice";
import { AxiosError } from "axios";
import { UserWIthSubscriptionFlag } from "@/components/channel/ChannelSearchResult";
type getChannelBody =
  | { username: string; userId?: never } // If `a` is passed, `b` must not be passed
  | { username?: never; userId: string };
const useGetChannel = ({ username, userId }: getChannelBody) => {
  const { isLoading, isError, error, data, isSuccess } = useQuery<
    IChannel,
    AxiosError
  >({
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (username) {
        queryParams.set("username", username);
      }
      if (userId) {
        queryParams.set("userId", userId);
      }

      const response = await apiClient.get<ApiResponse<IChannel>>(
        `/user/channel?${queryParams.toString()}`,
        { headers: { Optional: "true" } }
      );
      return handleResponse<IChannel>(response, "failed to fetch channel");
    },
    throwOnError: true,

    queryKey: ["channel", username],
    staleTime: 100000,
    refetchOnWindowFocus: false,
  });

  return { isLoading, isError, data, isSuccess, error };
};

const useChannelStats = () => {
  const { isLoading, isError, error, data, isSuccess } = useQuery({
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<IChannel>>(
        `/dashboard/stats/`,
        {
          withCredentials: true,
        }
      );
      return handleResponse<IChannel>(response, "failed to fetch channel");
    },
    queryKey: ["channel"],
    staleTime: 100000,
    refetchOnWindowFocus: false,
  });

  return { isLoading, isError, data, isSuccess, error };
};

interface ChannelVideosBody {
  limit?: number;
  sortBy?: string;
  sortType: string;
  username: string;
}
export interface EditContext {
  id:string;
  reseted:boolean;
  video:Pick<IVideo,"thumbnail"|"title"|"owner"|"tags"|"views">;
}

export interface channelVideoType extends IPaginatedBase {
  Videos: (IVideo & {
    SetEditContext?: React.Dispatch<React.SetStateAction<EditContext>>;
    uniqueId?: string;
    EditContext?: EditContext;
  })[];
}
const useChannelVideos = ({
  limit = 5,

  sortBy = "createdAt",
  sortType = "asc",
  username,
}: ChannelVideosBody) => {
  const { accessToken } = useSelector(selectUser);
  const channelVideoQuery = useInfiniteQuery<channelVideoType>({
    queryKey: ["channelVideos"],
    queryFn: async ({ pageParam }) => {
      const response = await apiClient.get<ApiResponse<channelVideoType>>(
        `/dashboard/videos?username=${username}&limit=${limit}&page=${pageParam}&sortBy=${sortBy}&sortType=${sortType}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return handleResponse<channelVideoType>(
        response,
        "Failed to fetch all videos for the channel"
      );
    },
    staleTime: 10000,
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.hasPrevPage ? lastPage.prevPage : undefined,
  });
  return { ...channelVideoQuery };
};
const useSubscribe = () => {
  const subscribeQuery = useMutation<
    { subsriberCount: number },
    AxiosError,
    { targetId: string }
  >({
    mutationKey: ["subscribe"],
    mutationFn: async ({ targetId }) => {
      const response = await apiClient.post<
        ApiResponse<{ subsriberCount: number }>
      >(
        "/user/subscribe",
        { subscribeTo: targetId },
        { withCredentials: true }
      );
      return handleResponse(
        response,
        "failed to subscribe or unsubscribe user"
      );
    },
    retry: false,
  });
  return { ...subscribeQuery };
};

 const useSubscribedVideos = ({
  
  limit,
 
}: {
  
  limit: number;
 
}) => {
  const query = useInfiniteQuery<IPaginatedVideos, AxiosError>({
    queryKey: ["subscribedVideo"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<ApiResponse<IPaginatedVideos>>(
        `user/subscribedVideos?page=${pageParam}&limit=${limit}`
      );
      return handleResponse(response, "failed to fetch related videos");
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      
      return lastPage.hasNextPage ? lastPage.nextPage : undefined;
    },

    getPreviousPageParam: (lastPage) =>
      lastPage.hasPrevPage ? lastPage.prevPage : undefined,
  });
  return { ...query };
};

interface channelSearchData extends IPaginatedBase {
  Channels:UserWIthSubscriptionFlag[];
}

const useChannelSearch = ({query,limit,isActive}:{limit:number;query:string; isActive:boolean})=>{
 const infinteQuery = useInfiniteQuery<channelSearchData, AxiosError>({
    queryKey: ["ChannelSearch"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<ApiResponse<channelSearchData>>(
        `user/search?query=${query}&page=${pageParam}&limit=${limit}`
      );
      return handleResponse(response, "failed to fetch related videos");
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      
      return lastPage.hasNextPage ? lastPage.nextPage : undefined;
    },

    getPreviousPageParam: (lastPage) =>
      lastPage.hasPrevPage ? lastPage.prevPage : undefined,
    enabled:isActive,
  });
  return { ...infinteQuery };
}
export { useGetChannel, useChannelStats, useChannelVideos, useSubscribe,useSubscribedVideos,useChannelSearch};
