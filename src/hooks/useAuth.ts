/**
 * useAuth Hook
 * Custom hook for authentication
 */

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  selectIsAuthenticated,
  selectUser,
  selectAuthLoading,
  selectAuthError,
  loginUser,
  logoutUser,
  registerUser,
  getUserProfile,
} from '@/redux/slices/auth.slice';
import type { LoginCredentials, RegisterPayload } from '@/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const login = async (credentials: LoginCredentials) => {
    return dispatch(loginUser(credentials)).unwrap();
  };

  const register = async (payload: RegisterPayload) => {
    return dispatch(registerUser(payload)).unwrap();
  };

  const logout = async () => {
    return dispatch(logoutUser()).unwrap();
  };

  const refreshProfile = async () => {
    return dispatch(getUserProfile()).unwrap();
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshProfile,
  };
};

