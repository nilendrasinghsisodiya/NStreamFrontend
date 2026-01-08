import { selectUser, setUser } from "./../contexts/auth/authSlice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { apiClient, queryClient } from "./ApiClient";
import { handleResponse } from "@/utils";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

export interface ICreateUserBody {
  fullname: string;
  description: string;
  avatar: File;
  coverImage?: File;
}

export const useCreateUser = () => {
  const {
    isError,
    data,
    isPending,
    error,
    mutateAsync: createUser,
  } = useMutation<IUser, AxiosError, ICreateUserBody>({
    mutationFn: async (params: ICreateUserBody) => {
      const response = await apiClient.put<ApiResponse<IUser>>(
        `/user/create`,
        params,
      );

      return handleResponse<IUser>(
        response,
        "Failed to create user. Try again later.",
      );
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return { isError, data, error, isPending, createUser };
};
export interface IUpdateUserBody {
  email?: string;
  description?: string;
  fullname?: string;
}
export const useUpdateUser = () => {
  const { _id } = useSelector(selectUser);
  const {
    isError,
    isPending,
    error,
    data,
    mutateAsync: updateUser,
  } = useMutation<IUser, AxiosError, IUpdateUserBody>({
    mutationKey: ["UserUpdate", _id],
    mutationFn: async (props: IUpdateUserBody) => {
      const response = await apiClient.patch<ApiResponse<IUser>>(
        "/user/update-account",
        props,
      );

      return handleResponse(response, "failed to update the user");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User", _id] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return { isError, error, data, updateUser, isPending };
};

export const useDeleteUser = () => {
  const { _id } = useSelector(selectUser);

  const deleteUserFuntion = async () => {
    const response = await apiClient.delete<ApiResponse<unknown>>("/user/");
    return handleResponse(response, "falied to delete user");
  };

  const {
    isError,
    error,
    mutateAsync: deleteUser,
  } = useMutation<unknown, Error, void>({
    mutationFn: deleteUserFuntion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User", _id] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
  return { isError, error, deleteUser };
};

export const useUserRecommendation = () => {
  const user = useSelector(selectUser);

  const { isError, isLoading, isSuccess, data } = useQuery<
    IVideo[],
    AxiosError
  >({
    queryKey: ["userRecommendation"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<IVideo[]>>(
        "/user/recommendations",
        {
          withCredentials: true,
          headers: { optional: "true" },
        },
      );
      return handleResponse(response, "failed to get recommendations");
    },
    staleTime: 20 * 60 * 1000,
    retry: false,
    enabled: !!user,
  });
  if (!user) {
    return { isError: true, isLoading: false, isSuccess: false, data: null };
  }

  return { isError, isLoading, isSuccess, data };
};

type getUserPlaylistData = {
  playlists: Pick<IPlaylist, "_id" | "name" | "view" | "cover">[];
};

export const useGetUserPlaylists = ({
  username,
  isOpen,
}: {
  username: string;
  isOpen: boolean;
}) => {
  const {
    data: playlists,
    isSuccess,
    isError,
    isLoading,
  } = useQuery<getUserPlaylistData, AxiosError>({
    queryKey: ["userPlaylists", username],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<getUserPlaylistData>>(
        `/user/playlists?username=${username}`,
      );
      return handleResponse<getUserPlaylistData>(
        response,
        "failed to fetch user playlist",
      );
    },
    enabled: isOpen,
  });

  return { isError, isSuccess, playlists, isLoading };
};
export const useGetUserWatchHistory = (isActive: boolean) => {
  const { _id: userId } = useSelector(selectUser);
  const query = useQuery<IWatchHistory[], AxiosError>({
    queryKey: ["watch histroy", userId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<IWatchHistory[]>>(
        `/user/history`,
        {
          withCredentials: true,
        },
      );
      return handleResponse<IWatchHistory[]>(
        response,
        "failed to get user watch history",
      );
    },
    enabled: isActive,
  });
  return { ...query };
};

export const useToggleSubscribed = () => {
  const query = useMutation<
    { subscribersCount: number; flag: boolean },
    AxiosError,
    { targetId: string }
  >({
    mutationKey: ["subscribed"],
    mutationFn: async ({ targetId }) => {
      const response = await apiClient.post<
        ApiResponse<{ subscribersCount: number; flag: boolean }>
      >("/user/subscribe", { targetId });
      return handleResponse<{ subscribersCount: number; flag: boolean }>(
        response,
        "failed to toggle subscribe",
      );
    },
    onError: (error) => {
      toast.error("failed to subscribe please try later.", {
        toasterId: "global",
      });
      console.error(error.message);
    },
  });
  return query;
};
type userStats = {
  totalSubscribers: number;
  totalViews: number;
  mostPopularVideos: IVideo[];
  subsInLast30Days: number;
  subsInLast7Days: number;
  subsInLast24Hrs: number;
  viewsInLast24Hrs: number;
  viewsInLast7Days: number;
  viewsInLast30Days: number;
};
export const useGetUserDashboard = () => {
  const query = useQuery<userStats, AxiosError>({
    queryKey: ["Dashboard"],
    queryFn: async () => {
      const response =
        await apiClient.get<ApiResponse<userStats>>("dashboard/stats");
      return handleResponse(response, "failed to fetch user dashboard");
    },
    refetchInterval: 20 * 1000,
  });

  return { ...query };
};
type updateUserAvatarBody = {
  avatar: File;
};
export const useUpdateUserAvatar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const mutation = useMutation<IUser, AxiosError, updateUserAvatarBody>({
    mutationKey: ["updateAvatar"],
    mutationFn: async ({ avatar }) => {
      console.log("avatar",avatar);
      const response = await apiClient.patch<ApiResponse<IUser>>(
        "/user/avatar",
        {
          avatar: avatar,
        },
        {headers:{
          "Content-Type":"multipart/form-data"
        }}
      );
      return handleResponse(response, "failed to update avatar");
    },
    onSuccess:({avatar})=>{
    dispatch(setUser({...user,avatar:avatar}));
    }
  });
  return { ...mutation };
};
