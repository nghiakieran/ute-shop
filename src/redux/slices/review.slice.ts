/**
 * Review Redux Slice
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { createAppSlice } from '../createAppSlice';
import {
  submitReview as submitReviewApi,
  getProductReviews as getProductReviewsApi,
  getMyVouchers as getMyVouchersApi,
  getMyPoints as getMyPointsApi,
} from '@/utils/review.api';
import type {
  Review,
  CreateReviewRequest,
  CreateReviewResponse,
  Voucher,
  LoyaltyPointTransaction,
} from '@/types/review';

interface ReviewState {
  reviews: Review[];
  reviewStats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  } | null;
  vouchers: Voucher[];
  loyaltyPoints: {
    totalPoints: number;
    transactions: LoyaltyPointTransaction[];
  } | null;
  loading: boolean;
  error: string | null;
  lastReward: CreateReviewResponse['reward'] | null;
}

const initialState: ReviewState = {
  reviews: [],
  reviewStats: null,
  vouchers: [],
  loyaltyPoints: null,
  loading: false,
  error: null,
  lastReward: null,
};

// Async thunks
export const submitReview = createAsyncThunk(
  'review/submitReview',
  async (data: CreateReviewRequest, { rejectWithValue }) => {
    try {
      const response = await submitReviewApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);

export const fetchProductReviews = createAsyncThunk(
  'review/fetchProductReviews',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await getProductReviewsApi(productId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const fetchMyVouchers = createAsyncThunk(
  'review/fetchMyVouchers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyVouchersApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vouchers');
    }
  }
);

export const fetchMyPoints = createAsyncThunk(
  'review/fetchMyPoints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyPointsApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch loyalty points');
    }
  }
);

// Slice
export const reviewSlice = createAppSlice({
  name: 'review',
  initialState,
  reducers: {
    clearLastReward: (state) => {
      state.lastReward = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Submit review
    builder
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.loading = false;
        state.lastReward = action.payload.reward;
        // Add the new review to the list if it's for the current product
        state.reviews.unshift(action.payload.review);
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch product reviews
    builder
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.reviewStats = action.payload.stats;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch my vouchers
    builder
      .addCase(fetchMyVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload.vouchers;
      })
      .addCase(fetchMyVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch my points
    builder
      .addCase(fetchMyPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.loyaltyPoints = {
          totalPoints: action.payload.totalPoints,
          transactions: action.payload.transactions,
        };
      })
      .addCase(fetchMyPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearLastReward, clearError } = reviewSlice.actions;

// Selectors
export const selectReviews = (state: RootState) => state.review.reviews;
export const selectReviewStats = (state: RootState) => state.review.reviewStats;
export const selectVouchers = (state: RootState) => state.review.vouchers;
export const selectLoyaltyPoints = (state: RootState) => state.review.loyaltyPoints;
export const selectReviewLoading = (state: RootState) => state.review.loading;
export const selectReviewError = (state: RootState) => state.review.error;
export const selectLastReward = (state: RootState) => state.review.lastReward;

export default reviewSlice.reducer;
