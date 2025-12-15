/**
 * Chat Slice
 * Manages chat state with real API integration and WebSocket
 */

import { apiClient } from '@/utils/api.utils';
import { createAppSlice } from '../createAppSlice';

// ==================== TYPES ====================
export interface ChatMessage {
  id: number;
  conversationId: string;
  senderId: number;
  senderName: string;
  content: string;
  imageUrl?: string;
  isAdminReply: boolean;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  conversationId: string;
  userId: number;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  lastMessageContent: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ConversationDetail {
  id: string;
  userId: number;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  messages: ChatMessage[];
}

interface ChatSliceState {
  conversations: Conversation[];
  selectedConversation: ConversationDetail | null;
  loading: boolean;
  sending: boolean;
  uploading: boolean;
  error: string | null;
}

const initialState: ChatSliceState = {
  conversations: [],
  selectedConversation: null,
  loading: false,
  sending: false,
  uploading: false,
  error: null,
};

// ==================== API FUNCTIONS ====================
const chatApi = {
  // Admin APIs
  getAllConversations: async () => {
    const response = await apiClient.get('ute-shop/api/admin/chat/conversations');
    return response.data;
  },

  getConversationById: async (conversationId: string) => {
    const response = await apiClient.get(`ute-shop/api/admin/chat/conversations/${conversationId}`);
    return response.data;
  },

  sendMessage: async (
    conversationId: string,
    senderId: number,
    content: string,
    isAdminReply: boolean
  ) => {
    const response = await apiClient.post(
      `ute-shop/api/admin/chat/conversations/${conversationId}/messages`,
      {
        senderId,
        content,
        isAdminReply,
      }
    );
    return response.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('ute-shop/api/admin/chat/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  markAsRead: async (conversationId: string) => {
    const response = await apiClient.post(
      `ute-shop/api/admin/chat/conversations/${conversationId}/read`
    );
    return response.data;
  },

  // Client APIs
  getMyConversation: async () => {
    const response = await apiClient.get('ute-shop/api/client/chat/my-conversation');
    return response.data;
  },
};

// ==================== REDUX SLICE ====================
export const chatSlice = createAppSlice({
  name: 'chat',
  initialState,
  reducers: (create) => ({
    // ==================== GET ALL CONVERSATIONS ====================
    getAllConversations: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await chatApi.getAllConversations();
          return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch conversations');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.conversations = action.payload;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== GET CONVERSATION BY ID ====================
    getConversationById: create.asyncThunk(
      async (conversationId: string, { rejectWithValue }) => {
        try {
          const response = await chatApi.getConversationById(conversationId);
          return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch conversation');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.selectedConversation = action.payload;

          // Mark as read in conversations list
          state.conversations = state.conversations.map((c) =>
            c.conversationId === action.payload.id ? { ...c, unreadCount: 0 } : c
          );
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== SEND MESSAGE ====================
    sendMessage: create.asyncThunk(
      async (
        payload: {
          conversationId: string;
          senderId: number;
          content: string;
          isAdminReply: boolean;
        },
        { rejectWithValue }
      ) => {
        try {
          const response = await chatApi.sendMessage(
            payload.conversationId,
            payload.senderId,
            payload.content,
            payload.isAdminReply
          );
          return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to send message');
        }
      },
      {
        pending: (state) => {
          state.sending = true;
          state.error = null;
        },
        fulfilled: (state) => {
          state.sending = false;
          // Message will be added via WebSocket listener
        },
        rejected: (state, action) => {
          state.sending = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== UPLOAD IMAGE ====================
    uploadImage: create.asyncThunk(
      async (file: File, { rejectWithValue }) => {
        try {
          const response = await chatApi.uploadImage(file);
          return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to upload image');
        }
      },
      {
        pending: (state) => {
          state.uploading = true;
          state.error = null;
        },
        fulfilled: (state) => {
          state.uploading = false;
        },
        rejected: (state, action) => {
          state.uploading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== MARK AS READ ====================
    markAsRead: create.asyncThunk(
      async (conversationId: string, { rejectWithValue }) => {
        try {
          await chatApi.markAsRead(conversationId);
          return conversationId;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to mark as read');
        }
      },
      {
        fulfilled: (state, action) => {
          // Update unread count
          state.conversations = state.conversations.map((c) =>
            c.conversationId === action.payload ? { ...c, unreadCount: 0 } : c
          );
        },
      }
    ),

    // ==================== GET MY CONVERSATION (Client) ====================
    getMyConversation: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const response = await chatApi.getMyConversation();
          return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message || 'Failed to fetch conversation');
        }
      },
      {
        pending: (state) => {
          state.loading = true;
          state.error = null;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.selectedConversation = action.payload;
        },
        rejected: (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      }
    ),

    // ==================== ADD MESSAGE (from WebSocket) ====================
    addMessage: create.reducer((state, action: { payload: ChatMessage }) => {
      // Add message to selected conversation if it matches
      if (
        state.selectedConversation &&
        action.payload.conversationId === state.selectedConversation.id
      ) {
        state.selectedConversation.messages.push(action.payload);
      }

      // Update last message in conversations list
      state.conversations = state.conversations.map((c) =>
        c.conversationId === action.payload.conversationId
          ? {
              ...c,
              lastMessageContent: action.payload.content,
              lastMessageAt: action.payload.createdAt,
              unreadCount: action.payload.isAdminReply ? c.unreadCount : c.unreadCount + 1,
            }
          : c
      );
    }),

    // ==================== SET SELECTED CONVERSATION ====================
    setSelectedConversation: create.reducer(
      (state, action: { payload: ConversationDetail | null }) => {
        state.selectedConversation = action.payload;
      }
    ),

    // ==================== CLEAR SELECTED ====================
    clearSelectedConversation: create.reducer((state) => {
      state.selectedConversation = null;
    }),

    // ==================== RESET ERROR ====================
    resetError: create.reducer((state) => {
      state.error = null;
    }),
  }),
});

// Export actions
export const {
  getAllConversations,
  getConversationById,
  sendMessage,
  uploadImage,
  markAsRead,
  getMyConversation,
  addMessage,
  setSelectedConversation,
  clearSelectedConversation,
  resetError,
} = chatSlice.actions;

// Export selectors
export const selectConversations = (state: { chat: ChatSliceState }) => state.chat.conversations;
export const selectSelectedConversation = (state: { chat: ChatSliceState }) =>
  state.chat.selectedConversation;
export const selectChatLoading = (state: { chat: ChatSliceState }) => state.chat.loading;
export const selectChatSending = (state: { chat: ChatSliceState }) => state.chat.sending;
export const selectChatUploading = (state: { chat: ChatSliceState }) => state.chat.uploading;
export const selectChatError = (state: { chat: ChatSliceState }) => state.chat.error;

export default chatSlice.reducer;
