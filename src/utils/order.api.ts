import { apiClient } from '@/utils/api.utils';

export const getOrders = async () => {
  const response = await apiClient.get('/bills/orders');
  return response.data.data;
};
