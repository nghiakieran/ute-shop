import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    getAllConversations,
    getConversationById,
    markConversationAsRead,
    sendMessage,
    type Conversation,
    type ConversationDetail
} from '@/utils/message.api';
import { getMockConversationDetail, mockConversations } from '@/utils/message.mock';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCheck, Clock, Search, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Set to true to use mock data, false to use real API
const USE_MOCK_DATA = true;

export default function Messages() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ConversationDetail | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load conversations
    const loadConversations = async () => {
        try {
            setLoading(true);

            if (USE_MOCK_DATA) {
                // Use mock data
                let filteredConversations = [...mockConversations];

                // Filter by search term
                if (searchTerm) {
                    filteredConversations = filteredConversations.filter(
                        (c) =>
                            c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                setConversations(filteredConversations);
            } else {
                // Use real API
                const response = await getAllConversations(
                    1,
                    20,
                    undefined,
                    searchTerm || undefined
                );
                setConversations(response.data);
            }
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoading(false);
        }
    };


    // Load conversation details
    const loadConversationDetails = async (id: number) => {
        try {
            if (USE_MOCK_DATA) {
                // Use mock data
                const conversation = getMockConversationDetail(id);
                if (conversation) {
                    setSelectedConversation(conversation);

                    // Update unread count in conversations list
                    setConversations((prev) =>
                        prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
                    );
                }
            } else {
                // Use real API
                const conversation = await getConversationById(id);
                setSelectedConversation(conversation);
                // Mark as read
                await markConversationAsRead(id);
                // Refresh conversations to update unread count
                loadConversations();
            }
        } catch (error) {
            console.error('Failed to load conversation:', error);
        }
    };



    // Send message
    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedConversation || sending) return;

        try {
            setSending(true);

            if (USE_MOCK_DATA) {
                // Create mock message
                const newMessage = {
                    id: Date.now(),
                    conversationId: selectedConversation.id,
                    senderId: 1,
                    senderName: 'Admin',
                    content: messageInput.trim(),
                    isAdminReply: true,
                    isRead: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                // Update conversation with new message
                setSelectedConversation({
                    ...selectedConversation,
                    messages: [...selectedConversation.messages, newMessage],
                    lastMessageContent: messageInput.trim(),
                    lastMessageAt: new Date().toISOString(),
                });

                // Update conversations list
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === selectedConversation.id
                            ? {
                                ...c,
                                lastMessageContent: messageInput.trim(),
                                lastMessageAt: new Date().toISOString(),
                            }
                            : c
                    )
                );
            } else {
                // Use real API
                const newMessage = await sendMessage(selectedConversation.id, messageInput.trim());

                // Update conversation with new message
                setSelectedConversation({
                    ...selectedConversation,
                    messages: [...selectedConversation.messages, newMessage],
                });

                // Refresh conversations list
                loadConversations();
            }

            setMessageInput('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    // Load conversations on mount and when filters change
    useEffect(() => {
        loadConversations();
    }, [searchTerm]);


    // Auto-refresh every 5 seconds (only for real API)
    useEffect(() => {
        if (USE_MOCK_DATA) return; // Skip auto-refresh for mock data

        const interval = setInterval(() => {
            loadConversations();
            if (selectedConversation) {
                loadConversationDetails(selectedConversation.id);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [selectedConversation, searchTerm]);



    const formatTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), {
                addSuffix: true,
                locale: vi,
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="h-screen p-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-2.5rem)]">
                {/* Conversations List */}
                <Card className="shadow-card lg:col-span-1 flex flex-col overflow-hidden">
                    <CardHeader className="border-b">
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm kiếm cuộc hội thoại..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-0">
                        {loading && conversations.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">Đang tải...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                                Không có cuộc hội thoại nào
                            </div>
                        ) : (
                            <div className="divide-y">
                                {conversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        onClick={() => loadConversationDetails(conversation.id)}
                                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={conversation.userAvatar} />
                                                <AvatarFallback>
                                                    {conversation.userName.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="font-medium truncate">{conversation.userName}</p>
                                                    {conversation.unreadCount > 0 && (
                                                        <Badge className="bg-primary text-primary-foreground">
                                                            {conversation.unreadCount}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {conversation.lastMessageContent || 'Chưa có tin nhắn'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatTime(conversation.lastMessageAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>


                {/* Message Thread */}
                <Card className="shadow-card lg:col-span-2 flex flex-col overflow-hidden">
                    {selectedConversation ? (
                        <>
                            <CardHeader className="border-b">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={selectedConversation.userAvatar} />
                                        <AvatarFallback>
                                            {selectedConversation.userName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{selectedConversation.userName}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedConversation.userEmail}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                                {selectedConversation.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.isAdminReply ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg p-3 ${message.isAdminReply
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-xs opacity-70">{formatTime(message.createdAt)}</span>
                                                {message.isAdminReply && message.isRead && (
                                                    <CheckCheck className="h-3 w-3 opacity-70" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </CardContent>


                            <div className="border-t p-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Nhập tin nhắn..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        disabled={sending}
                                    />
                                    <Button onClick={handleSendMessage} disabled={sending || !messageInput.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            Chọn một cuộc hội thoại để xem tin nhắn
                        </div>
                    )}
                </Card>
            </div>
        </div >
    );
}
