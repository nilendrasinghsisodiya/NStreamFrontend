import { useMutation } from "@tanstack/react-query";
import { apiClient } from "./ApiClient";
import { handleResponse } from "@/utils";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { reset } from "@/contexts/auth/authSlice";
import { toast } from "sonner";

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
    mutationKey: ["User"],
    mutationFn: async (formData: ILoginUserBody) => {
      const response = await apiClient.post<ApiResponse<IUser>>(
        "auth/login",
        formData,
      );
      return handleResponse<IUser>(response, "failed to login user");
    },
    onError: () => {
      toast.error("failed to Log In", { toasterId: "global" });
    },
  });

  return { isError, data, isSuccess, isPending, loginUser };
};

interface IRegisterUserBody {
  email: string;
  password: string;
  username: string;
}
type RegisterDataType = Pick<IUser, "_id" | "email" | "createdAt" | "username">;
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
        "/auth/register",
        formData,
      );
      return handleResponse<RegisterDataType>(
        response,
        "failed to login user",
        201,
      );
    },
    onError: () => {
      toast.error("failed to Register User ", { toasterId: "global" });
    },
  });

  return { isError, data, isSuccess, RegisterUser, isPending };
};

export const useLogoutUser = () => {
  const dispatch = useDispatch();
  const {
    mutateAsync: logout,
    isError,
    isSuccess,
  } = useMutation<undefined, AxiosError>({
    mutationKey: ["userLogout"],
    mutationFn: async () => {
      const response =
        await apiClient.post<ApiResponse<undefined>>("/auth/logout");
      return handleResponse<undefined>(
        response,
        "failed to logout",
        204,
        false,
      );
    },
    onSuccess: () => {
      dispatch(reset());
    },
  });
  return { logout, isError, isSuccess };
};
