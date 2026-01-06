/**
 * API Constants
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3009';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/ute-shop/api/client/auth/login',
  REGISTER: '/ute-shop/api/client/auth/register',
  LOGOUT: '/ute-shop/api/client/auth/logout',
  REFRESH_TOKEN: '/ute-shop/api/client/auth/refresh',
  VERIFY_ACCOUNT: '/ute-shop/api/client/auth/verify-account',
  FORGOT_PASSWORD: '/ute-shop/api/client/auth/forgot-password',
  RESET_PASSWORD: '/ute-shop/api/client/auth/reset-password',
  GOOGLE_AUTH: '/ute-shop/api/client/auth/google',
  GOOGLE_CALLBACK: '/ute-shop/api/client/auth/google/callback',

  // User
  GET_PROFILE: '/ute-shop/api/client/auth/profile',
  UPDATE_PROFILE: '/ute-shop/api/client/auth/profile',
  CHANGE_PASSWORD: '/ute-shop/api/client/user/change-password',
  UPLOAD_AVATAR: '/ute-shop/api/client/user/avatar',

  // Products
  GET_PRODUCTS: '/ute-shop/api/client/products',
  GET_PRODUCT: '/ute-shop/api/client/products/:id',
  GET_CATEGORIES: '/ute-shop/api/client/categories',

  // Cart
  GET_CART: '/ute-shop/api/client/cart',
  ADD_TO_CART: '/ute-shop/api/client/cart',
  UPDATE_CART_ITEM: '/ute-shop/api/client/cart/:cartItemId',
  REMOVE_CART_ITEM: '/ute-shop/api/client/cart/:cartItemId',
  CLEAR_CART: '/ute-shop/api/client/cart',

  // Orders/Bills
  GET_ORDERS: '/ute-shop/api/client/bills/orders',
  GET_CHECKOUT: '/ute-shop/api/client/bills/checkout',
  CREATE_ORDER: '/ute-shop/api/client/bills/checkout',
  CANCEL_ORDER: '/ute-shop/api/client/bills/:billId/cancel',

  // Reviews
  SUBMIT_REVIEW: '/ute-shop/api/client/reviews',
  GET_PRODUCT_REVIEWS: '/ute-shop/api/client/reviews/products/:productId',
  GET_MY_VOUCHERS: '/ute-shop/api/client/reviews/my-vouchers',
  GET_MY_POINTS: '/ute-shop/api/client/reviews/my-points',

  // Comments
  CREATE_COMMENT: '/ute-shop/api/client/comments',
  GET_PRODUCT_COMMENTS: '/ute-shop/api/client/comments/products/:productId',
  GET_COMMENT: '/ute-shop/api/client/comments/:id',
  UPDATE_COMMENT: '/ute-shop/api/client/comments/:id',
  DELETE_COMMENT: '/ute-shop/api/client/comments/:id',
  GET_MY_COMMENTS: '/ute-shop/api/client/comments/user/my-comments',

  // Admin - User Management
  GET_ALL_USERS: '/ute-shop/api/admin/users',
  SEARCH_USERS: '/ute-shop/api/admin/users/search',
} as const;
