import { useMutation, useQuery } from "@tanstack/react-query";
import { handleResponse } from "@/utils";
import { apiClient } from "@/api/ApiClient";
import { AxiosError } from "axios";
import { toast } from "sonner";
type tokenedRequestBody = { token: string };
export const useRequestDelete = () => {
  const query = useQuery<void, AxiosError>({
    queryKey: ["RequestUserDeletion"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<void>>(
        "/tokened/request-delete",
      );
      return handleResponse(response, "failed to intiat deletion request");
    },
  });
  return query;
};

export const useDeleteUser = () => {
  const mutation = useMutation<void, AxiosError, tokenedRequestBody>({
    mutationKey: ["DeleteUser"],
    mutationFn: async ({ token }: tokenedRequestBody) => {
      const response = await apiClient.post<ApiResponse<void>>(
        "/tokened/delete-user",
        { token },
      );
      return handleResponse(response, "failed to delete user");
    },
    onSuccess: () => {
      toast.success("", { toasterId: "global" });
    },
    onError: (error) => {
      toast.error(error.message, { toasterId: "global" });
    },
  });
  return mutation;
};

export const useVerifyEmail = () => {
  const mutation = useMutation<void, AxiosError, tokenedRequestBody>({
    mutationKey: ["VerifyEmail"],
    mutationFn: async ({ token }: tokenedRequestBody) => {
      const response = await apiClient.post<ApiResponse<void>>(
        "/tokened/verify-email",
        { token },
      );
      return handleResponse(response, "failed to verify user email");
    },
    onSuccess: () => {
      toast.success("", { toasterId: "global" });
    },
    onError: (err) => {
      toast.error(err.message, { toasterId: "global" });
    },
  });
  return mutation;
};
