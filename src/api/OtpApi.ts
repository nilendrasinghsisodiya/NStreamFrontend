import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { apiClient } from "./ApiClient";
import { handleResponse } from "@/utils";
import { useNavigate } from "react-router";
import { toast } from "sonner";
type otpBody = { otp: string };
export const useForgetPassword = () => {
  const navigate = useNavigate();
  const mutation = useMutation<void, AxiosError, { email: string }>({
    mutationKey: ["forgotPassword"],
    mutationFn: async ({ email }) => {
      const response = await apiClient.post<ApiResponse<void>>("/otp/get-otp", {
        email,
      });
      return handleResponse(
        response,
        "failed to initiate forget password request",
      );
    },
    onSuccess: () => {
      toast.success("an otp has been sent to registerd email address", {
        toasterId: "global",
      });
      navigate("/otp", { replace: true });
    },
    onError: (err) => {
      console.error(err.message);
      toast.error("failed to send an otp, please try again later", {
        toasterId: "global",
      });
    },
  });
  return mutation;
};
export const useVerifyOtp = () => {
  const navigate = useNavigate();
  const mutation = useMutation<void, AxiosError, otpBody>({
    mutationKey: ["VerifyOtp"],
    mutationFn: async ({ otp }) => {
      const response = await apiClient.post<ApiResponse<void>>(
        "/otp/verify-otp",
        { otp },
      );
      return handleResponse(response, "failed to verify otp");
    },
    onSuccess: () => {
      toast.success("otp verfied successfully", { toasterId: "global" });
      navigate("/settings/reset-password", { replace: true });
    },
    onError: (err) => {
      console.error(err.message);
      toast.error("otp verification failed, please try correct otp", {
        toasterId: "global",
      });
    },
  });
  return mutation;
};
