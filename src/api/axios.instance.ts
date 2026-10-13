import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import {
  clearAuthStorage,
  getSecureValue,
  StorageKeys,
} from "../storage/secure-storage";
import { ApiError } from "../types/error.types";
import { API_BASE_URL } from "./endpoints";

/** Called whenever the server returns 401 on a non-auth endpoint. */
async function handleSessionExpiry() {
  await clearAuthStorage();
  // Navigate to login screen; replace so the user can't go "back"
  router.replace("/(auth)/login");
}


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor - attach Bearer token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getSecureValue(StorageKeys.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Token retrieval failed, proceed without token
      // if (__DEV__) {
      //   console.warn("Failed to retrieve auth token:", error);
      // }
    }

    // Dev logging
    // if (__DEV__) {
    //   console.log(
    //     `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
    //   );
    // }

    return config;
  },
  (error: AxiosError) => {
    // if (__DEV__) {
    //   console.error("[API Request Error]", error);
    // }
    return Promise.reject(error);
  },
);

// Response interceptor - error handling
axiosInstance.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      // console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (__DEV__) {
      // console.error("[API Response Error]", {
      //   url: error.config?.url,
      //   status: error.response?.status,
      //   data: error.response?.data,
      // });
    }

    // Handle 401 Unauthorized - session expired
    if (error.response?.status === 401) {
      // Don't handle 401 for login/register endpoints (these are expected auth failures)
      const isAuthEndpoint =
        error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/register");

      if (!isAuthEndpoint) {
        handleSessionExpiry();
      }
    }

    // Extract error message from response
    // Prioritize 'error' field from backend as it contains the human-readable message
    const errorMessage =
    error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    const apiError: ApiError = {
      message: errorMessage,
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error,
      details: error.response?.data?.details,
      phone: error.response?.data?.phone,
      code: error.response?.data?.code,
    };

    return Promise.reject(apiError);
  },
);

export default axiosInstance;
