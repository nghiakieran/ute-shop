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
  
  // Register flow
  registerSuccess: boolean;
  
  // Forgot password flow
  forgotPasswordSent: boolean;
  otpVerified: boolean;
  resetPasswordSuccess: boolean;
  otpError: string | null;
}

const initialState: AuthSliceState = {
  loading: false,
  isAuthenticated: storageUtils.isAuthenticated(),
  user: storageUtils.getUserData(),
  error: null,
  accessToken: storageUtils.getAccessToken(),
  
  registerSuccess: false,
  
  forgotPasswordSent: false,
  otpVerified: false,
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
          // 🔧 MOCK MODE - Comment this out when backend is ready
          const { mockAuthUtils } = await import('@/utils/mock-auth.utils');
          const mockResponse = await mockAuthUtils.login(credentials.email, credentials.password);
          return mockResponse;
          
          // 🔧 REAL API - Uncomment when backend is ready
          // const response = await apiClient.post<AuthResponse>(
          //   API_ENDPOINTS.LOGIN,
          //   credentials
          // );
          // return response.data.data;
        } catch (error: any) {
          return rejectWithValue(error.message || MESSAGES.LOGIN_FAILED);
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
          // 🔧 MOCK MODE - Comment this out when backend is ready
          const { mockAuthUtils } = await import('@/utils/mock-auth.utils');
          const mockResponse = await mockAuthUtils.register(payload.name, payload.email, payload.password);
          return mockResponse;
          
          // 🔧 REAL API - Uncomment when backend is ready
          // const response = await apiClient.post<AuthResponse>(
          //   API_ENDPOINTS.REGISTER,
          //   payload
          // );
          // return response.data.data;
        } catch (error: any) {
          return rejectWithValue(error.message || MESSAGES.REGISTER_FAILED);
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
          state.registerSuccess = false;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.registerSuccess = true;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          
          // Save to localStorage
          storageUtils.setAccessToken(action.payload.accessToken);
          if (action.payload.refreshToken) {
            storageUtils.setRefreshToken(action.payload.refreshToken);
          }
          storageUtils.setUserData(action.payload.user);
        },
        rejected: (state, action) => {
          state.loading = false;
          state.registerSuccess = false;
          state.error = action.payload as string;
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
          // 🔧 MOCK MODE - Comment this out when backend is ready
          const { mockAuthUtils } = await import('@/utils/mock-auth.utils');
          const mockResponse = await mockAuthUtils.forgotPassword(payload.email);
          return mockResponse;
          
          // 🔧 REAL API - Uncomment when backend is ready
          // const response = await apiClient.post(
          //   API_ENDPOINTS.FORGOT_PASSWORD,
          //   payload
          // );
          // return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message);
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

    // ==================== VERIFY OTP ====================
    verifyOtp: create.asyncThunk(
      async (payload: VerifyOtpPayload, { rejectWithValue }) => {
        try {
          // 🔧 MOCK MODE - Comment this out when backend is ready
          const { mockAuthUtils } = await import('@/utils/mock-auth.utils');
          const mockResponse = await mockAuthUtils.verifyOtp(payload.email, payload.otp);
          return mockResponse;
          
          // 🔧 REAL API - Uncomment when backend is ready
          // const response = await apiClient.post(API_ENDPOINTS.VERIFY_OTP, payload);
          // return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message || MESSAGES.OTP_INVALID);
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.otpError = null;
        },
        fulfilled: (state) => {
          state.loading = false;
          state.otpVerified = true;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.otpVerified = false;
          state.otpError = action.payload as string;
        },
      }
    ),

    // ==================== RESET PASSWORD ====================
    resetPassword: create.asyncThunk(
      async (payload: ResetPasswordPayload, { rejectWithValue }) => {
        try {
          // 🔧 MOCK MODE - Comment this out when backend is ready
          const { mockAuthUtils } = await import('@/utils/mock-auth.utils');
          const mockResponse = await mockAuthUtils.resetPassword(
            payload.email,
            payload.otp,
            payload.newPassword
          );
          return mockResponse;
          
          // 🔧 REAL API - Uncomment when backend is ready
          // const response = await apiClient.post(
          //   API_ENDPOINTS.RESET_PASSWORD,
          //   payload
          // );
          // return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message);
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
      state.otpVerified = false;
      state.resetPasswordSuccess = false;
      state.otpError = null;
      state.error = null;
    }),

    resetRegisterState: create.reducer((state) => {
      state.registerSuccess = false;
      state.error = null;
    }),
  }),

  // Selectors - để dễ dàng truy xuất state
  selectors: {
    selectAuthLoading: (state) => state.loading,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectUser: (state) => state.user,
    selectAuthError: (state) => state.error,
    selectAccessToken: (state) => state.accessToken,
    
    selectRegisterSuccess: (state) => state.registerSuccess,
    
    selectForgotPasswordSent: (state) => state.forgotPasswordSent,
    selectOtpVerified: (state) => state.otpVerified,
    selectResetPasswordSuccess: (state) => state.resetPasswordSuccess,
    selectOtpError: (state) => state.otpError,
  },
});

// Export actions
export const {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
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
  selectRegisterSuccess,
  selectForgotPasswordSent,
  selectOtpVerified,
  selectResetPasswordSuccess,
  selectOtpError,
} = authSlice.selectors;

// Export reducer
export default authSlice.reducer;

