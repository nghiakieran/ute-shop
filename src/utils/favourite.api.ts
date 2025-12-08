import { apiClient } from '@/utils/api.utils';

export interface Favourite {
  id: number;
  product: any;
  createdAt: string;
}

export interface FavouritesResponse {
  total: number;
  items: Favourite[];
  page?: number;
  limit?: number;
  totalPages?: number;
}

export const getFavourites = async (
  page: number = 1,
  limit: number = 12
): Promise<FavouritesResponse> => {
  const response = await apiClient.get<any>(
    `/ute-shop/api/client/favourites?page=${page}&limit=${limit}`
  );
  // Backend returns: { data: { data: [...], meta: {...} }, message, status }
  return {
    items: response.data.data.data,
    total: response.data.data.meta.total,
    page: response.data.data.meta.page,
    limit: response.data.data.meta.limit,
    totalPages: response.data.data.meta.totalPages,
  };
};

export const addFavourite = async (productId: number) => {
  const response = await apiClient.post(`/ute-shop/api/client/favourites/${productId}`);
  return response.data.data;
};

export const removeFavourite = async (productId: number) => {
  const response = await apiClient.delete(`/ute-shop/api/client/favourites/${productId}`);
  return response.data.data;
};

export const isFavourite = async (
  productId: number
): Promise<{ productId: number; isFavourite: boolean }> => {
  const response = await apiClient.get(`/ute-shop/api/client/favourites/check/${productId}`);
  return response.data.data;
};

export const toggleFavourite = async (productId: number) => {
  const response = await apiClient.post(`/ute-shop/api/client/favourites/toggle/${productId}`);
  return response.data;
};
