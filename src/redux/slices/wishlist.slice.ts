/**
 * Wishlist Slice
 * Manages wishlist state
 */

import { createAppSlice } from '../createAppSlice';

interface WishlistSliceState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistSliceState = {
  items: [],
  loading: false,
  error: null,
};

export const wishlistSlice = createAppSlice({
  name: 'wishlist',
  initialState,
  reducers: (create) => ({
    // ==================== ADD TO WISHLIST ====================
    addToWishlist: create.reducer((state, action: { payload: Product }) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    }),

    // ==================== REMOVE FROM WISHLIST ====================
    removeFromWishlist: create.reducer((state, action: { payload: string }) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }),

    // ==================== CLEAR WISHLIST ====================
    clearWishlist: create.reducer((state) => {
      state.items = [];
    }),

    // ==================== TOGGLE WISHLIST ====================
    toggleWishlist: create.reducer((state, action: { payload: Product }) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    }),
  }),
});

// Export actions
export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
} = wishlistSlice.actions;

// Export selectors
export const selectWishlistItems = (state: { wishlist: WishlistSliceState }) => state.wishlist.items;
export const selectWishlistItemCount = (state: { wishlist: WishlistSliceState }) => state.wishlist.items.length;
export const selectIsInWishlist = (productId: string) => (state: { wishlist: WishlistSliceState }) =>
  state.wishlist.items.some(item => item.id === productId);

export default wishlistSlice.reducer;

