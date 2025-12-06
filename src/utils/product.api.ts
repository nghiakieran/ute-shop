import { apiClient } from '@/utils/api.utils';

export const getNewestProducts = async () => {
  const response = await apiClient.get('/ute-shop/api/client/home/newest');
  return response.data.data;
};

export const getBestSellingProducts = async () => {
  const response = await apiClient.get('/ute-shop/api/client/home/best-selling');
  return response.data.data;
};

export const getMostViewedProducts = async () => {
  const response = await apiClient.get('/ute-shop/api/client/home/most-viewed');
  return response.data.data;
};

export const getTopDiscountProducts = async () => {
  const response = await apiClient.get('/ute-shop/api/client/home/top-discount');
  return response.data.data;
};

export const getHomeProducts = async () => {
  const response = await apiClient.get('/ute-shop/api/client/home/products');
  return response.data.data;
};

export interface FilterProductParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'views' | 'rating';
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedProductResponse {
  data: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const filterProducts = async (params: FilterProductParams) => {
  const response = await apiClient.get('/ute-shop/api/client/home/products/filter', {
    params,
  });
  return response.data.data as PaginatedProductResponse;
};

export const getProductDetail = async (slug: string) => {
  const response = await apiClient.get(`/ute-shop/api/client/home/products/${slug}`);
  return response.data.data;
};
