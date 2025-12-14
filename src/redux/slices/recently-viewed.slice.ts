/**
 * Recently Viewed Slice
 * Manages recently viewed products state
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';
import { getRecentlyViewed, trackProductView } from '@/utils';

interface RecentlyViewedSliceState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: RecentlyViewedSliceState = {
  items: [],
  loading: false,
  error: null,
};

// ==================== ASYNC THUNKS ====================

export const fetchRecentlyViewed = createAsyncThunk(
  'recentlyViewed/fetchRecentlyViewed',
  async (limit: number = 10) => {
    const response = await getRecentlyViewed(limit);
    return response;
  }
);

export const trackView = createAsyncThunk('recentlyViewed/trackView', async (productId: number) => {
  await trackProductView(productId);
  return productId;
});

// ==================== SLICE ====================

export const recentlyViewedSlice = createAppSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: (create) => ({
    clearRecentlyViewed: create.reducer((state) => {
      state.items = [];
    }),
  }),
  extraReducers: (builder) => {
    builder
      // Fetch recently viewed
      .addCase(fetchRecentlyViewed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentlyViewed.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecentlyViewed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recently viewed products';
      })
      // Track view
      .addCase(trackView.pending, (state) => {
        // Optional: could add loading state for tracking
      })
      .addCase(trackView.fulfilled, (state, action) => {
        // View tracked successfully
      })
      .addCase(trackView.rejected, (state, action) => {
        // Silent fail for tracking - don't disrupt user experience
        console.error('Failed to track view:', action.error.message);
      });
  },
});

// Export actions
export const { clearRecentlyViewed } = recentlyViewedSlice.actions;

// Export selectors
export const selectRecentlyViewedItems = (state: { recentlyViewed: RecentlyViewedSliceState }) =>
  state.recentlyViewed.items;
export const selectRecentlyViewedLoading = (state: { recentlyViewed: RecentlyViewedSliceState }) =>
  state.recentlyViewed.loading;
export const selectRecentlyViewedError = (state: { recentlyViewed: RecentlyViewedSliceState }) =>
  state.recentlyViewed.error;

export default recentlyViewedSlice.reducer;
