/**
 * Cart Slice
 * Manages shopping cart state with real API integration
 */

import { createAppSlice } from '../createAppSlice';
import { apiClient } from '@/utils/api.utils';
import { API_ENDPOINTS } from '@/constants';

interface CartSliceState {
  id: number;
  items: Array<{
    id: number;
    quantity: number;
    product: {
      id: number;
      productName: string;
      slug: string;
      unitPrice: number;
      quantityStock: number;
      images: Array<{ id: number; url: string }>;
      discountDetail?: {
        percentage: number;
      };
    };
    itemTotal: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartSliceState = {
  id: 0,
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

export const cartSlice = createAppSlice({
  name: 'cart',
  initialState,
  reducers: (create) => ({
    // ==================== GET CART ====================
    getCart: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await apiClient.get(API_ENDPOINTS.GET_CART);
          return response.data.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch cart');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          Object.assign(state, action.payload);
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== ADD TO CART ====================
    addToCart: create.asyncThunk(
      async (
        payload: { productId: number; quantity: number },
        { rejectWithValue }
      ) => {
        try {
          const response = await apiClient.post(API_ENDPOINTS.ADD_TO_CART, payload);
          return response.data.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to add to cart');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          Object.assign(state, action.payload);
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== UPDATE QUANTITY ====================
    updateQuantity: create.asyncThunk(
      async (
        payload: { cartItemId: number; quantity: number },
        { rejectWithValue }
      ) => {
        try {
          const endpoint = API_ENDPOINTS.UPDATE_CART_ITEM.replace(
            ':cartItemId',
            String(payload.cartItemId)
          );
          const response = await apiClient.patch(endpoint, {
            quantity: payload.quantity,
          });
          return response.data.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to update quantity');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          Object.assign(state, action.payload);
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== REMOVE FROM CART ====================
    removeFromCart: create.asyncThunk(
      async (cartItemId: number, { rejectWithValue }) => {
        try {
          const endpoint = API_ENDPOINTS.REMOVE_CART_ITEM.replace(
            ':cartItemId',
            String(cartItemId)
          );
          const response = await apiClient.delete(endpoint);
          return response.data.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to remove item');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          Object.assign(state, action.payload);
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== CLEAR CART ====================
    clearCart: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await apiClient.delete(API_ENDPOINTS.CLEAR_CART);
          return response.data.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to clear cart');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          Object.assign(state, action.payload);
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== RESET ERROR ====================
    resetError: create.reducer((state) => {
      state.error = null;
    }),
  }),
});

// Export actions
export const {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  resetError,
} = cartSlice.actions;

// Export selectors
export const selectCart = (state: { cart: CartSliceState }) => state.cart;
export const selectCartItems = (state: { cart: CartSliceState }) => state.cart.items;
export const selectCartSubtotal = (state: { cart: CartSliceState }) => state.cart.subtotal;
export const selectCartShipping = (state: { cart: CartSliceState }) => state.cart.shipping;
export const selectCartTax = (state: { cart: CartSliceState }) => state.cart.tax;
export const selectCartTotal = (state: { cart: CartSliceState }) => state.cart.total;
export const selectCartItemCount = (state: { cart: CartSliceState }) => state.cart.itemCount;
export const selectCartLoading = (state: { cart: CartSliceState }) => state.cart.loading;
export const selectCartError = (state: { cart: CartSliceState }) => state.cart.error;

export default cartSlice.reducer;
