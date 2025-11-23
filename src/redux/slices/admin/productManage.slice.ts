import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utils/api.utils';
import { createAppSlice } from '../../createAppSlice';
import { ProductPayload } from '@/types/product';
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
  product: any;
  brands: any;
  categories: any;
}

const initialState: ProductSliceState = {
  products: [],
  meta: null,
  loading: 'idle',
  error: null,
  product: null,
  brands: [],
  categories: [],
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
      const baseUrl = '/ute-shop/api/admin/products';
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

      const response = await apiClient.get(url);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Lỗi kết nối mạng');
    }
  }
);

export const fetchProductDetailById = createAsyncThunk<ApiResponse, string>(
  'adminProducts/fetchProductDetailById',
  async (id, { rejectWithValue }) => {
    try {
      const url = `/ute-shop/api/admin/products/${id}`;
      const response = await apiClient.get(url);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Lỗi kết nối mạng');
    }
  }
);

export const fetchBrands = createAsyncThunk<ApiResponse, any>(
  'adminProducts/fetchBrands',
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
  'adminProducts/fetchCategories',
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

export const addProduct = createAsyncThunk<
  ApiResponse,
  { payload: ProductPayload; files?: File[] }
>('adminProducts/addProduct', async ({ payload, files }, { rejectWithValue }) => {
  try {
    const formData = buildProductFormData(0, payload, files);
    const response = await apiClient.post('/ute-shop/api/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || 'Lỗi kết nối mạng');
  }
});

export const updateProduct = createAsyncThunk<
  ApiResponse,
  { id: number; payload: ProductPayload; files?: File[] }
>('adminProducts/updateProduct', async ({ id, payload, files }, { rejectWithValue }) => {
  try {
    const formData = buildProductFormData(id, payload, files);
    const response = await apiClient.put(`/ute-shop/api/admin/products/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || 'Lỗi kết nối mạng');
  }
});

export const adminProductSlice = createAppSlice({
  name: 'adminProducts',
  initialState,
  reducers: (create) => ({
    resetProduct: create.reducer((state) => {
      state.product = null;
    }),
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
    fetchProductDetailById: create.asyncThunk(fetchProductDetailById, {
      pending: (state) => {
        state.loading = 'pending';
        state.error = null;
      },
      fulfilled: (state, action) => {
        state.loading = 'succeeded';
        state.product = action.payload.product;
      },
      rejected: (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || action.error.message;
        state.products = [];
        state.meta = null;
      },
    }),
    fetchBrands: create.asyncThunk(fetchBrands, {
      pending: (state) => {
        state.loading = 'pending';
        state.error = null;
      },
      fulfilled: (state, action) => {
        state.loading = 'succeeded';
        state.brands = action.payload.brands;
      },
      rejected: (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || action.error.message;
        state.brands = [];
      },
    }),
    fetchCategories: create.asyncThunk(fetchCategories, {
      pending: (state) => {
        state.loading = 'pending';
        state.error = null;
      },
      fulfilled: (state, action) => {
        state.loading = 'succeeded';
        state.categories = action.payload.categories;
      },
      rejected: (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || action.error.message;
        state.categories = [];
      },
    }),
    addProduct: create.asyncThunk(addProduct, {
      pending: (state) => {
        state.loading = 'pending';
        state.error = null;
      },
      fulfilled: (state, action) => {
        state.loading = 'succeeded';
        state.products.unshift(action.payload.product);
      },
      rejected: (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || action.error.message;
      },
    }),

    updateProduct: create.asyncThunk(updateProduct, {
      pending: (state) => {
        state.loading = 'pending';
        state.error = null;
      },
      fulfilled: (state, action) => {
        state.loading = 'succeeded';
        const updatedProduct = action.payload.product;
        const index = state.products.findIndex((p) => p.id === updatedProduct.id);
        if (index !== -1) state.products[index] = updatedProduct;
        state.product = updatedProduct;
      },
      rejected: (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || action.error.message;
      },
    }),
  }),
});

const buildProductFormData = (
  id: number,
  payload: ProductPayload,
  imageFiles: File[] | null = null
): FormData => {
  const formData = new FormData();

  if (id != 0) formData.append('productId', id);
  formData.append('productName', payload.productName);
  formData.append('brandId', payload.brandId.toString());
  formData.append('categoryId', payload.categoryId.toString());
  formData.append('description', payload.description);
  formData.append('originalPrice', payload.originalPrice.toString());
  formData.append('unitPrice', payload.unitPrice.toString());
  formData.append('productStatus', payload.productStatus);
  formData.append('quantityStock', payload.quantityStock.toString());

  if (imageFiles) {
    imageFiles.forEach((file) => formData.append('images', file));
  }

  if (payload.oldImages) {
    payload.oldImages.forEach((url) => formData.append('oldImages', url));
  }

  if (payload.configurations) {
    formData.append('configurations', JSON.stringify(payload.configurations));
  }

  return formData;
};
export const { resetProduct } = adminProductSlice.actions;
export const adminProductReducer = adminProductSlice.reducer;
