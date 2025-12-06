/**
 * Order Slice
 * Manages order history and order-related state
 */

import { createAppSlice } from '../createAppSlice';
import { getOrders } from '@/utils/order.api';
import type { Bill } from '@/types/order.d.ts';

interface OrderSliceState {
  orders: Bill[];
  currentOrder: Bill | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
}

const initialState: OrderSliceState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: null,
};

export const orderSlice = createAppSlice({
  name: 'order',
  initialState,
  reducers: (create) => ({
    // ==================== FETCH ORDERS ====================
    fetchOrders: create.asyncThunk(
      async (
        params: {
          page?: number;
          limit?: number;
          status?: 'PENDING' | 'SHIPPING' | 'PAID' | 'CANCELLED';
          search?: string;
        } = {},
        { rejectWithValue }
      ) => {
        try {
          const response = await getOrders(params);
          return response;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch orders');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.orders = action.payload.data;
          state.pagination = {
            total: action.payload.total,
            page: action.payload.page,
            limit: action.payload.limit,
            totalPages: action.payload.totalPages,
          };
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== FETCH ORDER BY ID ====================
    fetchOrderById: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          // TODO: Implement API call
          throw new Error('Not implemented');
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch order');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.currentOrder = action.payload;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          state.currentOrder = null;
        },
      }
    ),

    // ==================== CANCEL ORDER ====================
    cancelOrder: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          // TODO: Implement API call
          throw new Error('Not implemented');
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to cancel order');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          const index = state.orders.findIndex((o) => o.id === action.payload.id);
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
          if (state.currentOrder?.id === action.payload.id) {
            state.currentOrder = action.payload;
          }
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== CLEAR CURRENT ORDER ====================
    clearCurrentOrder: create.reducer((state) => {
      state.currentOrder = null;
    }),
  }),
});

// Export actions
export const { fetchOrders, fetchOrderById, cancelOrder, clearCurrentOrder } = orderSlice.actions;

// Export selectors
export const selectOrders = (state: { order: OrderSliceState }) => state.order.orders;
export const selectCurrentOrder = (state: { order: OrderSliceState }) => state.order.currentOrder;
export const selectOrderLoading = (state: { order: OrderSliceState }) => state.order.loading;
export const selectOrderError = (state: { order: OrderSliceState }) => state.order.error;
export const selectOrderPagination = (state: { order: OrderSliceState }) => state.order.pagination;

export default orderSlice.reducer;
