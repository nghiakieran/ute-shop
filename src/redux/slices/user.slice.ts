/**
 * User Slice
 * Quản lý user profile và các thao tác liên quan
 */

import { createAppSlice } from '../createAppSlice';
import { apiClient } from '@/utils/api.utils';
import { API_ENDPOINTS, MESSAGES } from '@/constants';
import { getUserProfile } from './auth.slice';

export interface UserSliceState {
  loading: boolean;
  error: string | null;

  updateProfileSuccess: boolean;
  changePasswordSuccess: boolean;
  uploadAvatarSuccess: boolean;
}

const initialState: UserSliceState = {
  loading: false,
  error: null,

  updateProfileSuccess: false,
  changePasswordSuccess: false,
  uploadAvatarSuccess: false,
};

export const userSlice = createAppSlice({
  name: 'user',
  initialState,
  reducers: (create) => ({
    updateProfile: create.asyncThunk(
      async (payload: UpdateProfilePayload, { dispatch, rejectWithValue }) => {
        try {
          const response = await apiClient.patch<User>(API_ENDPOINTS.UPDATE_PROFILE, payload);

          await dispatch(getUserProfile());

          return response.data.data;
        } catch (error: any) {
          return rejectWithValue(error.message);
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
          state.updateProfileSuccess = false;
        },
        fulfilled: (state) => {
          state.loading = false;
          state.updateProfileSuccess = true;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.updateProfileSuccess = false;
          state.error = action.payload as string;
        },
      }
    ),

    changePassword: create.asyncThunk(
      async (payload: ChangePasswordPayload, { rejectWithValue }) => {
        try {
          const response = await apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, payload);
          return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message);
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
          state.changePasswordSuccess = false;
        },
        fulfilled: (state) => {
          state.loading = false;
          state.changePasswordSuccess = true;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.changePasswordSuccess = false;
          state.error = action.payload as string;
        },
      }
    ),

    uploadAvatar: create.asyncThunk(
      async (file: File, { dispatch, rejectWithValue }) => {
        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
          });

          const response = await apiClient.post<User>(API_ENDPOINTS.UPLOAD_AVATAR, {
            avatar: base64,
          });

          await dispatch(getUserProfile());

          return response.data.data;
        } catch (error: any) {
          return rejectWithValue(error.message || MESSAGES.SERVER_ERROR);
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.uploadAvatarSuccess = false;
          state.error = null;
        },
        fulfilled: (state) => {
          state.loading = false;
          state.uploadAvatarSuccess = true;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.uploadAvatarSuccess = false;
          state.error = action.payload as string;
        },
      }
    ),

    resetUpdateProfileState: create.reducer((state) => {
      state.updateProfileSuccess = false;
      state.error = null;
    }),

    resetChangePasswordState: create.reducer((state) => {
      state.changePasswordSuccess = false;
      state.error = null;
    }),

    resetUploadAvatarState: create.reducer((state) => {
      state.uploadAvatarSuccess = false;
      state.error = null;
    }),

    resetError: create.reducer((state) => {
      state.error = null;
    }),
  }),

  selectors: {
    selectUserLoading: (state) => state.loading,
    selectUserError: (state) => state.error,
    selectUpdateProfileSuccess: (state) => state.updateProfileSuccess,
    selectChangePasswordSuccess: (state) => state.changePasswordSuccess,
    selectUploadAvatarSuccess: (state) => state.uploadAvatarSuccess,
  },
});

export const {
  updateProfile,
  changePassword,
  uploadAvatar,
  resetUpdateProfileState,
  resetChangePasswordState,
  resetUploadAvatarState,
  resetError,
} = userSlice.actions;

// Export selectors
export const {
  selectUserLoading,
  selectUserError,
  selectUpdateProfileSuccess,
  selectChangePasswordSuccess,
  selectUploadAvatarSuccess,
} = userSlice.selectors;

// Export reducer
export default userSlice.reducer;
