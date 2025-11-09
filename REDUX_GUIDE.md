# Redux Toolkit - Hướng Dẫn Chi Tiết

## 📚 Tổng Quan

Dự án sử dụng **Redux Toolkit** với pattern giống **AVN_PMS**, bao gồm:
- `createAppSlice` với async thunk support
- Typed hooks (`useAppDispatch`, `useAppSelector`)
- Redux Persist cho state persistence
- Selectors pattern

## 🏗️ Cấu Trúc Redux

```
src/redux/
├── slices/
│   ├── auth.slice.ts      # Authentication
│   └── user.slice.ts      # User profile
├── createAppSlice.ts      # Helper function
├── hooks.ts               # Typed hooks
└── store.ts               # Store configuration
```

## 🎯 1. Tạo Slice Mới

### Bước 1: Định nghĩa State Interface
```typescript
export interface ProductSliceState {
  loading: boolean;
  error: string | null;
  products: Product[];
  selectedProduct: Product | null;
}

const initialState: ProductSliceState = {
  loading: false,
  error: null,
  products: [],
  selectedProduct: null,
};
```

### Bước 2: Tạo Slice với createAppSlice
```typescript
import { createAppSlice } from '../createAppSlice';
import { apiClient } from '@/utils/api.utils';
import type { Product } from '@/types';

export const productSlice = createAppSlice({
  name: 'product',
  initialState,
  reducers: (create) => ({
    // Async Thunk - Gọi API
    getProducts: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await apiClient.get<Product[]>('/products');
          return response.data.data;
        } catch (error: any) {
          return rejectWithValue(error.message);
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

    // Async Thunk với params
    getProductById: create.asyncThunk(
      async (productId: string, { rejectWithValue }) => {
        try {
          const response = await apiClient.get<Product>(`/products/${productId}`);
          return response.data.data;
        } catch (error: any) {
          return rejectWithValue(error.message);
        }
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.selectedProduct = action.payload;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // Regular reducer (synchronous)
    clearSelectedProduct: create.reducer((state) => {
      state.selectedProduct = null;
    }),

    resetError: create.reducer((state) => {
      state.error = null;
    }),
  }),

  // Selectors
  selectors: {
    selectProducts: (state) => state.products,
    selectSelectedProduct: (state) => state.selectedProduct,
    selectProductLoading: (state) => state.loading,
    selectProductError: (state) => state.error,
  },
});

// Export actions
export const {
  getProducts,
  getProductById,
  clearSelectedProduct,
  resetError,
} = productSlice.actions;

// Export selectors
export const {
  selectProducts,
  selectSelectedProduct,
  selectProductLoading,
  selectProductError,
} = productSlice.selectors;

// Export reducer
export default productSlice.reducer;
```

### Bước 3: Thêm vào Store
```typescript
// src/redux/store.ts
import productReducer from './slices/product.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  product: productReducer, // ✅ Thêm reducer mới
});
```

## 🎯 2. Sử Dụng Redux trong Component

### Cách 1: Sử dụng hooks trực tiếp
```tsx
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  getProducts, 
  selectProducts, 
  selectProductLoading 
} from '@/redux/slices/product.slice';

export const ProductList = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductLoading);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### Cách 2: Tạo custom hook
```tsx
// src/hooks/useProducts.ts
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  getProducts,
  getProductById,
  selectProducts,
  selectSelectedProduct,
  selectProductLoading,
  selectProductError,
} from '@/redux/slices/product.slice';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  
  const products = useAppSelector(selectProducts);
  const selectedProduct = useAppSelector(selectSelectedProduct);
  const loading = useAppSelector(selectProductLoading);
  const error = useAppSelector(selectProductError);

  const fetchProducts = async () => {
    return dispatch(getProducts()).unwrap();
  };

  const fetchProductById = async (id: string) => {
    return dispatch(getProductById(id)).unwrap();
  };

  return {
    products,
    selectedProduct,
    loading,
    error,
    fetchProducts,
    fetchProductById,
  };
};

// Sử dụng trong component
const { products, loading, fetchProducts } = useProducts();
```

## 🎯 3. Patterns Nâng Cao

### Pattern 1: Dispatch trong Async Thunk
```typescript
uploadAvatar: create.asyncThunk(
  async (file: File, { dispatch }) => {
    const base64 = await convertToBase64(file);
    const response = await apiClient.post('/avatar', { avatar: base64 });
    
    // Refresh user profile sau khi upload
    await dispatch(getUserProfile());
    
    return response.data;
  },
  // ...
)
```

### Pattern 2: Handle Multiple API Calls
```typescript
initializePage: create.asyncThunk(
  async (_, { dispatch }) => {
    // Gọi nhiều API cùng lúc
    await Promise.all([
      dispatch(getProducts()),
      dispatch(getCategories()),
      dispatch(getUserCart()),
    ]);
  },
  // ...
)
```

### Pattern 3: Conditional Dispatch
```typescript
const handleAddToCart = async () => {
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }
  
  try {
    await dispatch(addToCart({ productId, quantity })).unwrap();
    toast.success('Đã thêm vào giỏ hàng!');
  } catch (error) {
    toast.error('Có lỗi xảy ra!');
  }
};
```

### Pattern 4: Error Handling
```typescript
const handleLogin = async (e: FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  try {
    await dispatch(loginUser(formData)).unwrap();
    // Success - redirect sẽ xử lý bởi slice
    navigate('/');
  } catch (error) {
    // Error đã được handle trong slice (state.error)
    // Có thể thêm logic bổ sung ở đây
    console.error('Login failed:', error);
  }
};
```

## 🎯 4. Best Practices

### ✅ DO

1. **Sử dụng typed hooks**
```tsx
// ✅ Good
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

// ❌ Bad
import { useDispatch, useSelector } from 'react-redux';
```

2. **Sử dụng selectors**
```tsx
// ✅ Good
const user = useAppSelector(selectUser);

// ❌ Bad
const user = useAppSelector((state) => state.auth.user);
```

3. **Sử dụng unwrap() khi cần handle result**
```tsx
// ✅ Good
try {
  const result = await dispatch(loginUser(credentials)).unwrap();
  console.log(result);
} catch (error) {
  console.error(error);
}
```

4. **Reset error trước khi dispatch mới**
```tsx
// ✅ Good
dispatch(resetError());
await dispatch(loginUser(credentials));
```

### ❌ DON'T

1. **Không mutate state trực tiếp ngoài reducers**
```tsx
// ❌ Bad
state.user.name = 'New Name';

// ✅ Good - use reducer
dispatch(updateUserName('New Name'));
```

2. **Không lưu non-serializable data vào state**
```tsx
// ❌ Bad
state.callback = () => console.log('test');

// ✅ Good - use ref hoặc local state
const callbackRef = useRef(() => console.log('test'));
```

## 🎯 5. Redux DevTools

Install Redux DevTools Extension để debug:
- View state tree
- Time-travel debugging
- Action history
- State diff

## 📚 Tài Liệu Tham Khảo

- [Redux Toolkit Official Docs](https://redux-toolkit.js.org/)
- [Redux Best Practices](https://redux.js.org/style-guide/style-guide)
- [TypeScript with Redux](https://redux-toolkit.js.org/usage/usage-with-typescript)

