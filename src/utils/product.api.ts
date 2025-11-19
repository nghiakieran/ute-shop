import { apiClient } from '@/utils/api.utils';

export const getNewestProducts = async () => {
  const response = await apiClient.get('/home/newest');
  return response.data.data;
};

export const getBestSellingProducts = async () => {
  const response = await apiClient.get('/home/best-selling');
  return response.data.data;
};

export const getMostViewedProducts = async () => {
  const response = await apiClient.get('/home/most-viewed');
  return response.data.data;
};

export const getTopDiscountProducts = async () => {
  const response = await apiClient.get('/home/top-discount');
  return response.data.data;
};

export const getHomeProducts = async () => {
  const response = await apiClient.get('/home/products');
  return response.data.data;
};
