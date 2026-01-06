import { apiClient } from '@/utils/api.utils';
import type {
  Voucher,
  CreateVoucherPayload,
  UpdateVoucherPayload,
  VoucherFilterParams,
  VoucherStatistics,
  VoucherStatisticsResponse,
  GetVouchersResponse,
} from '@/types/voucher';

const VOUCHER_ENDPOINTS = {
  CREATE: '/ute-shop/api/admin/vouchers',
  GET_ALL: '/ute-shop/api/admin/vouchers',
  GET_STATISTICS: '/ute-shop/api/admin/vouchers/statistics',
  GET_BY_ID: (id: number) => `/ute-shop/api/admin/vouchers/${id}`,
  UPDATE: (id: number) => `/ute-shop/api/admin/vouchers/${id}`,
  DELETE: (id: number) => `/ute-shop/api/admin/vouchers/${id}`,
  UPDATE_STATUS: (id: number) => `/ute-shop/api/admin/vouchers/${id}/status`,
  UPDATE_EXPIRED: '/ute-shop/api/admin/vouchers/update-expired',
};

export const createVoucher = async (payload: CreateVoucherPayload) => {
  const response = await apiClient.post<Voucher>(VOUCHER_ENDPOINTS.CREATE, payload);
  return response.data;
};

export const getVouchers = async (params?: VoucherFilterParams) => {
  const response = await apiClient.get<GetVouchersResponse>(VOUCHER_ENDPOINTS.GET_ALL, {
    params,
  });
  return response.data;
};

export const getVoucherStatistics = async () => {
  const response = await apiClient.get<VoucherStatisticsResponse>(VOUCHER_ENDPOINTS.GET_STATISTICS);
  return response.data;
};

export const getVoucherById = async (id: number) => {
  const response = await apiClient.get<Voucher>(VOUCHER_ENDPOINTS.GET_BY_ID(id));
  return response.data;
};

export const updateVoucher = async (payload: UpdateVoucherPayload) => {
  const response = await apiClient.put<Voucher>(VOUCHER_ENDPOINTS.UPDATE(payload.id), payload);
  return response.data;
};

export const deleteVoucher = async (id: number) => {
  const response = await apiClient.delete(VOUCHER_ENDPOINTS.DELETE(id));
  return response.data;
};

export const updateVoucherStatus = async (id: number, status: string) => {
  const response = await apiClient.patch<Voucher>(VOUCHER_ENDPOINTS.UPDATE_STATUS(id), {
    status,
  });
  return response.data;
};

export const updateExpiredVouchers = async () => {
  const response = await apiClient.post(VOUCHER_ENDPOINTS.UPDATE_EXPIRED);
  return response.data;
};
