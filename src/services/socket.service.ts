import io, { Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(userId: number, isAdmin: boolean = false) {
    if (this.socket?.connected) {
      return;
    }

    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3009';

    this.socket = io(`${baseURL}/chat`, {
      query: {
        userId: userId.toString(),
        isAdmin: isAdmin.toString(),
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChat(conversationId: string) {
    this.socket?.emit('join_chat', { conversationId });
  }

  sendMessage(data: {
    conversationId: string;
    senderId: number;
    content: string;
    imageUrl?: string;
    isAdminReply: boolean;
  }) {
    return new Promise((resolve, reject) => {
      this.socket?.emit('send_message', data, (response: any) => {
        if (response.success) {
          resolve(response.message);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('new_message', callback);
  }

  offNewMessage(callback?: (message: any) => void) {
    if (callback) {
      this.socket?.off('new_message', callback);
    } else {
      this.socket?.off('new_message');
    }
  }

  sendTyping(conversationId: string, isTyping: boolean) {
    this.socket?.emit('typing', { conversationId, isTyping });
  }

  onUserTyping(callback: (data: { conversationId: string; isTyping: boolean }) => void) {
    this.socket?.on('user_typing', callback);
  }

  offUserTyping(callback?: (data: any) => void) {
    if (callback) {
      this.socket?.off('user_typing', callback);
    } else {
      this.socket?.off('user_typing');
    }
  }

  markAsRead(conversationId: string) {
    this.socket?.emit('message_read', { conversationId });
  }

  onMessagesRead(callback: (data: { conversationId: string }) => void) {
    this.socket?.on('messages_read', callback);
  }

  offMessagesRead(callback?: (data: any) => void) {
    if (callback) {
      this.socket?.off('messages_read', callback);
    } else {
      this.socket?.off('messages_read');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
