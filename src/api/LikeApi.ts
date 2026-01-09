import { useMutation } from "@tanstack/react-query";
import { selectUser } from "@/contexts/auth/authSlice";
import { useSelector } from "react-redux";
import { AxiosError } from "axios";
import { apiClient } from "./ApiClient";
import { handleResponse } from "@/utils";

type toggleVideoLikeBody = {
  targetId: string;
};
export const useToggleVideoLike = () => {
  const {
    data,
    isSuccess,
    error,
    isError,

    mutateAsync: toggleLike,
  } = useMutation<unknown, AxiosError, toggleVideoLikeBody>({
    mutationFn: async ({ targetId }: toggleVideoLikeBody) => {
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/like/video",
        {
          videoId: targetId,
        },
      );
      return handleResponse(response, "failed to like the video");
    },
    mutationKey: ["videoLikes"],
  });

  return { data, isSuccess, error, isError, toggleLike };
};

export const useToggleCommentLike = () => {
  const {
    data,
    isSuccess,
    error,
    isError,
    mutateAsync: toggleLike,
  } = useMutation<{ likesCount: number }, AxiosError, toggleVideoLikeBody>({
    mutationFn: async ({ targetId }: toggleVideoLikeBody) => {
      const response = await apiClient.post<
        ApiResponse<{ likesCount: number }>
      >("/like/comment", {
        targetId: targetId,
      });
      return handleResponse(response, "failed to like the comment");
    },
    mutationKey: ["videoCommentLikes"],
  });

  return { data, isSuccess, error, isError, toggleLike };
};
