import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { authHeaderClient } from "./auth-cookies";
import { API_URL } from "./env";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const authHeaders = authHeaderClient();
    if (authHeaders.Authorization) {
      config.headers.Authorization = authHeaders.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 unauthorized - clear auth and redirect
    // if (error.response?.status === 401) {
    //   clearAuthClient();
    //   window.location.href = "/sign-in";
    //   return Promise.reject(error);
    // }

    // Don't show toast for network errors in server components
    if (typeof window !== "undefined") {
      handleApiError(error);
    }

    return Promise.reject(error);
  }
);

// Common error handling function
export function handleApiError(error: unknown): void {
  if (typeof window === "undefined") return;

  let message = "An unexpected error occurred";

  if (axios.isAxiosError(error)) {
    // Handle different types of axios errors
    if (error.response?.data) {
      // Backend returned an error response
      const data = error.response.data;

      if (typeof data === "string") {
        message = data;
      } else if (data.message) {
        message = data.message;
      } else if (data.error) {
        message = data.error;
      } else if (Array.isArray(data.errors)) {
        message = data.errors.join(", ");
      }
    } else if (error.request) {
      // Network error
      message = "Network error. Please check your connection.";
    } else {
      // Other axios error
      message = error.message || "Request failed";
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  toast.error(message);
}

// Utility function for API calls with automatic error handling
export async function apiCall<T>(
  apiFunction: () => Promise<AxiosResponse<T>>
): Promise<T> {
  try {
    const response = await apiFunction();
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Export common HTTP methods with error handling
export const api = {
  get: <T>(url: string, config?: object) =>
    apiCall<T>(() => apiClient.get<T>(url, config)),
  post: <T>(url: string, data?: unknown, config?: object) =>
    apiCall<T>(() => apiClient.post<T>(url, data, config)),
  put: <T>(url: string, data?: unknown, config?: object) =>
    apiCall<T>(() => apiClient.put<T>(url, data, config)),
  patch: <T>(url: string, data?: unknown, config?: object) =>
    apiCall<T>(() => apiClient.patch<T>(url, data, config)),
  delete: <T>(url: string, config?: object) =>
    apiCall<T>(() => apiClient.delete<T>(url, config)),
};
