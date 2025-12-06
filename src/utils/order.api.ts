import { apiClient } from '@/utils/api.utils';
import { API_ENDPOINTS } from '@/constants';
import type { CheckoutData, CreateOrderPayload, OrderResponse } from '@/types/order';

interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'SHIPPING' | 'PAID' | 'CANCELLED';
  search?: string;
}

interface GetOrdersResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getOrders = async (params?: GetOrdersParams) => {
  const response = await apiClient.get<GetOrdersResponse>('/ute-shop/api/client/bills/orders', {
    params,
  });
  return response.data;
};

export const getCheckoutData = async (): Promise<CheckoutData> => {
  const response = await apiClient.get<CheckoutData>(API_ENDPOINTS.GET_CHECKOUT);
  return response.data.data;
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const response = await apiClient.post(API_ENDPOINTS.CREATE_ORDER, payload);
  return response.data;
};

export const cancelOrder = async (billId: number) => {
  const response = await apiClient.post(`/ute-shop/api/client/bills/${billId}/cancel`);
  return response.data;
};

export const retryPayment = async (billCode: string) => {
  const response = await apiClient.post(`/ute-shop/api/client/bills/${billCode}/recreate-payment`);
  return response.data;
};
