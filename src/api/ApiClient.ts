import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { refreshAccessToken } from "@/utils";
import { setUser } from "@/contexts/auth/authSlice";
import { store } from "@/ContextStore";

export const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 10000,
  withCredentials:true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.status === 493) {
      refreshAccessToken()
        .then((val) => {
          console.log("refreshed user", val);
          store.dispatch(setUser(val));
        })
        .catch((err) => console.log(err));
        
    }
    console.log(error.message);
    console.log("running axios interceptors");
    return Promise.reject(error?.message);
  }
);

export const queryClient = new QueryClient({
  defaultOptions: {
    
    queries: {

      retry: false,
      staleTime: 5 * 60 * 1000,
      
    },
    
    mutations: {
      onError: (error) => {
        console.log(error.message);
      },
    },
  },
});
