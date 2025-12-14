import { apiClient } from '@/utils/api.utils';

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  content: string;
  isAdminReply: boolean;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  userEmail: string;
  subject?: string;
  status: 'open' | 'closed' | 'archived';
  lastMessageAt: string;
  lastMessageContent?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface PaginatedConversationsResponse {
  data: Conversation[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedMessagesResponse {
  data: Message[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getAllConversations = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  search?: string
) => {
  const response = await apiClient.get('/ute-shop/api/admin/conversations', {
    params: { page, limit, status, search },
  });
  return response.data.data as PaginatedConversationsResponse;
};

export const getConversationById = async (id: number) => {
  const response = await apiClient.get(`/ute-shop/api/admin/conversations/${id}`);
  return response.data.data as ConversationDetail;
};

export const getConversationMessages = async (
  conversationId: number,
  page: number = 1,
  limit: number = 50
) => {
  const response = await apiClient.get(
    `/ute-shop/api/admin/conversations/${conversationId}/messages`,
    { params: { page, limit } }
  );
  return response.data.data as PaginatedMessagesResponse;
};

export const sendMessage = async (conversationId: number, content: string) => {
  const response = await apiClient.post(
    `/ute-shop/api/admin/conversations/${conversationId}/messages`,
    { content }
  );
  return response.data.data as Message;
};

export const updateConversationStatus = async (
  id: number,
  status: 'open' | 'closed' | 'archived'
) => {
  const response = await apiClient.patch(`/ute-shop/api/admin/conversations/${id}/status`, {
    status,
  });
  return response.data.data as Conversation;
};

export const markMessageAsRead = async (messageId: number) => {
  const response = await apiClient.patch(`/ute-shop/api/admin/messages/${messageId}/read`);
  return response.data.data;
};

export const markConversationAsRead = async (conversationId: number) => {
  const response = await apiClient.patch(
    `/ute-shop/api/admin/conversations/${conversationId}/read`
  );
  return response.data.data;
};
