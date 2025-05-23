import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./ApiClient";
import { handleResponse } from "@/utils";
import { useSelector } from "react-redux";
import { selectUser } from "@/contexts/auth/authSlice";
import { AxiosError } from "axios";
type getChannelBody =| { username: string; userId?: never } // If `a` is passed, `b` must not be passed
| { username?: never; userId: string };
const useGetChannel = ({username,userId}:getChannelBody) => {
  const { isLoading, isError, error, data, isSuccess } = useQuery<IChannel,AxiosError>({
    queryFn: async () => {
      
      const queryParams = new URLSearchParams();
      if(username){
        queryParams.set("username",username)
        
      }
      if(userId){
        queryParams.set("userId",userId);
      }
     
      const response = await apiClient.get<ApiResponse<IChannel>>(`/user/channel?${queryParams.toString()}`);
      return handleResponse<IChannel>(response, "failed to fetch channel");
    },
    throwOnError:true,
    
    queryKey: ["channel", username, userId],
    staleTime: 100000,
    refetchOnWindowFocus: false,
  });

  return { isLoading, isError, data, isSuccess, error };
};

const useChannelStats = () => {
 
  const { isLoading, isError, error, data, isSuccess } = useQuery({
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<IChannel>>(`/dashboard/stats/`, {
       withCredentials:true
      });
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
  page?: number;
  sortBy?: string;
  sortType?: string;
  username:string;
}

interface channelVideoType extends IChannel{
  videos:IVideo[]|[];
}
const useChannelVideos = ({
  limit = 10,
  page = 1,
  sortBy = "createdAt",
  sortType = "asc",
  username
}: ChannelVideosBody) => {
  const { accessToken } = useSelector(selectUser);
  const { isLoading, isError, isSuccess, error, data } = useQuery({
    queryKey: ["channelVideos", limit, page, sortBy, sortType], 
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<channelVideoType>>(
        `/dashboard/videos?username=${username}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortType=${sortType}`,
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
    
  });
  return { isError, error, isSuccess, isLoading, data };
};
 const useSubscribe = ()=>{

  const subscribeQuery = useMutation<{subsriberCount:number},AxiosError,{targetId:string}>({
    mutationKey:["subscribe"],
    mutationFn:async({targetId})=>{
      const response = await apiClient.post<ApiResponse<{subsriberCount:number}>>("/user/subscribe",{subscribeTo:targetId},{withCredentials:true});
      return handleResponse(response,"failed to subscribe or unsubscribe user");
    },
    retry:false,
  });
  return {...subscribeQuery};
}


export { useGetChannel, useChannelStats, useChannelVideos,useSubscribe };
