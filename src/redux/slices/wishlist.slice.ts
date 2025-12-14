/**
 * Wishlist Slice
 * Manages wishlist/favourites state with real API integration
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';
import { getFavourites, addFavourite, removeFavourite, toggleFavourite } from '@/utils';

interface WishlistSliceState {
  items: any[];
  loading: boolean;
  error: string | null;
  favouriteIds: number[];
}

const initialState: WishlistSliceState = {
  items: [],
  loading: false,
  error: null,
  favouriteIds: [],
};

// ==================== ASYNC THUNKS ====================

export const fetchFavourites = createAsyncThunk(
  'wishlist/fetchFavourites',
  async ({ page = 1, limit = 12 }: { page?: number; limit?: number } = {}) => {
    const response = await getFavourites(page, limit);
    return response;
  }
);

export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: number) => {
    await addFavourite(productId);
    return productId;
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: number) => {
    await removeFavourite(productId);
    return productId;
  }
);

export const toggleWishlistAsync = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId: number) => {
    const response = await toggleFavourite(productId);
    return { productId, isFavourite: response.isFavourite };
  }
);

// ==================== SLICE ====================

export const wishlistSlice = createAppSlice({
  name: 'wishlist',
  initialState,
  reducers: (create) => ({
    clearWishlist: create.reducer((state) => {
      state.items = [];
      state.favouriteIds = [];
    }),
  }),
  extraReducers: (builder) => {
    builder
      // Fetch favourites
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items?.map((item: any) => item.product) || [];
        state.favouriteIds = action.payload.items?.map((item: any) => item.product.id) || [];
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch favourites';
      })
      // Add to wishlist
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        if (!state.favouriteIds.includes(action.payload)) {
          state.favouriteIds.push(action.payload);
        }
      })
      // Remove from wishlist
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.favouriteIds = state.favouriteIds.filter((id) => id !== action.payload);
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      // Toggle wishlist
      .addCase(toggleWishlistAsync.fulfilled, (state, action) => {
        if (action.payload.isFavourite) {
          if (!state.favouriteIds.includes(action.payload.productId)) {
            state.favouriteIds.push(action.payload.productId);
          }
        } else {
          state.favouriteIds = state.favouriteIds.filter((id) => id !== action.payload.productId);
          state.items = state.items.filter((item) => item.id !== action.payload.productId);
        }
      });
  },
});

// Export actions
export const { clearWishlist } = wishlistSlice.actions;

// Export selectors
export const selectWishlistItems = (state: { wishlist: WishlistSliceState }) =>
  state.wishlist.items;
export const selectWishlistItemCount = (state: { wishlist: WishlistSliceState }) =>
  state.wishlist.items.length;
export const selectIsInWishlist =
  (productId: number) => (state: { wishlist: WishlistSliceState }) =>
    state.wishlist.favouriteIds.includes(productId);
export const selectWishlistLoading = (state: { wishlist: WishlistSliceState }) =>
  state.wishlist.loading;

export default wishlistSlice.reducer;
