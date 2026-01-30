/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { apiClient } from "./api/ApiClient";

/**
 * Handles an API response and extracts data if successful.
 * on status code 493 (access token expired) it make an request to refresh the token and keeps the user logged.
 * then viva retrys the request can be compeleted later.
 *
 * @template T - The type of data contained in the response.
 * @param res - The Axios response containing an `ApiResponse<T>`.
 * @param errMessage - The error message to throw if the response is not successful.
 * @returns The extracted data (`T`) from the response.
 * @throws An error with `errMessage` if the response status is not 200.
 */
export const handleResponse = <T>(
  res: AxiosResponse<ApiResponse<T>>,
  errMessage: string,
  expectedStatusCode: number = 200,
  doesHaveData: boolean = true,
): T => {
  console.log("running resHandler");
  if (res.status === expectedStatusCode) {
    if (doesHaveData) {
      return res.data.data;
    }
    return {} as T;
  }
  throw new Error(res.data?.message || errMessage);
};
/**
 * refreshes access token by calling api.
 * @description refreshes the access token by calling the refresh endpoint on the backend.
 *
 * @returns Promise<IUser>
 */
export const refreshAccessToken = async (): Promise<IUser> => {
  try {
    const res = await apiClient.post<ApiResponse<IUser>>(
      "/auth/refresh-access-token",
      {},
      {
        withCredentials: true,
        headers: {
          Optional: "true", // assuming your backend checks this header
        },
      },
    );

    if (res.status === 200) {
      console.log("Token refreshed");
      return res.data.data;
    } else {
      console.log("Refresh token failed with non-200 status");
      navigateGlobal("/auth");
      throw new Error("Refresh failed");
    }
  } catch (error) {
    console.error("Refresh token request failed:", error);
    navigateGlobal("/auth");
    throw error; // propagate to caller
  }
};

/**
 * Converts a Cloudinary video URL to an HLS-compatible format.
 *
 * @param url - The Cloudinary video URL.
 * @returns The modified URL with `sp_auto` and `.m3u8` extension.
 */
export function convertToHLS(url: string): string {
  return url
    .replace(/\/v\d+\//, "/") // Remove versioning (e.g., /v1698765432/)
    .replace("/upload/", "/upload/sp_auto/") // Add `sp_auto` for adaptive streaming
    .replace(/\.[^.]+$/, ".m3u8"); // Change file extension to `.m3u8`
}

/**
 * Formats a given time (in seconds) into an HH:MM:SS string.
 *
 * @param time - The time in seconds.
 * @returns A formatted string representing time in HH:MM:SS.
 */
export const toHms = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  return (
    `${hours.toString().padStart(2, "0")}:` +
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`
  );
};

const K = 1000;
const MILLION = K * K;
const BILLION = MILLION * K;

/**
 * Converts a number into a human-readable format with numeric abbreviations.
 *
 * @param num - The number to convert.
 * @returns A string representation using abbreviations (`K` for thousands, `M` for millions, `B` for billions).
 *
 * @example
 * ```ts
 * toKBMS(1500);   // "1.5K"
 * toKBMS(2500000); // "2.5M"
 * toKBMS(5000000000); // "5B"
 * ```
 */
export const toKBMS = (num: number): string => {
  if (num >= K && num < MILLION) {
    return `${(num / K).toFixed(1)}K`; // Add `.toFixed(1)` for consistency
  }
  if (num >= MILLION && num < BILLION) {
    return `${(num / MILLION).toFixed(1)}M`;
  }
  if (num >= BILLION) {
    return `${(num / BILLION).toFixed(1)}B`;
  }
  return `${num}`;
};

export const generateSrcSet = (url: string): string => {
  const sizes = [360, 480, 720, 1080];

  return sizes
    .map(
      (w) =>
        url.replace("/upload/", `/upload/w_${w},f_auto,q_auto/`) + ` ${w}w`,
    )
    .join(", ");
};

export const getHomeUrl = () => "http:://localhost:5173";

let navigateFunction: (path: string) => void;

export const setNavigateGlobal = (navFn: (path: string) => void) => {
  navigateFunction = navFn;
};

export const navigateGlobal = (path: string) => {
  if (navigateFunction) navigateFunction(path);
  else console.error("Navigate function not initialized!");
};
export function appendFormData<T extends Record<string, any>>(
  formData: FormData,
  data: T,
): void {
  for (const key in data) {
    const value: any = data[key];
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(`${key}[]`, v));
    } else if ((value && value instanceof File) || typeof value === "string") {
      formData.append(key, value);
    }
  }
}

/**
 * Returns a human-readable relative time string like "5 minutes ago",
 * "2 days ago", "just now", etc., based on the input ISO date string.
 *
 * @param isoDateString - A valid ISO date string (e.g., "2025-03-24T12:10:50.435Z")
 * @returns A relative time string or "Invalid date" if input is not parseable
 */
export function getRelativeTime(isoDateString: string): string {
  const date = new Date(isoDateString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 5) return "Just now";

  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
    [Infinity, "year"],
  ];

  let value = diffInSeconds;

  for (const [threshold, label] of units) {
    if (value < threshold) {
      const rounded = Math.floor(value);
      return `${rounded} ${label}${rounded !== 1 ? "s" : ""} ago`;
    }
    value = value / threshold;
  }

  return "Some time ago";
}

export const allowedImageType = [
  "image/png",
  "image/jpg",
  "image/webp",
  "image/jepg",
];

export const allowedVideoType = [
  "video/mp4",
  "video/x-msvideo",
  "video/mpeg",
  "video/avi",
  "video/avi",
];
