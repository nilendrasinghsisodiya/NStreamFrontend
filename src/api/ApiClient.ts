import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { navigateGlobal, refreshAccessToken } from "@/utils";
import { setUser } from "@/contexts/auth/authSlice";
import { store } from "@/ContextStore";
import { toast } from "sonner";

export const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 10000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
(response) => response,
  async(error) => {
    console.log("running axios interceptors");
    if (error.status === 493) {
      console.log("refereshing user")
     try {
       const refreshedUser = await refreshAccessToken();
       console.log(refreshedUser);
       if(!refreshedUser){
         console.log("failed to refresh user");
         toast.error("unauthorized access, please login again");
         navigateGlobal("/auth");
       }else{
         console.log("user referesh successfull");
         store.dispatch(setUser(refreshedUser));
       }
     } catch (error:any) {
      console.log(error.message);
      
     }
        
    }
    console.log(error.message);
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
