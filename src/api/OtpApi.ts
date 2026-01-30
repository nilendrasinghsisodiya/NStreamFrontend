import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { apiClient } from "./ApiClient";
import { handleResponse } from "@/utils";
type otpBody = { otp: string };
export const useForgetPassword = () => {
  const mutation = useMutation<void, AxiosError, { email: string }>({
    mutationKey: ["forgotPassword"],
    mutationFn: async ({ email }) => {
      const response = await apiClient.post<ApiResponse<void>>("/otp/get-otp", {
        email,
      });
      return handleResponse(
        response,
        "failed to initated forget password request",
      );
    },
    onSuccess: () => {},
    onError: () => {},
  });
  return mutation;
};
export const useVerifyOtp = () => {
  const mutation = useMutation<void, AxiosError, otpBody>({
    mutationKey: ["VerifyOtp"],
    mutationFn: async ({ otp }) => {
      const response = await apiClient.post<ApiResponse<void>>(
        "/otp/verify-otp",
        { otp },
      );
      return handleResponse(response, "failed to verify otp");
    },
    onSuccess: () => {},
    onError: () => {},
  });
  return mutation;
};
