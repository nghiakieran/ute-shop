import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { socketService } from '@/services/socket.service';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCheck, Clock, Search, Send, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
    ChatMessage,
    getAllConversations,
    getConversationById,
    uploadImage,
    markAsRead,
    addMessage,
    selectConversations,
    selectSelectedConversation,
    selectChatLoading,
    selectChatSending,
    selectChatUploading,
} from '@/redux/slices/chat.slice';

export default function Messages() {
    const dispatch = useDispatch<AppDispatch>();
    const conversations = useSelector(selectConversations);
    const selectedConversation = useSelector(selectSelectedConversation);
    const loading = useSelector(selectChatLoading);
    const sending = useSelector(selectChatSending);
    const uploading = useSelector(selectChatUploading);

    const [searchTerm, setSearchTerm] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const user = useSelector((state: RootState) => state.auth.user);
    const adminId = user?.id ? Number(user.id) : null;

    // Load conversations
    const loadConversations = () => {
        dispatch(getAllConversations());
    };

    // Load conversation details
    const loadConversationDetails = (id: string) => {
        dispatch(getConversationById(id));
        dispatch(markAsRead(id)); // Mark as read via Redux
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước ảnh không được vượt quá 5MB');
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Send message
    const handleSendMessage = async () => {
        if ((!messageInput.trim() && !selectedFile) || !selectedConversation || sending || !adminId) return;

        try {
            let imageUrl: string | undefined;

            // Upload image if selected
            if (selectedFile) {
                const result = await dispatch(uploadImage(selectedFile)).unwrap();
                imageUrl = result.url;
                clearImage();
            }

            // Send message via socket
            await socketService.sendMessage({
                conversationId: selectedConversation.id,
                senderId: adminId,
                content: messageInput.trim() || '📷 Hình ảnh',
                imageUrl,
                isAdminReply: true,
            });

            setMessageInput('');
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Không thể gửi tin nhắn');
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

    // Connect to socket and listen for new messages
    useEffect(() => {
        if (!adminId) return;

        // Connect as admin
        socketService.connect(adminId, true);

        // Listen for new messages
        const handleNewMessage = (message: ChatMessage) => {
            // Add message to Redux store
            dispatch(addMessage(message));
        };

        socketService.onNewMessage(handleNewMessage);

        return () => {
            socketService.offNewMessage(handleNewMessage);
        };
    }, [adminId, dispatch]);

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
                                        key={conversation.conversationId}
                                        onClick={() => loadConversationDetails(conversation.conversationId)}
                                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedConversation?.id === conversation.conversationId ? 'bg-muted' : ''
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
                                            {message.imageUrl && (
                                                <img
                                                    src={message.imageUrl}
                                                    alt="Uploaded"
                                                    className="rounded-lg mb-2 max-w-full h-auto"
                                                />
                                            )}
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
                                {imagePreview && (
                                    <div className="mb-2 relative inline-block">
                                        <img src={imagePreview} alt="Preview" className="h-20 rounded-lg" />
                                        <Button
                                            onClick={clearImage}
                                            size="icon"
                                            variant="destructive"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        size="icon"
                                        variant="outline"
                                        disabled={uploading || sending}
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </Button>
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
                                        disabled={sending || uploading}
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={sending || uploading || (!messageInput.trim() && !selectedFile)}
                                    >
                                        {sending || uploading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
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
        </div>
    );
}
