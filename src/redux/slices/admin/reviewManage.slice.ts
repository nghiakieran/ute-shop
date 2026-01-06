import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAppSlice } from '../../createAppSlice';
import { apiClient } from '@/utils/api.utils';
import type { Review } from '@/types/review.d';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AdminReviewSliceState {
  reviews: Review[];
  meta: PaginationMeta | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: any;
}

const initialState: AdminReviewSliceState = {
  reviews: [],
  meta: null,
  loading: 'idle',
  error: null,
};

interface FetchAdminReviewsParams {
  page?: number;
  limit?: number;
  rating?: number;
  hasRewardGiven?: boolean;
  search?: string;
}

interface FetchAdminReviewsResponse {
  data: Review[];
  meta: PaginationMeta;
}

interface DeleteAdminReviewResponse {
  review?: { id: number };
  id?: number;
}

export const fetchAdminReviews = createAsyncThunk<FetchAdminReviewsResponse, FetchAdminReviewsParams>(
  'adminReviews/fetchAdminReviews',
  async (params, { rejectWithValue }) => {
    try {
      const baseUrl = '/ute-shop/api/admin/reviews';
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

      const response = await apiClient.get(url);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Lỗi kết nối mạng');
    }
  }
);

export const deleteAdminReview = createAsyncThunk<DeleteAdminReviewResponse, number>(
  'adminReviews/deleteAdminReview',
  async (id, { rejectWithValue }) => {
    try {
      const url = `/ute-shop/api/admin/reviews/${id}`;
      const response = await apiClient.delete(url);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Lỗi kết nối mạng');
    }
  }
);

export const adminReviewSlice = createAppSlice({
  name: 'adminReviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch admin reviews
    builder
      .addCase(fetchAdminReviews.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.reviews = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchAdminReviews.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || action.error.message;
        state.reviews = [];
        state.meta = null;
      });

    // Delete admin review
    builder
      .addCase(deleteAdminReview.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(deleteAdminReview.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const deletedId = action.payload.review?.id ?? action.payload.id;
        if (deletedId) {
          state.reviews = state.reviews.filter((r) => r.id !== deletedId);
        }
      })
      .addCase(deleteAdminReview.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const adminReviewReducer = adminReviewSlice.reducer;





