import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface LinkPreview {
    url: string;
    title: string;
    description: string;
    image: string;
    type: 'product' | 'general';
}

interface Message {
    id: number;
    content: string;
    isUser: boolean;
    timestamp: Date;
    linkPreview?: LinkPreview;
}

// Mock product data for preview
const mockProducts: Record<string, LinkPreview> = {
    'nike-air-force-1-07': {
        url: '/products/nike-air-force-1-07',
        title: 'Nike Air Force 1 \'07',
        description: 'Giày thể thao Nike Air Force 1 classic với thiết kế iconic, phù hợp mọi phong cách.',
        image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png',
        type: 'product',
    },
    'adidas-ultraboost-22': {
        url: '/products/adidas-ultraboost-22',
        title: 'Adidas Ultraboost 22',
        description: 'Giày chạy bộ cao cấp với công nghệ Boost, mang lại sự thoải mái tối đa.',
        image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg',
        type: 'product',
    },
};

const mockMessages: Message[] = [
    {
        id: 1,
        content: 'Xin chào! Chúng tôi có thể giúp gì cho bạn?',
        isUser: false,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
];

export function FloatingChatbox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Detect URL in message and extract preview
    const detectLinkPreview = (text: string): LinkPreview | undefined => {
        // Regex to detect URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = text.match(urlRegex);

        if (!matches) return undefined;

        const url = matches[0];

        // Check if it's a product link
        const productMatch = url.match(/\/products\/([a-z0-9-]+)/i);
        if (productMatch) {
            const productSlug = productMatch[1];
            return mockProducts[productSlug];
        }

        return undefined;
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Detect link preview
        const linkPreview = detectLinkPreview(inputValue);

        // Add user message
        const userMessage: Message = {
            id: messages.length + 1,
            content: inputValue,
            isUser: true,
            timestamp: new Date(),
            linkPreview,
        };

        setMessages([...messages, userMessage]);
        setInputValue('');

        // Simulate admin response after 1 second
        setTimeout(() => {
            const adminMessage: Message = {
                id: messages.length + 2,
                content: linkPreview
                    ? `Tôi thấy bạn quan tâm đến sản phẩm "${linkPreview.title}". Bạn cần tư vấn thêm không?`
                    : 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.',
                isUser: false,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, adminMessage]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

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
                            {/* Close button in header */}
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
                                    message.isUser ? 'justify-end' : 'justify-start'
                                )}
                            >
                                <div
                                    className={cn(
                                        'max-w-[75%] rounded-lg p-3',
                                        message.isUser
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-background border'
                                    )}
                                >
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
                                                message.isUser ? "bg-primary-foreground/10" : "bg-muted"
                                            )}>
                                                <div className="flex items-start gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className={cn(
                                                            "font-semibold text-xs truncate",
                                                            message.isUser ? "text-primary-foreground" : "text-foreground"
                                                        )}>
                                                            {message.linkPreview.title}
                                                        </p>
                                                        <p className={cn(
                                                            "text-xs line-clamp-2 mt-0.5",
                                                            message.isUser ? "text-primary-foreground/80" : "text-muted-foreground"
                                                        )}>
                                                            {message.linkPreview.description}
                                                        </p>
                                                    </div>
                                                    <ExternalLink className={cn(
                                                        "h-3 w-3 shrink-0 mt-0.5",
                                                        message.isUser ? "text-primary-foreground/60" : "text-muted-foreground"
                                                    )} />
                                                </div>
                                            </div>
                                        </a>
                                    )}

                                    <span className="text-xs opacity-70 mt-1 block">
                                        {formatTime(message.timestamp)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Input */}
                    <div className="border-t p-4 bg-background">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Nhập tin nhắn..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1"
                            />
                            <Button onClick={handleSend} size="icon" disabled={!inputValue.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
}
