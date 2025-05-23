import { useMutation } from "@tanstack/react-query";
import { selectUser } from "@/contexts/auth/authSlice";
import { useSelector } from "react-redux";
import { AxiosError } from "axios";
import { apiClient} from "./ApiClient";
import { handleResponse } from "@/utils";

type toggleVideoLikeBody = {
  targetId: string;
};
export const useToggleVideoLike = () => {
  const { accessToken } = useSelector(selectUser);

  const {
    data,
    isSuccess,
    error,
    isError,
    mutateAsync: toggleLike,
  } = useMutation<{likeCount:number;}, AxiosError, toggleVideoLikeBody>({
    mutationFn: async ({ targetId }: toggleVideoLikeBody) => {
      const response = await apiClient.post<ApiResponse<{likeCount:number}>>("/like/video", { targetId:targetId},{
        headers:{
            Authorization:`Bearer ${accessToken}`
        }
      });
      return handleResponse(response,"failed to like the video");
    
    },
    mutationKey:["videoLikes",accessToken]
  });

  return {data,isSuccess,error,isError,toggleLike}
};


export const useToggleCommentLike = ()=>{
  const {accessToken}= useSelector(selectUser);
  const {
    data,
    isSuccess,
    error,
    isError,
    mutateAsync: toggleLike,
  } = useMutation<{likeCount:number;}, AxiosError, toggleVideoLikeBody>({
    mutationFn: async ({ targetId }: toggleVideoLikeBody) => {
      const response = await apiClient.post<ApiResponse<{likeCount:number}>>("/like/comment", { targetId:targetId},{
        headers:{
            Authorization:`Bearer ${accessToken}`
        }
      });
      return handleResponse(response,"failed to like the video");
    
    },
    mutationKey:["videoLikes",accessToken],
  });

  return {data,isSuccess,error,isError,toggleLike}

}


