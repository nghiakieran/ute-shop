/**
 * Routes Configuration
 * Cấu hình routing với React Router v6
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ProfilePage,
  ForgotPasswordPage,
  ProductsPage,
  ProductDetailPage,
  CartPage,
  OrdersPage,
  CheckoutPage,
  WishlistPage,
} from '@/pages';
import { AuthGuard, GuestGuard } from '@/guards';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route
        path="/checkout"
        element={
          <AuthGuard>
            <CheckoutPage />
          </AuthGuard>
        }
      />

      {/* Guest Routes (Only for non-authenticated users) */}
      <Route
        path="/login"
        element={
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        }
      />
      <Route
        path="/register"
        element={
          <GuestGuard>
            <RegisterPage />
          </GuestGuard>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestGuard>
            <ForgotPasswordPage />
          </GuestGuard>
        }
      />

      {/* Protected Routes (Require authentication) */}
      <Route
        path="/profile"
        element={
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        }
      />
      <Route
        path="/orders"
        element={
          <AuthGuard>
            <OrdersPage />
          </AuthGuard>
        }
      />
      <Route path="/wishlist" element={<WishlistPage />} />

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

