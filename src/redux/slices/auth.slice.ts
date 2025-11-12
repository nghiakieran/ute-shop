/**
 * Auth Slice
 * Quản lý authentication state và API calls
 */

import { createAppSlice } from '../createAppSlice';
import { apiClient } from '@/utils/api.utils';
import { storageUtils } from '@/utils/storage.utils';
import { MESSAGES, API_ENDPOINTS } from '@/constants';

export interface AuthSliceState {
  loading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  accessToken: string | null;

  // Register flow - cần verify OTP
  registerEmail: string | null;
  registerPassword: string | null;
  registerName: string | null;
  needsVerification: boolean;

  // Forgot password flow
  forgotPasswordSent: boolean;
  resetPasswordSuccess: boolean;
  otpError: string | null;
}

const initialState: AuthSliceState = {
  loading: false,
  isAuthenticated: storageUtils.isAuthenticated(),
  user: storageUtils.getUserData(),
  error: null,
  accessToken: storageUtils.getAccessToken(),

  registerEmail: null,
  registerPassword: null,
  registerName: null,
  needsVerification: false,

  forgotPasswordSent: false,
  resetPasswordSuccess: false,
  otpError: null,
};

export const authSlice = createAppSlice({
  name: 'auth',
  initialState,
  reducers: (create) => ({
    // ==================== LOGIN ====================
    loginUser: create.asyncThunk(
      async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
          const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials);
          return response.data.data;
        } catch (error: any) {
          // Handle different error formats from apiClient
          const errorMessage = error?.message || error?.data?.message || MESSAGES.LOGIN_FAILED;
          return rejectWithValue(errorMessage);
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.error = null;

          // Save to localStorage
          storageUtils.setAccessToken(action.payload.accessToken);
          if (action.payload.refreshToken) {
            storageUtils.setRefreshToken(action.payload.refreshToken);
          }
          storageUtils.setUserData(action.payload.user);
        },
        rejected: (state, action) => {
          state.loading = false;
          state.isAuthenticated = false;
          state.user = null;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== REGISTER ====================
    registerUser: create.asyncThunk(
      async (payload: RegisterPayload, { rejectWithValue }) => {
        try {
          // Only send fullName, email, password to API (not confirmPassword)
          const registerData = {
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
          };
          const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, registerData);
          return {
            ...response.data.data,
            email: payload.email,
            password: payload.password,
            fullName: payload.fullName,
          };
        } catch (error: any) {
          return rejectWithValue(error.message || MESSAGES.REGISTER_FAILED);
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
          state.needsVerification = false;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.needsVerification = true;
          state.registerEmail = action.payload.email;
          state.registerPassword = action.payload.password;
          state.registerName = action.payload.fullName;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.needsVerification = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== VERIFY ACCOUNT ====================
    verifyAccount: create.asyncThunk(
      async (payload: VerifyOtpPayload, { rejectWithValue }) => {
        try {
          const response = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.VERIFY_ACCOUNT,
            payload
          );
          return response.data.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Xác thực OTP thất bại');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.otpError = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.needsVerification = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;

          // Save to localStorage
          storageUtils.setAccessToken(action.payload.accessToken);
          if (action.payload.refreshToken) {
            storageUtils.setRefreshToken(action.payload.refreshToken);
          }
          storageUtils.setUserData(action.payload.user);

          // Clear register data
          state.registerEmail = null;
          state.registerPassword = null;
          state.registerName = null;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.otpError = action.payload as string;
        },
      }
    ),

    // ==================== LOGOUT ====================
    logoutUser: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          await apiClient.post(API_ENDPOINTS.LOGOUT);
          return true;
        } catch (error: any) {
          return rejectWithValue(error.message);
        }
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        fulfilled: (state) => {
          state.loading = false;
          state.isAuthenticated = false;
          state.user = null;
          state.accessToken = null;
          state.error = null;

          // Clear localStorage
          storageUtils.clearAuth();
        },
        rejected: (state) => {
          state.loading = false;
          state.isAuthenticated = false;
          state.user = null;
          state.accessToken = null;

          // Clear localStorage anyway
          storageUtils.clearAuth();
        },
      }
    ),

    // ==================== GET PROFILE ====================
    getUserProfile: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await apiClient.get<User>(API_ENDPOINTS.GET_PROFILE);
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
          state.user = action.payload;
          state.isAuthenticated = true;

          // Update localStorage
          storageUtils.setUserData(action.payload);
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;

          // If profile fetch fails, user is not authenticated
          state.isAuthenticated = false;
          state.user = null;
          storageUtils.clearAuth();
        },
      }
    ),

    // ==================== FORGOT PASSWORD ====================
    forgotPassword: create.asyncThunk(
      async (payload: ForgotPasswordPayload, { rejectWithValue }) => {
        try {
          const response = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, payload);
          return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Gửi OTP thất bại');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state) => {
          state.loading = false;
          state.forgotPasswordSent = true;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.forgotPasswordSent = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== RESET PASSWORD ====================
    resetPassword: create.asyncThunk(
      async (payload: ResetPasswordPayload, { rejectWithValue }) => {
        try {
          const response = await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, payload);
          return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Đặt lại mật khẩu thất bại');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state) => {
          state.loading = false;
          state.resetPasswordSuccess = true;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.resetPasswordSuccess = false;
          state.error = action.payload as string;
          state.otpError = action.payload as string;
        },
      }
    ),

    // ==================== RESET AUTH STATE ====================
    resetError: create.reducer((state) => {
      state.error = null;
      state.otpError = null;
    }),

    resetForgotPassword: create.reducer((state) => {
      state.forgotPasswordSent = false;
      state.resetPasswordSuccess = false;
      state.otpError = null;
      state.error = null;
    }),

    resetRegisterState: create.reducer((state) => {
      state.needsVerification = false;
      state.registerEmail = null;
      state.registerPassword = null;
      state.registerName = null;
      state.error = null;
      state.otpError = null;
    }),

    // ==================== GOOGLE LOGIN ====================
    loginWithGoogle: create.reducer(() => {
      // Redirect to Google OAuth
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}${API_ENDPOINTS.GOOGLE_AUTH}`;
    }),

    handleGoogleCallback: create.asyncThunk(
      async (token: string, { rejectWithValue }) => {
        try {
          // Store token and get user profile
          storageUtils.setAccessToken(token);
          const response = await apiClient.get<User>(API_ENDPOINTS.GET_PROFILE);
          return { user: response.data.data, accessToken: token };
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
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          storageUtils.setUserData(action.payload.user);
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),
  }),

  // Selectors - để dễ dàng truy xuất state
  selectors: {
    selectAuthLoading: (state) => state.loading,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectUser: (state) => state.user,
    selectAuthError: (state) => state.error,
    selectAccessToken: (state) => state.accessToken,

    selectNeedsVerification: (state) => state.needsVerification,
    selectRegisterEmail: (state) => state.registerEmail,
    selectRegisterPassword: (state) => state.registerPassword,
    selectRegisterName: (state) => state.registerName,

    selectForgotPasswordSent: (state) => state.forgotPasswordSent,
    selectResetPasswordSuccess: (state) => state.resetPasswordSuccess,
    selectOtpError: (state) => state.otpError,
  },
});

// Export actions
export const {
  loginUser,
  registerUser,
  verifyAccount,
  logoutUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  loginWithGoogle,
  handleGoogleCallback,
  resetError,
  resetForgotPassword,
  resetRegisterState,
} = authSlice.actions;

// Export selectors
export const {
  selectAuthLoading,
  selectIsAuthenticated,
  selectUser,
  selectAuthError,
  selectAccessToken,
  selectNeedsVerification,
  selectRegisterEmail,
  selectRegisterPassword,
  selectRegisterName,
  selectForgotPasswordSent,
  selectResetPasswordSuccess,
  selectOtpError,
} = authSlice.selectors;

// Export reducer
export default authSlice.reducer;
