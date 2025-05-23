import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { apiClient } from "./ApiClient";
import { handleResponse } from "@/utils";
import { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "@/contexts/auth/authSlice";

interface UploadVideoBody {
  title: string;
  description: string;
  videoFile: File;
  thumbnail: File;
  tags?: string[];
}

const useUploadVideo = () => {
  const {
    data,
    isSuccess,

    error,
    isError,
    mutateAsync: uploadVideo,
  } = useMutation<IVideo, AxiosError, UploadVideoBody>({
    mutationFn: async (props: UploadVideoBody) => {
      const response = await apiClient.post<ApiResponse<IVideo>>(
        "videos/",
        props
      );
      return handleResponse<IVideo>(response, "Failed to upload a video");
    },
  });

  return { data, isSuccess, error, isError, uploadVideo };
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
  const allVideoQuery = useQuery<IVideo[], AxiosError>({
    queryKey: ["videos", userId, limit, page, sortBy, sortType], // 🔹 Pass parameters here
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<IVideo[]>>(
        `/videos/all?userId=${userId}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortType=${sortType}`
      );
      return handleResponse<IVideo[]>(
        response,
        "Failed to fetch all videos for the channel"
      );
    },
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });
  return { ...allVideoQuery };
};

interface VideoBody extends Omit<IVideo, "owner"> {
  ownerDetails: {
    _id: string;
    avatar: string;
    username: string;
  };
}
const useGetVideo = (videoId: string) => {
  const {accessToken} = useSelector(selectUser);
  const getVideoQuery = useQuery<VideoBody, AxiosError>({
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<VideoBody>>(
        `/video/?videoId=${videoId}`,
        {
          headers: {
            Optional: "true",
            Authorization: accessToken? `Bearer ${accessToken}`:"",
          },
        }
      );
      return handleResponse<VideoBody>(response, "failed to fetch channel");
    },
    queryKey: ["video", videoId],
    staleTime: 100000,
    refetchOnWindowFocus: false,
  });

  return { ...getVideoQuery };
};

export interface IPaginatedVideos {
  popularVideos: IVideo[];
  totalVideos: number;
  currentPage: number;
  totalPage: number;
  hasNextPage: boolean; // Fix: Changed type to boolean
  hasPrevPage: boolean;
  nextPage?: number; // Fix: Optional since it may not always exist
  prevPage?: number;
}

interface GetPopularVideoParams {
  limit: number; // Fix: Renamed for clarity
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
  });

  return {
    ...popularVideoQuery,
  };
};
export { useUploadVideo, useAllVideos, useGetVideo, usePopularVideo };
