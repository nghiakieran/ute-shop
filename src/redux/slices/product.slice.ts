/**
 * Product Slice
 * Manages products, categories, and product-related state
 */

import { createAppSlice } from '../createAppSlice';
import { mockProductsUtils } from '@/utils/mock-products.utils';
import {
  getNewestProducts,
  getBestSellingProducts,
  getMostViewedProducts,
  getTopDiscountProducts,
} from '@/utils/product.api';
interface ProductSliceState {
  products: Product[];
  featured: Product[];
  newArrivals: Product[];
  categories: ProductCategory[];
  currentProduct: Product | null;
  filter: ProductFilter;
  loading: boolean;
  error: string | null;
  newest: any[];
  bestSelling: any[];
  mostViewed: any[];
  topDiscount: any[];
}

const initialState: ProductSliceState = {
  products: [],
  featured: [],
  newArrivals: [],
  categories: [],
  currentProduct: null,
  filter: {},
  loading: false,
  error: null,
  newest: [],
  bestSelling: [],
  mostViewed: [],
  topDiscount: [],
};

export const productSlice = createAppSlice({
  name: 'product',
  initialState,
  reducers: (create) => ({
    // ==================== FETCH PRODUCTS ====================
    fetchProducts: create.asyncThunk(
      async (filter: ProductFilter | undefined, { rejectWithValue }) => {
        try {
          const products = await mockProductsUtils.getProducts(filter);
          return products;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch products');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.products = action.payload;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== FETCH PRODUCT BY ID ====================
    fetchProductById: create.asyncThunk(
      async (idOrSlug: string, { rejectWithValue }) => {
        try {
          const product = await mockProductsUtils.getProduct(idOrSlug);
          if (!product) {
            throw new Error('Product not found');
          }
          return product;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch product');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.currentProduct = action.payload;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
          state.currentProduct = null;
        },
      }
    ),

    // ==================== FETCH CATEGORIES ====================
    fetchCategories: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const categories = await mockProductsUtils.getCategories();
          return categories;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch categories');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.categories = action.payload;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== FETCH FEATURED PRODUCTS ====================
    fetchFeaturedProducts: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const products = await mockProductsUtils.getFeaturedProducts();
          return products;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch featured products');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.featured = action.payload;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== FETCH NEW ARRIVALS ====================
    fetchNewArrivals: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const products = await mockProductsUtils.getNewArrivals();
          return products;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch new arrivals');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.newArrivals = action.payload;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== SET FILTER ====================
    setFilter: create.reducer((state, action: { payload: ProductFilter }) => {
      state.filter = action.payload;
    }),

    // ==================== CLEAR FILTER ====================
    clearFilter: create.reducer((state) => {
      state.filter = {};
    }),

    // ==================== CLEAR CURRENT PRODUCT ====================
    clearCurrentProduct: create.reducer((state) => {
      state.currentProduct = null;
    }),

    fetchNewestProducts: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const data = await getNewestProducts(); // <-- Dùng API thật
          return data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch newest products');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.newest = action.payload; // <-- Cập nhật state 'newest'
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== FETCH BEST SELLING (API) ====================
    fetchBestSellingProducts: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const data = await getBestSellingProducts(); // <-- Dùng API thật
          return data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch best-selling');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.bestSelling = action.payload; // <-- Cập nhật state 'bestSelling'
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== FETCH MOST VIEWED (API) ====================
    fetchMostViewedProducts: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const data = await getMostViewedProducts(); // <-- Dùng API thật
          return data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch most-viewed');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.mostViewed = action.payload; // <-- Cập nhật state 'mostViewed'
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== FETCH TOP DISCOUNT (API) ====================
    fetchTopDiscountProducts: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const data = await getTopDiscountProducts(); // <-- Dùng API thật
          return data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch top-discount');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.topDiscount = action.payload; // <-- Cập nhật state 'topDiscount'
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),
  }),
});

export const {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  fetchFeaturedProducts,
  fetchNewArrivals,
  fetchNewestProducts,
  fetchBestSellingProducts,
  fetchMostViewedProducts,
  fetchTopDiscountProducts,
  clearCurrentProduct,
  setFilter,
  clearFilter,
} = productSlice.actions;

// Export selectors
export const selectProducts = (state: { product: ProductSliceState }) => state.product.products;
export const selectFeaturedProducts = (state: { product: ProductSliceState }) =>
  state.product.featured;
export const selectNewArrivals = (state: { product: ProductSliceState }) =>
  state.product.newArrivals;
export const selectCategories = (state: { product: ProductSliceState }) => state.product.categories;
export const selectCurrentProduct = (state: { product: ProductSliceState }) =>
  state.product.currentProduct;
export const selectProductFilter = (state: { product: ProductSliceState }) => state.product.filter;
export const selectProductLoading = (state: { product: ProductSliceState }) =>
  state.product.loading;
export const selectProductError = (state: { product: ProductSliceState }) => state.product.error;

export const selectNewestProducts = (state: { product: ProductSliceState }) => state.product.newest;
export const selectBestSellingProducts = (state: { product: ProductSliceState }) =>
  state.product.bestSelling;
export const selectMostViewedProducts = (state: { product: ProductSliceState }) =>
  state.product.mostViewed;
export const selectTopDiscountProducts = (state: { product: ProductSliceState }) =>
  state.product.topDiscount;
export default productSlice.reducer;
