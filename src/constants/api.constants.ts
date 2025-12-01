/**
 * API Constants
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3009/ute-shop/api/client';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_ACCOUNT: '/auth/verify-account',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  GOOGLE_AUTH: '/auth/google',
  GOOGLE_CALLBACK: '/auth/google/callback',

  // User
  GET_PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/user/change-password',
  UPLOAD_AVATAR: '/user/avatar',

  // Products
  GET_PRODUCTS: '/products',
  GET_PRODUCT: '/products/:id',
  GET_CATEGORIES: '/categories',

  // Cart
  GET_CART: '/cart',
  ADD_TO_CART: '/cart',
  UPDATE_CART_ITEM: '/cart/:cartItemId',
  REMOVE_CART_ITEM: '/cart/:cartItemId',
  CLEAR_CART: '/cart',

  // Orders/Bills
  GET_ORDERS: '/bills/orders',
} as const;
