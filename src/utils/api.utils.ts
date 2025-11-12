/**
 * API Utility Functions using Axios
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '@/constants';
import { storageUtils } from '@/utils/storage.utils';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = storageUtils.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized - only try refresh if we have a token and haven't retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = storageUtils.getRefreshToken();

          if (refreshToken) {
            try {
              // Try to refresh token
              const response = await this.post<{ accessToken: string }>('/auth/refresh', {
                refreshToken,
              });
              const accessToken =
                response.data.data?.accessToken || (response.data as any).accessToken;

              if (accessToken) {
                storageUtils.setAccessToken(accessToken);
              }

              // Retry original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              return this.client(originalRequest);
            } catch (refreshError) {
              // Refresh failed, clear tokens and redirect to login
              storageUtils.clearAuth();
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          } else {
            // No refresh token available, treat as authentication error
            storageUtils.clearAuth();
            return Promise.reject(this.handleError(error));
          }
        }

        // For all other errors, use error handler
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): Error {
    let message = 'Có lỗi xảy ra!';

    if (error.response) {
      // Server responded with error
      message = error.response.data?.message || 'Có lỗi xảy ra!';
    } else if (error.request) {
      // Request was made but no response
      message = 'Không thể kết nối đến máy chủ!';
    } else {
      // Something else happened
      message = error.message || 'Có lỗi xảy ra!';
    }

    const err = new Error(message);
    return err;
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.get(url, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.post(url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.put(url, data, config);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.patch(url, data, config);
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.delete(url, config);
  }
}

export const apiClient = new ApiClient();
