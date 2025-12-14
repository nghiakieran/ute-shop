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
  VNPayReturnPage,
  VouchersPage,
  LoyaltyPointsPage,
} from '@/pages';
import LoginSuccessPage from '@/pages/LoginSuccessPage';
import { AuthGuard, GuestGuard } from '@/guards';
import Dashboard from '@/pages/admin/Dashboard';
import Products from '@/pages/admin/Products';
import Orders from '@/pages/admin/Orders';
import Users from '@/pages/admin/Users';
import Promotions from '@/pages/admin/Promotions';
import BrandsCategories from '@/pages/admin/BrandsCategories';
import Messages from '@/pages/admin/Messages';
import { AdminLayout } from '@/layouts/AdminLayout';
import { UserLayout } from '@/layouts/UserLayout';
import ProductDetail from '@/pages/admin/ProductDetail';
import OrderDetail from '@/pages/admin/OrderDetail';
import CreatePromotion from '@/pages/admin/CreatePromotion';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<UserLayout />}>
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
        <Route
          path="/vouchers"
          element={
            <AuthGuard>
              <VouchersPage />
            </AuthGuard>
          }
        />
        <Route
          path="/loyalty-points"
          element={
            <AuthGuard>
              <LoyaltyPointsPage />
            </AuthGuard>
          }
        />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login-success" element={<LoginSuccessPage />} />
        <Route path="/payment/vnpay-return" element={<VNPayReturnPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="users" element={<Users />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="promotions/create" element={<CreatePromotion />} />
        <Route path="promotions/edit/:id" element={<CreatePromotion />} />
        <Route path="brands-categories" element={<BrandsCategories />} />
        <Route path="messages" element={<Messages />} />
      </Route>
      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
