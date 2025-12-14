/**
 * Redux Store Configuration
 * Cấu hình store với Redux Toolkit và Redux Persist
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

// Import reducers
import authReducer from './slices/auth.slice';
import userReducer from './slices/user.slice';
import productReducer from './slices/product.slice';
import cartReducer from './slices/cart.slice';
import orderReducer from './slices/order.slice';
import wishlistReducer from './slices/wishlist.slice';
import reviewReducer from './slices/review.slice';
import commentReducer from './slices/comment.slice';
import recentlyViewedReducer from './slices/recently-viewed.slice';
import { adminProductReducer } from './slices/admin/productManage.slice';
import { adminBrandsCategorieseducer } from './slices/admin/brandCategoryManage.slice';

// Persist config
const persistConfig = {
  key: 'uteshop-root',
  version: 1,
  storage,
  whitelist: ['auth', 'cart', 'wishlist', 'recentlyViewed'],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
  wishlist: wishlistReducer,
  review: reviewReducer,
  comment: commentReducer,
  recentlyViewed: recentlyViewedReducer,
  productManage: adminProductReducer,
  brandsCategoriesManage: adminBrandsCategorieseducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
