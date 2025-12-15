import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ExternalLink, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { socketService } from '@/services/socket.service';
import { ChatMessage, uploadImage, getMyConversation } from '@/redux/slices/chat.slice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import toast from 'react-hot-toast';

interface LinkPreview {
    url: string;
    title: string;
    description: string;
    image: string;
    type: 'product' | 'general';
}

interface Message extends ChatMessage {
    linkPreview?: LinkPreview;
}

export function FloatingChatbox() {
    const dispatch = useDispatch<AppDispatch>();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.id ? Number(user.id) : null;
    const conversationId = userId ? `user-${userId}` : '';

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Connect to socket and load messages when component mounts
    useEffect(() => {
        if (!userId) return;

        // Connect to socket
        socketService.connect(userId, false);
        socketService.joinChat(conversationId);

        // Listen for new messages
        const handleNewMessage = (message: ChatMessage) => {
            if (message.conversationId === conversationId) {
                setMessages((prev) => [...prev, message as Message]);
            }
        };

        socketService.onNewMessage(handleNewMessage);

        return () => {
            socketService.offNewMessage(handleNewMessage);
        };
    }, [userId, conversationId]);

    // Load conversation history when chatbox opens
    useEffect(() => {
        if (isOpen && userId) {
            // Load conversation history from API
            dispatch(getMyConversation())
                .unwrap()
                .then((conversation) => {
                    if (conversation.messages) {
                        setMessages(conversation.messages as Message[]);
                    }
                })
                .catch((error) => {
                    console.error('Failed to load conversation:', error);
                });
        }
    }, [isOpen, userId, dispatch]);

    // No need to load messages - WebSocket handles real-time updates

    // Detect URL in message and extract preview
    // const detectLinkPreview = (text: string): LinkPreview | undefined => {
    //     const urlRegex = /(https?:\/\/[^\s]+)/g;
    //     const matches = text.match(urlRegex);

    //     if (!matches) return undefined;

    //     const url = matches[0];
    //     const productMatch = url.match(/\/products\/([a-z0-9-]+)/i);
    //     if (productMatch) {
    //         const productSlug = productMatch[1];
    //         return mockProducts[productSlug];
    //     }

    //     return undefined;
    // };

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

    const handleSend = async () => {
        if (!inputValue.trim() && !selectedFile) return;
        if (!userId) {
            toast.error('Vui lòng đăng nhập để chat');
            return;
        }

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
                conversationId,
                senderId: userId,
                content: inputValue.trim() || '📷 Hình ảnh',
                imageUrl,
                isAdminReply: false,
            });

            setInputValue('');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Không thể gửi tin nhắn');
        } finally {
            setUploading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: string | Date) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    if (!user) return null;

    return (
        <>
            {/* Floating Button - Only show when chat is closed */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-all duration-300 z-50',
                        'hover:scale-110 active:scale-95'
                    )}
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card
                    className={cn(
                        'fixed bottom-6 right-6 w-[400px] h-[500px] shadow-2xl z-40',
                        'flex flex-col overflow-hidden',
                        'animate-in slide-in-from-bottom-5 fade-in duration-300',
                        'max-md:w-[calc(100vw-3rem)] max-md:h-[calc(100vh-8rem)]'
                    )}
                >
                    {/* Header */}
                    <CardHeader className="border-b bg-primary text-primary-foreground p-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="https://i.pravatar.cc/150?img=68" />
                                <AvatarFallback>CS</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="font-semibold">Chat với chúng tôi</h3>
                                <p className="text-xs opacity-90">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
                            </div>
                            <Button
                                onClick={() => setIsOpen(false)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Messages */}
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    'flex',
                                    message.isAdminReply ? 'justify-start' : 'justify-end'
                                )}
                            >
                                <div
                                    className={cn(
                                        'max-w-[75%] rounded-lg p-3',
                                        message.isAdminReply
                                            ? 'bg-background border'
                                            : 'bg-primary text-primary-foreground'
                                    )}
                                >
                                    {message.imageUrl && (
                                        <img
                                            src={message.imageUrl}
                                            alt="Uploaded"
                                            className="rounded-lg mb-2 max-w-full h-auto"
                                        />
                                    )}
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                                    {/* Link Preview Card */}
                                    {message.linkPreview && (
                                        <a
                                            href={message.linkPreview.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block mt-2 rounded-lg overflow-hidden border hover:opacity-80 transition-opacity"
                                        >
                                            <div className="relative h-32 bg-muted">
                                                <img
                                                    src={message.linkPreview.image}
                                                    alt={message.linkPreview.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className={cn(
                                                "p-2",
                                                message.isAdminReply ? "bg-muted" : "bg-primary-foreground/10"
                                            )}>
                                                <div className="flex items-start gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className={cn(
                                                            "font-semibold text-xs truncate",
                                                            message.isAdminReply ? "text-foreground" : "text-primary-foreground"
                                                        )}>
                                                            {message.linkPreview.title}
                                                        </p>
                                                        <p className={cn(
                                                            "text-xs line-clamp-2 mt-0.5",
                                                            message.isAdminReply ? "text-muted-foreground" : "text-primary-foreground/80"
                                                        )}>
                                                            {message.linkPreview.description}
                                                        </p>
                                                    </div>
                                                    <ExternalLink className={cn(
                                                        "h-3 w-3 shrink-0 mt-0.5",
                                                        message.isAdminReply ? "text-muted-foreground" : "text-primary-foreground/60"
                                                    )} />
                                                </div>
                                            </div>
                                        </a>
                                    )}

                                    <span className="text-xs opacity-70 mt-1 block">
                                        {formatTime(message.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Input */}
                    <div className="border-t p-4 bg-background">
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
                                disabled={uploading}
                            >
                                <ImageIcon className="h-4 w-4" />
                            </Button>
                            <Input
                                placeholder="Nhập tin nhắn..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1"
                                disabled={uploading}
                            />
                            <Button
                                onClick={handleSend}
                                size="icon"
                                disabled={(!inputValue.trim() && !selectedFile) || uploading}
                            >
                                {uploading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
}
