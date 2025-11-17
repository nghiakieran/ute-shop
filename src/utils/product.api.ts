import { apiClient } from '@/utils/api.utils';
function handleApiError(error: any, endpoint: any) {
  console.error(`Lỗi khi gọi API tại ${endpoint}:`, error.message || error);
}

export const getNewestProducts = async () => {
  const endpoint = '/home/newest';
  try {
    const response = await apiClient.get(endpoint);
    return response.data.data;
  } catch (error) {
    handleApiError(error, endpoint);
  }
};

export const getBestSellingProducts = async () => {
  const endpoint = '/home/best-selling';
  try {
    const response = await apiClient.get(endpoint);
    return response.data.data;
  } catch (error) {
    handleApiError(error, endpoint);
  }
};

export const getMostViewedProducts = async () => {
  const endpoint = '/home/most-viewed';
  try {
    const response = await apiClient.get(endpoint);
    return response.data.data;
  } catch (error) {
    handleApiError(error, endpoint);
  }
};

export const getTopDiscountProducts = async () => {
  const endpoint = '/home/top-discount';
  try {
    const response = await apiClient.get(endpoint);
    return response.data.data;
  } catch (error) {
    handleApiError(error, endpoint);
  }
};

export const getHomeProducts = async () => {
  const endpoint = '/home/products';
  try {
    const response = await apiClient.get(endpoint);
    return response.data.data;
  } catch (error) {
    handleApiError(error, endpoint);
  }
};
