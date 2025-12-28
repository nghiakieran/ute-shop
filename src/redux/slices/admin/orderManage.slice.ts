import { createAppSlice } from '../../createAppSlice';
import { getAdminOrders, updateOrderStatus } from '@/utils/order.api';
import type { AdminBill } from '@/types/order';

interface OrderManageState {
  orders: AdminBill[];
  loading: boolean;
  updateLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: OrderManageState = {
  orders: [],
  loading: false,
  updateLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

export const adminOrderSlice = createAppSlice({
  name: 'adminOrder',
  initialState,
  reducers: (create) => ({
    fetchAdminOrders: create.asyncThunk(
      async (params: { page?: number; limit?: number; search?: string; status?: string } = {}, { rejectWithValue }) => {
        try {
          const response = await getAdminOrders(params);
          return response;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Lỗi khi tải danh sách đơn hàng');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.orders = Array.isArray(action.payload.data) ? action.payload.data : [];
          state.pagination = {
            total: action.payload.data?.total ?? 0,
            page: action.payload.data?.page ?? 1,
            limit: action.payload.data?.limit ?? 10,
            totalPages: action.payload.data?.totalPages ?? 0,
          };
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    updateAdminOrderStatus: create.asyncThunk(
      async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
        try {
          const updatedOrder = await updateOrderStatus(id, status);
          return updatedOrder;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Lỗi khi cập nhật trạng thái');
        }
      },
      {
        pending: (state) => {
          state.updateLoading = true;
        },
        fulfilled: (state, action) => {
          state.updateLoading = false;
          const index = state.orders.findIndex((o) => o.id === action.payload.data?.id);
          if (index !== -1 && action.payload.data) {
            state.orders[index] = action.payload.data;
          }
        },
        rejected: (state, action) => {
          state.updateLoading = false;
        },
      }
    ),
  }),
});

export const { fetchAdminOrders, updateAdminOrderStatus } = adminOrderSlice.actions;

export const selectAdminOrders = (state: { orderManage: OrderManageState }) => state.orderManage.orders;
export const selectAdminOrderLoading = (state: { orderManage: OrderManageState }) => state.orderManage.loading;
export const selectAdminOrderPagination = (state: { orderManage: OrderManageState }) => state.orderManage.pagination;

export const adminOrderReducer = adminOrderSlice.reducer;
