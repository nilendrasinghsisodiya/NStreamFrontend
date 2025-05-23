import { selectUser } from "./../contexts/auth/authSlice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { apiClient, queryClient } from "./ApiClient";
import { handleResponse } from "@/utils";
import { AxiosError } from "axios";

export interface ICreateUserBody {
  fullname: string;
  username: string;

  avatar: File;
  coverImage?: File;
}

export const useCreateUser = () => {
  
  const {
    isError,
    data,
    error,
    mutateAsync: createUser,
  } = useMutation<IUser, AxiosError, ICreateUserBody>({
    mutationFn: async (params: ICreateUserBody) => {
      const formData = new FormData();
      formData.append("fullname", params.fullname);
      formData.append("username", params.username);
      if (params.coverImage) {
        formData.append("coverImage", params.coverImage);
      }

      const response = await apiClient.post<ApiResponse<IUser>>(
        `/user/profile-create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          
          },
          withCredentials:true,
          
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

  return { isError, data, error, createUser };
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

  return { isError, data, isSuccess, loginUser };
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

  return { isError, data, isSuccess, RegisterUser };
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
        "/user/recommendations",{withCredentials:true}
      );
      return handleResponse(response, "failed to get recommendations");
    },
    staleTime: 20 * 60 * 1000,
    retry: false,
    enabled:!!user ,
  });
  if(!user){
    return {isError:true,isLoading:false,isSuccess:false,data:null};
  }

  return { isError, isLoading, isSuccess, data };
};

export const useLogoutUser = ()=>{
  const {accessToken}= useSelector(selectUser);
  console.log(accessToken);
  const {mutateAsync:logout,isError,isSuccess} = useMutation<undefined,AxiosError>({
    mutationKey:["userLogout"],
    mutationFn:async()=>{
      const response = await apiClient.post<ApiResponse<undefined>>("/user/logout",{withCredentials:true},{headers:{Authorization:`Bearer ${accessToken}`, }
      });
      return handleResponse<undefined>(response,"failed to logout");
    },
    onSuccess:()=>{
      console.log("logout querry ranned sucessfully");
    }
  });
  return {logout,isError,isSuccess};
};

