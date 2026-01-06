export type VoucherType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FIXED';
export type VoucherStatus = 'ACTIVE' | 'EXPIRED' | 'USED' | 'INACTIVE';

export interface Voucher {
  id: number;
  code: string;
  type: VoucherType;
  value: number;
  maxDiscount?: number;
  minOrderValue?: number;
  expiryDate: string;
  description?: string;
  userId?: number;
  user?: {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    avatar?: string;
    role: string;
  };
  status: VoucherStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoucherPayload {
  code: string;
  type: VoucherType;
  value: number;
  maxDiscount?: number;
  minOrderValue?: number;
  expiryDate: string;
  description?: string;
  userId?: number;
}

export interface UpdateVoucherPayload {
  id: number;
  code?: string;
  type?: VoucherType;
  value?: number;
  maxDiscount?: number;
  minOrderValue?: number;
  expiryDate?: string;
  description?: string;
  userId?: number;
}

export interface VoucherFilterParams {
  status?: VoucherStatus;
  type?: VoucherType;
  userId?: number;
  page?: number;
  limit?: number;
}

export interface VoucherStatistics {
  total: number;
  active: number;
  expired: number;
  used: number;
  byType?: {
    percentage?: number;
    fixed?: number;
  };
}

export interface VoucherStatisticsResponse {
  data: {
    statistics: VoucherStatistics;
  };
  message: string;
  status: number;
}

export interface GetVouchersResponse {
  data: {
    vouchers: Voucher[];
    total: number;
    page: string;
    limit: string;
  };
  message: string;
  status: number;
}
