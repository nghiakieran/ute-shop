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
  hasMore: boolean;
  page: number;
  loading: boolean;
}

// Mock data generator - tạo nhiều thông báo để test infinite scroll
const generateMockNotifications = (count: number): Notification[] => {
  const types: NotificationType[] = ['order', 'post', 'event', 'review', 'comment'];
  const notifications: Notification[] = [];

  for (let i = 1; i <= count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    // 30% đầu là chưa đọc, 70% sau là đã đọc
    const isRead = i > Math.floor(count * 0.3) || Math.random() > 0.5;
    const hoursAgo = Math.floor(Math.random() * 168); // 0-7 ngày trước

    const titles = {
      order: ['Đơn hàng mới', 'Đơn hàng đã giao', 'Đơn hàng đang xử lý', 'Đơn hàng bị hủy'],
      post: ['Bài viết mới', 'Bài viết được yêu thích', 'Bài viết có bình luận mới'],
      event: ['Sự kiện mới', 'Sự kiện sắp diễn ra', 'Sự kiện kết thúc'],
      review: ['Đánh giá mới', 'Đánh giá 5 sao', 'Có đánh giá cần phản hồi'],
      comment: ['Bình luận mới', 'Có bình luận mới', 'Bình luận được trả lời'],
    };

    const messages = {
      order: [
        `Bạn có ${Math.floor(Math.random() * 5) + 1} đơn hàng mới cần xử lý`,
        `Đơn hàng #${1000 + i} đã được giao thành công`,
        `Đơn hàng #${1000 + i} đang được xử lý`,
      ],
      post: [
        'Có bài viết mới về "Xu hướng công nghệ 2024"',
        'Bài viết của bạn đã nhận được nhiều lượt thích',
        'Có người đã bình luận trên bài viết của bạn',
      ],
      event: [
        'Sự kiện Flash Sale sẽ diễn ra vào ngày mai',
        'Sự kiện Black Friday đang diễn ra',
        'Sự kiện đã kết thúc, xem kết quả ngay',
      ],
      review: [
        'Bạn nhận được đánh giá 5 sao từ khách hàng',
        `Có ${Math.floor(Math.random() * 10) + 1} đánh giá mới`,
        'Có đánh giá cần bạn phản hồi',
      ],
      comment: [
        `Có ${Math.floor(Math.random() * 10) + 1} bình luận mới trên sản phẩm của bạn`,
        'Có người đã trả lời bình luận của bạn',
        'Bình luận của bạn đã được thích',
      ],
    };

    notifications.push({
      id: String(i),
      type,
      title: titles[type][Math.floor(Math.random() * titles[type].length)],
      message: messages[type][Math.floor(Math.random() * messages[type].length)],
      read: isRead,
      createdAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
      link: `/${type}s/${i}`,
      metadata: {
        [`${type}Id`]: 1000 + i,
        ...(type === 'review' || type === 'comment' ? { productId: Math.floor(Math.random() * 50) + 1 } : {}),
      },
    });
  }

  return notifications;
};

const ITEMS_PER_PAGE = 10;
const TOTAL_MOCK_ITEMS = 50; // Tổng số thông báo mock
const allMockNotifications = generateMockNotifications(TOTAL_MOCK_ITEMS);

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
    // Load more notifications (infinite scroll)
    loadMoreNotifications: create.reducer((state) => {
      if (state.loading || !state.hasMore) return;

      state.loading = true;
      const nextPage = state.page + 1;
      const startIndex = state.page * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const nextNotifications = allMockNotifications.slice(startIndex, endIndex);

      if (nextNotifications.length > 0) {
        state.notifications = [...state.notifications, ...nextNotifications];
        state.page = nextPage;
        state.hasMore = endIndex < allMockNotifications.length;
      } else {
        state.hasMore = false;
      }
      state.loading = false;
    }),
  }),
});

export const {
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  addNotification,
  loadMoreNotifications,
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
export const selectHasMore = (state: { notification: NotificationSliceState }) =>
  state.notification?.hasMore ?? false;
export const selectNotificationLoading = (state: { notification: NotificationSliceState }) =>
  state.notification?.loading ?? false;

export default notificationSlice.reducer;
