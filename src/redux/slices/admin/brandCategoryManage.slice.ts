import { createAppSlice } from '@/redux/createAppSlice';
import { apiClient } from '@/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface Brand {
  id: number;
  brandName: string;
  quantityProduct: number;
  status: boolean;
}

interface Category {
  id: number;
  categoryName: string;
  quantityProduct: number;
  status: boolean;
}

interface BrandCategorySliceState {
  brands: Brand[];
  categories: Category[];
  brand: Brand | null;
  category: Category | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: any;
}

export interface CreateBrandRequest {
  brandName: string;
  brandId?: number;
  status?: boolean;
}

export interface CreateCategoryRequest {
  categoryName: string;
  categoryId?: number;
  status?: boolean;
}

const initialState: BrandCategorySliceState = {
  loading: 'idle',
  error: null,
  brands: [],
  categories: [],
  brand: null,
  category: null,
};

export const fetchBrands = createAsyncThunk<ApiResponse, any>(
  'adminBrandsCategories/fetchBrands',
  async (id, { rejectWithValue }) => {
    try {
      const url = `/ute-shop/api/admin/brands`;
      const response = await apiClient.get(url);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Lỗi kết nối mạng');
    }
  }
);

export const fetchCategories = createAsyncThunk<ApiResponse, any>(
  'adminBrandsCategories/fetchCategories',
  async (id, { rejectWithValue }) => {
    try {
      const url = `/ute-shop/api/admin/categories`;
      const response = await apiClient.get(url);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Lỗi kết nối mạng');
    }
  }
);

export const addBrand = createAsyncThunk<any, CreateBrandRequest>(
  'adminBrandsCategories/addBrand',
  async (payload, { rejectWithValue }) => {
    try {
      const url = `/ute-shop/api/admin/brands`;
      const response = await apiClient.post(url, payload);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Lỗi khi thêm thương hiệu');
    }
  }
);

export const addCategory = createAsyncThunk<any, CreateCategoryRequest>(
  'adminBrandsCategories/addCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const url = `/ute-shop/api/admin/categories`;
      const response = await apiClient.post(url, payload);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Lỗi khi thêm thương hiệu');
    }
  }
);

export const updateBrand = createAsyncThunk<any, CreateBrandRequest>(
  'adminBrandsCategories/updateBrand',
  async (payload, { rejectWithValue }) => {
    try {
      const url = `/ute-shop/api/admin/brands`;
      const response = await apiClient.put(url, payload);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Lỗi khi thêm thương hiệu');
    }
  }
);

export const updateCategory = createAsyncThunk<any, CreateCategoryRequest>(
  'adminBrandsCategories/updateCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const url = `/ute-shop/api/admin/categories`;
      const response = await apiClient.put(url, payload);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Lỗi khi thêm thương hiệu');
    }
  }
);
export const adminBrandsCategories = createAppSlice({
  name: 'adminBrandsCategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.brands = action.payload.brands || action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || action.error.message;
        state.brands = [];
      })

      .addCase(fetchCategories.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.categories = action.payload.categories || action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || action.error.message;
        state.categories = [];
      })

      .addCase(addBrand.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.loading = 'succeeded';
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || 'Không thể thêm thương hiệu';
      })
      .addCase(updateBrand.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = 'succeeded';
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || 'Không thể cập nhật thương hiệu';
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = 'succeeded';
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || 'Không thể thêm danh mục';
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = 'succeeded';
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || 'Không thể cập nhật danh mục';
      });
  },
});

export const adminBrandsCategorieseducer = adminBrandsCategories.reducer;
