import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';
import { notificationAPI } from '@/utils/notification.api';

export type NotificationType =
  | 'ORDER'
  | 'POST'
  | 'EVENT'
  | 'REVIEW'
  | 'COMMENT'
  | 'PROMOTION'
  | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  metadata?: {
    orderId?: number;
    postId?: number;
    eventId?: number;
    reviewId?: number;
    commentId?: number;
    productId?: number;
    [key: string]: any;
  };
}

interface NotificationSliceState {
  notifications: Notification[];
  unreadCount: number;
  hasMore: boolean;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationSliceState = {
  notifications: [],
  unreadCount: 0,
  hasMore: true,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

const mapNotificationData = (data: any): Notification => ({
  id: String(data.id),
  type: (data.type as NotificationType) || 'post',
  title: data.title,
  message: data.description || data.message || '',
  read: data.read ?? data.isRead ?? false,
  createdAt: data.createdAt || data.created_at,
  link: data.url || data.link,
  metadata: data.metadata || {},
});

export const loadMoreNotifications = createAsyncThunk(
  'notification/loadMore',
  async (_, { getState, rejectWithValue }) => {
    const state = (getState() as any).notification as NotificationSliceState;

    try {
      const response = await notificationAPI.getNotifications(state.page, state.limit);
      console.log('API Response:', response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Lỗi tải thông báo');
    }
  },
  {
    condition: (_, { getState }) => {
      const state = (getState() as any).notification as NotificationSliceState;

      if (!state) {
        console.error('⚠️ Redux State "notification" not found. Check store.ts!');
        return false;
      }

      if (state.loading) {
        console.log('🚫 Skipped loading: Already loading');
        return false;
      }

      if (!state.hasMore) {
        console.log('🚫 Skipped loading: No more data');
        return false;
      }

      return true;
    },
  }
);

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationAPI.markAsRead(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationAPI.markAllAsRead();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeNotification = createAsyncThunk(
  'notification/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationAPI.removeNotification(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  'notification/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      await notificationAPI.clearAllNotifications();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const notificationSlice = createAppSlice({
  name: 'notification',
  initialState,
  reducers: (create) => ({
    addNotification: create.reducer((state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    }),

    resetState: create.reducer(() => initialState),
  }),

  extraReducers: (builder) => {
    builder
      .addCase(loadMoreNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMoreNotifications.fulfilled, (state, action) => {
        state.loading = false;

        const { data, total } = action.payload;

        const newItems = data.map(mapNotificationData);

        const uniqueNewItems = newItems.filter(
          (newItem) => !state.notifications.some((exist) => exist.id === newItem.id)
        );

        state.notifications = [...state.notifications, ...uniqueNewItems];

        const newUnread = uniqueNewItems.filter((i) => !i.read).length;
        state.unreadCount += newUnread;

        if (state.notifications.length >= total || data.length === 0) {
          state.hasMore = false;
        } else {
          state.page += 1;
          state.hasMore = true;
        }
      })
      .addCase(loadMoreNotifications.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== 'No more data') {
          state.error = action.payload as string;
        }
      })

      .addCase(markAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        const item = state.notifications.find((n) => n.id === id);
        if (item && !item.read) {
          item.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.read = true;
        });
        state.unreadCount = 0;
      })

      .addCase(removeNotification.fulfilled, (state, action) => {
        const id = action.payload;
        const item = state.notifications.find((n) => n.id === id);
        if (item && !item.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter((n) => n.id !== id);
      })

      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
        state.hasMore = false;
      });
  },
});

export const { addNotification, resetState } = notificationSlice.actions;

export const selectNotifications = (state: { notification: NotificationSliceState }) =>
  state.notification?.notifications ?? [];

export const selectUnreadCount = (state: { notification: NotificationSliceState }) =>
  state.notification?.unreadCount ?? 0;

export const selectUnreadNotifications = (state: { notification: NotificationSliceState }) =>
  state.notification?.notifications?.filter((n) => !n.read) ?? [];

export const selectHasMore = (state: { notification: NotificationSliceState }) =>
  state.notification?.hasMore ?? false;

export const selectNotificationLoading = (state: { notification: NotificationSliceState }) =>
  state.notification?.loading ?? false;

export default notificationSlice.reducer;
