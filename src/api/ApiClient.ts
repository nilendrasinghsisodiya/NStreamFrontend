import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { navigateGlobal, refreshAccessToken } from "@/utils";
import { setUser, reset as resetUser } from "@/contexts/auth/authSlice";
import { store } from "@/ContextStore";
import { toast } from "sonner";

export const apiClient = axios.create({
	baseURL: "http://localhost:8000/api/v1",
	timeout: 10000,
	withCredentials: true,
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		console.log(`nStream:: Error:: ${error.message}`);
		const ogRequest = error.config;
		const status = error.status;
		console.log(ogRequest, status);


		// trys to refresh access token if fails then resets the user and shows a toast
		if (status === 401 && !ogRequest._retry) {
			ogRequest._retry = true;
			if (ogRequest.url?.includes("/auth/refresh")) {
				store.dispatch(resetUser());
				navigateGlobal("/auth");
				return Promise.reject(error);
			}

			try {
				const refreshedUser = await refreshAccessToken();
				console.log(refreshedUser);
				if (!refreshedUser) {
					console.error("failed to refresh access token");
					store.dispatch(resetUser());
					toast.error("session expired, please login again", {
						toasterId: "global",
					});
					navigateGlobal("/auth");
				}
				store.dispatch(setUser({ ...refreshedUser, isAuthenticated: true }));
				return apiClient(ogRequest);
			} catch (refreshError) {
				store.dispatch(resetUser());
				navigateGlobal("/auth");
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject({
			status: error.response?.status,
			message: error.response?.data?.message ?? "Request failed",
		});
	},
);

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			staleTime: 5 * 60 * 1000,
		},

		mutations: {
			onError: (error) => {
				console.error(`nStream:: Query Error:: ${error.message}`);
			},
		},
	},
});
