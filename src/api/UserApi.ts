import { selectUser } from "./../contexts/auth/authSlice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { apiClient, queryClient } from "./ApiClient";
import { handleResponse } from "@/utils";
import { AxiosError } from "axios";
import { toast } from "sonner";

export interface ICreateUserBody {
  fullname: string;
  description:string;
  avatar: File;
  coverImage?: File;
}

export const useCreateUser = () => {
  const {accessToken} = useSelector(selectUser);
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
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization:`Bearer ${accessToken}`
          },
          withCredentials: true,
        }
      );

      return handleResponse<IUser>(
        response,
        "Failed to create user. Try again later."
      );
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return { isError, data, error, isPending,createUser };
};
export interface IUpdateUserBody {
  email?: string;
  description?: string;
  fullname?: string;
}
export const useUpdateUser = () => {
  const { accessToken } = useSelector(selectUser);

  const updateUserFunction = async (props: IUpdateUserBody) => {
    const response = await apiClient.patch("/user/update-account", props, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("failed to update user");
    }
  };
  const {
    isError,
    error,
    data,
    mutateAsync: updateUser,
  } = useMutation({
    mutationKey: ["UserUpdate", accessToken],
    mutationFn: updateUserFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User", accessToken] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return { isError, error, data, updateUser };
};

export const useDeleteUser = () => {
  const { accessToken } = useSelector(selectUser);

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
      queryClient.invalidateQueries({ queryKey: ["User", accessToken] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
  return { isError, error, deleteUser };
};

interface ILoginUserBody {
  email: string;
  password: string;
}

export const useLoginUser = () => {
  const {
    isError,
    data,
    isPending,
    isSuccess,
    mutateAsync: loginUser,
  } = useMutation<IUser, AxiosError, ILoginUserBody>({
    mutationFn: async (formData: ILoginUserBody) => {
      const response = await apiClient.post<ApiResponse<IUser>>(
        "user/login",
        formData
      );
      return handleResponse<IUser>(response, "failed to login user");
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return { isError, data, isSuccess, isPending,loginUser };
};

interface IRegisterUserBody {
  email: string;
  password: string;
  username: string;
}
type RegisterDataType = Pick<
  IUser,
  "_id" | "email" | "createdAt" | "accessToken" | "username"
>;
export const useRegisterUser = () => {
  const {
    isError,
    data,
    isSuccess,
    isPending,
    mutateAsync: RegisterUser,
  } = useMutation<RegisterDataType, AxiosError, IRegisterUserBody>({
    mutationFn: async (formData: IRegisterUserBody) => {
      const response = await apiClient.post<ApiResponse<RegisterDataType>>(
        "/user/register",
        formData
      );
      return handleResponse<RegisterDataType>(response, "failed to login user");
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return { isError, data, isSuccess, RegisterUser,isPending };
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
        { withCredentials: true,headers:{optional:"true"} }
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

export const useLogoutUser = () => {
  const { accessToken } = useSelector(selectUser);
  console.log(accessToken);
  const {
    mutateAsync: logout,
    isError,
    isSuccess,
  } = useMutation<undefined, AxiosError>({
    mutationKey: ["userLogout"],
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<undefined>>(
        "/user/logout",
        { withCredentials: true },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return handleResponse<undefined>(response, "failed to logout");
    },
    onSuccess: () => {
      console.log("logout querry ranned sucessfully");
    },
  });
  return { logout, isError, isSuccess };
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
        `/user/playlists?username=${username}`
      );
      return handleResponse<getUserPlaylistData>(
        response,
        "failed to fetch user playlist"
      );
    },
    enabled: isOpen,
  });

  return { isError, isSuccess, playlists, isLoading };
};
export const useGetUserWatchHistory = (isActive: boolean) => {
  const { _id: userId } = useSelector(selectUser);
  const query = useQuery({
    queryKey: ["watch histroy", userId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<IWatchHistory[]>>(
        `/user/history`,
        { withCredentials: true }
      );
      return handleResponse<IWatchHistory[]>(
        response,
        "failed to get user watch history"
      );
    },
    enabled: isActive,
  });
  return { ...query };
};

export const useToggleSubscribed = () => {
  const query = useMutation<
    { subsCount: number; flag: boolean },
    AxiosError,
    { targetId: string }
  >({
    mutationKey: ["subscribed"],
    mutationFn: async ({ targetId }) => {
      const response = await apiClient.post<
        ApiResponse<{ subsCount: number; flag: boolean }>
      >("/user/subscribe", { targetId });
      return handleResponse<{ subsCount: number; flag: boolean }>(
        response,
        "failed to toggle subscribe"
      );
    },
    onError: (error) => {
      toast.error("failed to subscribe please try later.");
      console.error(error.message);
    },
  });
  return query;
};
type userStats = {
  totalSubscribers: number;
  totalViews: number;
  mostPopularVideos: IVideo[];
  likedVideos: IVideo[];
  subsInLast30Days: number;
  subsInLast7Days: number;
  userComments: IComment[];
};
export const useGetUserDashboard = () => {
  const { accessToken } = useSelector(selectUser);
  const query = useQuery<userStats, AxiosError>({
    queryKey: ["Dashboard"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<userStats>>(
        "dashboard/stats",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return handleResponse(response, "failed to fetch user dashboard");
    },
    refetchInterval: 20 * 1000,
  });

  return { ...query };
};
