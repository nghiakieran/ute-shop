import { apiClient } from './api.utils';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'user';
  createdAt: string;
  updatedAt: string;
}

// API Response structure
interface ApiUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

// Transformed response for components
export interface PaginatedUsersResponse {
  data: AdminUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface SearchUsersResponse {
  data: AdminUser[];
}

export const getAllUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedUsersResponse> => {
  try {
    const response = await apiClient.get<ApiUsersResponse>(
      `ute-shop/api/admin/users?page=${page}&limit=${limit}`
    );

    const apiData = response.data.data;
    return {
      data: apiData.data,
      pagination: {
        currentPage: apiData.page,
        totalPages: Math.ceil(apiData.total / apiData.limit),
        totalItems: apiData.total,
        itemsPerPage: apiData.limit,
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const searchUsers = async (keyword: string): Promise<SearchUsersResponse> => {
  try {
    const response = await apiClient.get<AdminUser[]>(
      `/ute-shop/api/admin/users/search?keyword=${encodeURIComponent(keyword)}`
    );

    return {
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};
