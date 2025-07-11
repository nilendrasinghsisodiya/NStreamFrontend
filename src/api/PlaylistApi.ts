import { useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectUser } from "@/contexts/auth/authSlice";
import { apiClient } from "./ApiClient";
import { handleResponse } from "@/utils";
import { AxiosError } from "axios";
type createPlaylistBody = {
  name: string;
  description: string;
};

export const useCreatePlaylist = () => {
  const { accessToken } = useSelector(selectUser);
  const {
    isError,
    isSuccess,
    mutateAsync: create,
    error,
  } = useMutation<IPlaylist, AxiosError, createPlaylistBody>({
    mutationKey: ["playlist", name],
    mutationFn: async ({ name, description }: createPlaylistBody) => {
      const response = await apiClient.post<ApiResponse<IPlaylist>>(
        "/playlist/createPlaylist",
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return handleResponse<IPlaylist>(response, "failed to create playlist");
    },
  });

  return { isError, isSuccess, create, error };
};
type addVideoToPlaylistBody = {
  videoIds: [string];
  playlistId: string;
};
export const useAddVideoToPlaylist = () => {
  const { accessToken } = useSelector(selectUser);
  const {
    isError,
    error,
    mutateAsync: add,
    isSuccess,
  } = useMutation<unknown, AxiosError, addVideoToPlaylistBody>({
    mutationFn: async ({ videoIds, playlistId }) => {
      const response = await apiClient.patch<ApiResponse<unknown>>(
        "/playlist/addVideos",
        { videoIds, playlistId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      return handleResponse<unknown>(
        response,
        "failed to add videos in playlsit"
      );
    },
  });

  return { add, isError, isSuccess, error };
};

type updatePlaylistBody = {
  playlistId: string;
  name: string;
  description?: string;
};
export const useUpdatePlaylist = () => {
  const { accessToken } = useSelector(selectUser);
  const {
    isError,
    error,
    mutateAsync: update,
    isSuccess,
  } = useMutation<IPlaylist, AxiosError, updatePlaylistBody>({
    mutationFn: async ({ name, description, playlistId }) => {
      const response = await apiClient.patch<ApiResponse<IPlaylist>>(
        "/playlist/addVideos",
        { playlistId, name, description: description && description },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      return handleResponse<IPlaylist>(
        response,
        "failed to add videos in playlsit"
      );
    },
  });

  return { update, isError, isSuccess, error };
};
interface IPaginatedPlaylist extends IPaginatedBase {
  playlist: {
    name: string;
    view: number;
    owner: string;
    videos: IVideo[];
    description:string;
    totalVideos: number;
  };
}
type getPlaylistBody = {
  playlistId: string;
  limit: number;
};
export const useGetPlaylist = ({ playlistId, limit }: getPlaylistBody) => {
  const { accessToken } = useSelector(selectUser);
  const playlistQuery = useInfiniteQuery<IPaginatedPlaylist, AxiosError>({
    queryKey: ["playlists", playlistId, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<ApiResponse<IPaginatedPlaylist>>(
        `playlist?playlistId=${playlistId}&page=${pageParam}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            optional: true,
          },
        }
      );
      return handleResponse<IPaginatedPlaylist>(
        response,
        "failed to get playlist"
      );
    },
    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    getPreviousPageParam: (lastPage) =>
      lastPage.hasPrevPage ? lastPage.prevPage : undefined,
  });

  return { ...playlistQuery };
};

type removeVideosFromPlaylistBody = {
  videoIds: [string];
  playlistId: string;
};
export const useRemoveVideoFromPlaylist = () => {
  const { accessToken } = useSelector(selectUser);
  const {
    isError,
    error,
    mutateAsync: removeVideos,
    isSuccess,
  } = useMutation<IPlaylist, AxiosError, removeVideosFromPlaylistBody>({
    mutationFn: async ({ videoIds, playlistId }) => {
      const response = await apiClient.patch<ApiResponse<IPlaylist>>(
        "/playlist/removeVideos",
        { videoIds, playlistId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      return handleResponse<IPlaylist>(
        response,
        "failed to remove videos in playlsit"
      );
    },
  });

  return { removeVideos, isError, isSuccess, error };
};

type deletePlaylistBody = {
  playlistId: string;
};

export const useDeletePlaylistVideo = () => {
  const { accessToken } = useSelector(selectUser);
  const {
    isError,
    mutateAsync: deletePlaylist,
    error,
    isSuccess,
  } = useMutation<unknown, AxiosError, deletePlaylistBody>({
    mutationFn: async ({ playlistId }: deletePlaylistBody) => {
      const response = await apiClient.delete<ApiResponse<unknown>>(
        `playlist/delete?playlistId=${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return handleResponse<unknown>(response, "failed to delete playlist");
    },
  });

  return { isError, isSuccess, deletePlaylist, error };
};
