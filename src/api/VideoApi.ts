import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { apiClient } from "./ApiClient";
import { handleResponse } from "@/utils";
import { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "@/contexts/auth/authSlice";
import { useRef, useState } from "react";
import { toast } from "sonner";

const useUploadVideo = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const abortRef = useRef<AbortController | null>(null);
  const uploadMutation = useMutation<IVideo, AxiosError, FormData>({
    mutationFn: async (formData) => {
      console.log("video api video upload", formData.entries());
      const response = await apiClient.post<ApiResponse<IVideo>>(
        "video/",
        formData,
        {
          signal: abortRef.current?.signal,
          onUploadProgress: (ProgressEvent) => {
            setUploadProgress(Math.round(ProgressEvent.loaded * 100) / 100);
            console.log(Math.round(ProgressEvent.loaded * 100) / 100);
          },
        }
      );
      return handleResponse<IVideo>(response, "Failed to upload a video");
    },
    onSuccess: (variables) => {
      toast.success(`video upload for ${variables.title} just completed`);
    },
    onError: (error, variables) => {
      toast.error(`video upload for ${variables.get("title")} failed`);
      console.error(`Video Upload:${error.message}`);
    },
  });
  const cancelUpload = () => {
    if (abortRef && abortRef.current) abortRef.current.abort();
  };
  return { uploadProgress, cancelUpload, ...uploadMutation };
};

interface AllVideosBody {
  userId: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortType?: string;
}

const useAllVideos = ({
  userId,
  limit = 10,
  page = 1,
  sortBy = "createdAt",
  sortType = "asc",
}: AllVideosBody) => {
  const allVideoQuery = useInfiniteQuery<IPaginatedVideos, AxiosError>({
    queryKey: ["videos", userId, limit, page, sortBy, sortType], // 🔹 Pass parameters here
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<IPaginatedVideos>>(
        `/video/all?userId=${userId}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortType=${sortType}`
      );
      return handleResponse(
        response,
        "Failed to fetch all videos for the channel"
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,

    getPreviousPageParam: (lastPage) =>
      lastPage.hasPrevPage ? lastPage.prevPage : undefined,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
  return { ...allVideoQuery };
};

const useGetVideo = (videoId: string) => {
  const { accessToken } = useSelector(selectUser);
  const getVideoQuery = useQuery<IVideo, AxiosError>({
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<IVideo>>(
        `/video/?videoId=${videoId}`,
        {
          headers: {
            Optional: "true",
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );
      return handleResponse<IVideo>(response, "failed to fetch channel");
    },
    queryKey: ["video", videoId],
    staleTime: 100000,
    refetchOnWindowFocus: false,
  });

  return { ...getVideoQuery };
};

interface GetPopularVideoParams {
  limit: number;
}

const usePopularVideo = ({ limit }: GetPopularVideoParams) => {
  const popularVideoQuery = useInfiniteQuery<IPaginatedVideos, AxiosError>({
    queryKey: ["popularVideos", limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<ApiResponse<IPaginatedVideos>>(
        `/video/popular?page=${pageParam}&limit=${limit}`
      );
      return handleResponse(response, "failed to fetch video comment");
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,

    getPreviousPageParam: (lastPage) =>
      lastPage.hasPrevPage ? lastPage.prevPage : undefined,
  });

  return {
    ...popularVideoQuery,
  };
};

export const useRelatedVideos = ({
  videoId,
  limit,
}: {
  videoId: string;
  limit: number;
}) => {
  const query = useInfiniteQuery<IPaginatedVideos, AxiosError>({
    queryKey: ["relatedVideo", videoId, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<ApiResponse<IPaginatedVideos>>(
        `video/related?videoId=${videoId}&page=${pageParam}&limit=${limit}`
      );
      return handleResponse(response, "failed to fetch related videos");
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,

    getPreviousPageParam: (lastPage) =>
      lastPage.hasPrevPage ? lastPage.prevPage : undefined,
  });
  return { ...query };
};

 export type sortBy = "views" | "createdAt";
export type sortType = "asc" | "desc";
export type searchType = 'vid'| 'chnl';
export type searchQueryParams = {
  sortBy: sortBy;
  sortType: sortType;
  query: string;
  type: searchType;
  limit: number;
};
export const useSearchVideo = ({
  limit,
  sortBy,
  sortType,
  query,
  type,
}: searchQueryParams) => {
  const searchQuery = useInfiniteQuery<IPaginatedVideos, AxiosError>({
    queryKey: ["search", query, type],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<ApiResponse<IPaginatedVideos>>(
        `/video/search?query=${query}&type=${type}&page=${pageParam}&limit=${limit}&sortBy=${sortBy}&sortType=${sortType}`
      );
      return handleResponse<IPaginatedVideos>(
        response,
        "something went wrong while search"
      );
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,

    getPreviousPageParam: (lastPage) =>
      lastPage.hasPrevPage ? lastPage.prevPage : undefined,
  });
  return { ...searchQuery };
};

export { useUploadVideo, useAllVideos, useGetVideo, usePopularVideo };
