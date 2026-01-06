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
    try {
      const response = await apiClient.get('/ute-shop/api/admin/users/search', {
        params: { keyword: query },
      });
      // assume API returns { data: users }
      return response.data?.data || [];
    } catch (error) {
      // fallback to empty array on error
      console.error('searchUsers API error', error);
      return [];
    }
  },
};
