import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

import { AxiosError } from "axios";
import { apiClient, queryClient } from "./ApiClient";
import { handleResponse } from "@/utils";
import { useSelector } from "react-redux";
import { selectUser } from "@/contexts/auth/authSlice";

type createCommentBody = Pick<IComment, "content" | "videoId" | "commentId">;

export const useCreateComment = () => {
  const { accessToken } = useSelector(selectUser);
  const {
    data,
    isError,
    isSuccess,
    error,
    mutateAsync: createComment,
  } = useMutation<IComment, AxiosError, createCommentBody>({
    mutationKey: ["comment"],
    mutationFn: async (props: createCommentBody) => {
      const response = await apiClient.post<ApiResponse<IComment>>(
        "/comment/",
        props,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return handleResponse(response, "failed to comment");
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["videoComments", vars.videoId],
      });
    },
  });

  return { data, isError, isSuccess, error, createComment };
};

interface IPaginatedComments extends IPaginatedBase {
  comments: IComment[];
  totalComments: number;
}

interface GetVideoCommentsParams {
  videoId: string;
  limit: number;
}

export const useGetVideoComments = ({
  videoId,
  limit,
}: GetVideoCommentsParams) => {
 const querry= useInfiniteQuery<IPaginatedComments, AxiosError>({
    queryKey: ["videoComments", videoId, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<ApiResponse<IPaginatedComments>>(
        `/video/comments?videoId=${videoId}&page=${pageParam}&limit=${limit}`,
        {
          headers: { Optional: "true" },
        }
      );
      return handleResponse(response, "failed to fetch video comment");
    },
    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,

    getPreviousPageParam: (lastPage) =>
      lastPage.hasPrevPage ? lastPage.prevPage : undefined,
  });

  return{...querry}
};

export const useDeleteComment = () => {
  const {
    data,
    isError,
    isSuccess,
    error,
    mutateAsync: deleteComment,
  } = useMutation<IComment, AxiosError, string>({
    mutationKey: ["comment"],
    mutationFn: async (commentId: string) => {
      const response = await apiClient.delete<ApiResponse<IComment>>(
        `/comment/${commentId}`
      );
      return handleResponse(response, "failed to comment");
    },
  });

  return { data, isError, isSuccess, error, deleteComment };
};
