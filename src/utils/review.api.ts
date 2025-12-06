/**
 * Review API Utils
 */

import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import { storageUtils } from './storage.utils';
import type {
  CreateReviewRequest,
  CreateReviewResponse,
  GetProductReviewsResponse,
  GetMyVouchersResponse,
  GetMyPointsResponse,
} from '@/types/review';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = storageUtils.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Submit a review for a product
 */
export const submitReview = async (data: CreateReviewRequest): Promise<CreateReviewResponse> => {
  const response = await api.post<CreateReviewResponse>(API_ENDPOINTS.SUBMIT_REVIEW, data);
  return response.data;
};

/**
 * Get reviews for a specific product
 */
export const getProductReviews = async (productId: number): Promise<GetProductReviewsResponse> => {
  const url = API_ENDPOINTS.GET_PRODUCT_REVIEWS.replace(':productId', productId.toString());
  const response = await api.get<{ data: any[]; message: string; status: number }>(url);

  // Transform API response to match expected format
  return {
    reviews: response.data.data.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      description: review.description,
      createdAt: review.createdAt,
      user: {
        username: review.customerName || 'Anonymous',
      },
    })) as any[],
    stats: {
      totalReviews: response.data.data.length,
      averageRating:
        response.data.data.length > 0
          ? response.data.data.reduce((sum: number, r: any) => sum + r.rating, 0) /
            response.data.data.length
          : 0,
      ratingDistribution: {
        5: response.data.data.filter((r: any) => r.rating === 5).length,
        4: response.data.data.filter((r: any) => r.rating === 4).length,
        3: response.data.data.filter((r: any) => r.rating === 3).length,
        2: response.data.data.filter((r: any) => r.rating === 2).length,
        1: response.data.data.filter((r: any) => r.rating === 1).length,
      },
    },
  };
};

/**
 * Get current user's vouchers
 */
export const getMyVouchers = async (): Promise<GetMyVouchersResponse> => {
  const response = await api.get<GetMyVouchersResponse>(API_ENDPOINTS.GET_MY_VOUCHERS);
  return response.data;
};

/**
 * Get current user's loyalty points and transaction history
 */
export const getMyPoints = async (): Promise<GetMyPointsResponse> => {
  const response = await api.get<GetMyPointsResponse>(API_ENDPOINTS.GET_MY_POINTS);
  return response.data;
};
