/**
 * API Constants
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.uteshop.com/v1';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',

  // User
  GET_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  UPLOAD_AVATAR: '/user/avatar',

  // Products
  GET_PRODUCTS: '/products',
  GET_PRODUCT: '/products/:id',
  GET_CATEGORIES: '/categories',

  // Cart
  GET_CART: '/cart',
  ADD_TO_CART: '/cart/add',
  UPDATE_CART: '/cart/update',
  REMOVE_FROM_CART: '/cart/remove',
} as const;

