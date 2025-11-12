/**
 * Auth Guard
 * Bảo vệ routes yêu cầu authentication
 */

import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectIsAuthenticated, selectAuthLoading, getUserProfile } from '@/redux/slices/auth.slice';
import { Loading } from '@/components';

interface AuthGuardProps {
  children: ReactNode;
}

// Global flag to prevent multiple profile fetches
let hasCalledGetProfile = false;

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);

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

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

