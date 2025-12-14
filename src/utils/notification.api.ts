// src/services/notification.service.ts

import { apiClient } from './api.utils';
export interface CreateNotificationEventPayload {
  recipientId?: number;
  recipientIds?: number[];
  sendToAll?: boolean;
  title: string;
  description: string;
  type?: 'EVENT' | 'ORDER' | 'POST' | 'SYSTEM';
  url?: string;
  scheduledAt?: string;
}

export interface UserBasic {
  id: number;
  fullName: string;
  email: string;
  avatar?: string;
}

export const notificationAPI = {
  getNotifications: async (page: number, limit: number) => {
    return apiClient.get('/ute-shop/api/client/notifications', { params: { page, limit } });
  },

  markAsRead: async (id: string | number) => {
    return apiClient.patch(`/ute-shop/api/client/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return apiClient.patch('/ute-shop/api/client/notifications/read-all');
  },

  removeNotification: async (id: string | number) => {
    return apiClient.delete(`/notifications/${id}`);
  },

  clearAllNotifications: async () => {
    return apiClient.delete('/ute-shop/api/client/notifications');
  },

  createNotificationEvent: async (payload: CreateNotificationEventPayload) => {
    return apiClient.post('/ute-shop/api/admin/notifications/create-event', payload);
  },

  searchUsers: async (query: string): Promise<UserBasic[]> => {
    const mockUsers = [
      { id: 1, fullName: 'Nguyễn Văn A', email: 'vana@example.com' },
      { id: 2, fullName: 'Trần Thị B', email: 'bibi@example.com' },
      { id: 3, fullName: 'Lê Văn C', email: 'cle@example.com' },
      { id: 4, fullName: 'Admin User', email: 'admin@example.com' },
      { id: 5, fullName: 'Hoàng Long', email: 'long@example.com' },
    ];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          mockUsers.filter(
            (u) =>
              u.fullName.toLowerCase().includes(query.toLowerCase()) ||
              u.email.toLowerCase().includes(query.toLowerCase())
          )
        );
      }, 300);
    });
  },
};
