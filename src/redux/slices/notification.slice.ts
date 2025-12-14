import { createAppSlice } from '../createAppSlice';

export type NotificationType = 'order' | 'post' | 'event' | 'review' | 'comment';

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
  };
}

interface NotificationSliceState {
  notifications: Notification[];
  unreadCount: number;
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Đơn hàng mới',
    message: 'Bạn có 3 đơn hàng mới cần xử lý',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 phút trước
    link: '/orders',
    metadata: { orderId: 123 },
  },
  {
    id: '2',
    type: 'post',
    title: 'Bài viết mới',
    message: 'Có bài viết mới về "Xu hướng công nghệ 2024"',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 phút trước
    link: '/posts',
    metadata: { postId: 45 },
  },
  {
    id: '3',
    type: 'event',
    title: 'Sự kiện mới',
    message: 'Sự kiện Flash Sale sẽ diễn ra vào ngày mai',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 phút trước
    link: '/events',
    metadata: { eventId: 12 },
  },
  {
    id: '4',
    type: 'review',
    title: 'Đánh giá mới',
    message: 'Bạn nhận được đánh giá 5 sao từ khách hàng',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 giờ trước
    link: '/reviews',
    metadata: { reviewId: 78, productId: 5 },
  },
  {
    id: '5',
    type: 'comment',
    title: 'Bình luận mới',
    message: 'Có 5 bình luận mới trên sản phẩm của bạn',
    read: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 giờ trước
    link: '/products/5',
    metadata: { commentId: 23, productId: 5 },
  },
  {
    id: '6',
    type: 'order',
    title: 'Đơn hàng đã giao',
    message: 'Đơn hàng #456 đã được giao thành công',
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
    link: '/orders/456',
    metadata: { orderId: 456 },
  },
  {
    id: '7',
    type: 'post',
    title: 'Bài viết được yêu thích',
    message: 'Bài viết của bạn đã nhận được 100 lượt thích',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 ngày trước
    link: '/posts/45',
    metadata: { postId: 45 },
  },
];

const initialState: NotificationSliceState = {
  notifications: allMockNotifications.slice(0, ITEMS_PER_PAGE), // Load 10 đầu tiên
  unreadCount: allMockNotifications.filter((n) => !n.read).length,
  hasMore: allMockNotifications.length > ITEMS_PER_PAGE,
  page: 1,
  loading: false,
};

// ==================== SLICE ====================

export const notificationSlice = createAppSlice({
  name: 'notification',
  initialState,
  reducers: (create) => ({
    // Đánh dấu thông báo là đã đọc
    markAsRead: create.reducer((state, action: { payload: string }) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    }),
    // Đánh dấu tất cả là đã đọc
    markAllAsRead: create.reducer((state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
      state.unreadCount = 0;
    }),
    // Xóa thông báo
    removeNotification: create.reducer((state, action: { payload: string }) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    }),
    // Xóa tất cả thông báo
    clearAllNotifications: create.reducer((state) => {
      state.notifications = [];
      state.unreadCount = 0;
    }),
    // Thêm thông báo mới (dang mock - CALL API day nha)
    addNotification: create.reducer((state, action: { payload: Notification }) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    }),
  }),
});

export const {
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  addNotification,
} = notificationSlice.actions;

export const selectNotifications = (state: { notification: NotificationSliceState }) =>
  state.notification?.notifications ?? [];
export const selectUnreadCount = (state: { notification: NotificationSliceState }) =>
  state.notification?.unreadCount ?? 0;
export const selectUnreadNotifications = (state: { notification: NotificationSliceState }) =>
  state.notification?.notifications?.filter((n) => !n.read) ?? [];
export const selectNotificationsByType =
  (type: NotificationType) => (state: { notification: NotificationSliceState }) =>
    state.notification?.notifications?.filter((n) => n.type === type) ?? [];

export default notificationSlice.reducer;
