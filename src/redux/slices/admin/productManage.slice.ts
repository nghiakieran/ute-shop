import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createAppSlice } from '../../createAppSlice';
interface ProductsAdmin {
  id: number;
  productName: string;
  slug: string;
  description: string;

  displayStatus: boolean;
  productStatus: string;
  quantityStock: number;

  originalPrice: number;
  unitPrice: number;
  discountDetail: any;

  ratingAvg: number;
  views: number;

  brand: any;
  category: any;
  images: any[];

  // Timestamp (Thêm nếu cần)
  createdAt?: string;
  updatedAt?: string;

  configurations?: any[];
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductSliceState {
  products: ProductsAdmin[];
}

interface ProductSliceState {
  products: ProductsAdmin[];
  meta: PaginationMeta | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: any;
}

const initialState: ProductSliceState = {
  products: [],
  meta: null,
  loading: 'idle',
  error: null,
};

interface FetchProductsParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

export const fetchAdminProducts = createAsyncThunk<ApiResponse, FetchProductsParams>(
  'adminProducts/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const baseUrl = 'http://localhost:3009/ute-shop/api/admin/products';
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get(url);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Lỗi kết nối mạng');
    }
  }
);

export const adminProductSlice = createAppSlice({
  name: 'adminProducts',
  initialState,
  reducers: (create) => ({
    fetchProducts: create.asyncThunk(fetchAdminProducts, {
      pending: (state) => {
        state.loading = 'pending';
        state.error = null;
      },
      fulfilled: (state, action) => {
        state.loading = 'succeeded';

        state.products = action.payload.data;
        state.meta = action.payload.meta;
      },
      rejected: (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || action.error.message;
        state.products = [];
        state.meta = null;
      },
    }),
  }),
});

export const adminProductReducer = adminProductSlice.reducer;
