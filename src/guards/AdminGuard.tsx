import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectUser,
  getUserProfile,
} from '@/redux/slices/auth.slice';
import { Loading } from '@/components';

interface AdminGuardProps {
  children: ReactNode;
}

// Global flag to prevent multiple profile fetches
let hasCalledGetProfile = false;

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    // Try to fetch user profile if we have a token and haven't already
    if (isAuthenticated && !hasCalledGetProfile) {
      hasCalledGetProfile = true;
      dispatch(getUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <Loading />;
  }

  // Nếu chưa đăng nhập, redirect về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu không phải admin hoặc moderator, redirect về trang chủ
  if (user && user.role !== 'admin' && user.role !== 'moderator') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
