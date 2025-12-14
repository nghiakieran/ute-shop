import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  ShoppingBag,
  FileText,
  Calendar,
  Star,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectNotifications,
  selectUnreadCount,
  selectUnreadNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  Notification,
  NotificationType,
} from '@/redux/slices/notification.slice';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'order':
      return <ShoppingBag className="w-5 h-5" />;
    case 'post':
      return <FileText className="w-5 h-5" />;
    case 'event':
      return <Calendar className="w-5 h-5" />;
    case 'review':
      return <Star className="w-5 h-5" />;
    case 'comment':
      return <MessageSquare className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'order':
      return 'bg-blue-100 text-blue-600';
    case 'post':
      return 'bg-green-100 text-green-600';
    case 'event':
      return 'bg-purple-100 text-purple-600';
    case 'review':
      return 'bg-yellow-100 text-yellow-600';
    case 'comment':
      return 'bg-pink-100 text-pink-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  return date.toLocaleDateString('vi-VN');
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onRemove }: NotificationItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`relative group p-4 border-b border-border hover:bg-accent transition-colors ${
        !notification.read ? 'bg-accent/50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(
            notification.type
          )}`}
        >
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{notification.title}</p>
              <p className="text-sm text-foreground/70 mt-1 line-clamp-2">
                {notification.message}
              </p>
              <p className="text-xs text-foreground/50 mt-2">{formatTimeAgo(notification.createdAt)}</p>
            </div>

            {/* Unread indicator */}
            {!notification.read && (
              <div className="flex-shrink-0 ml-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-1"
            >
              {!notification.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  className="p-1.5 rounded-md hover:bg-accent text-foreground/70 hover:text-foreground transition-colors"
                  title="Đánh dấu đã đọc"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(notification.id);
                }}
                className="p-1.5 rounded-md hover:bg-destructive/10 text-foreground/70 hover:text-destructive transition-colors"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Link overlay */}
      {notification.link && (
        <Link
          to={notification.link}
          className="absolute inset-0"
          onClick={() => {
            if (!notification.read) {
              onMarkAsRead(notification.id);
            }
          }}
        />
      )}
    </motion.div>
  );
};

type TabType = 'all' | 'unread';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const allNotifications = useAppSelector(selectNotifications);
  const unreadNotifications = useAppSelector(selectUnreadNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);

  // Lọc thông báo theo tab
  const displayedNotifications =
    activeTab === 'all' ? allNotifications : unreadNotifications;

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleRemove = (id: string) => {
    dispatch(removeNotification(id));
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-foreground/70 hover:text-foreground transition-colors p-2 rounded-md hover:bg-accent"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 mt-2 w-96 bg-card rounded-lg shadow-xl border border-border z-50 max-h-[600px] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-foreground">Thông báo</h3>
                  {unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-accent text-foreground/70 hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === 'all'
                      ? 'text-primary'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Tất cả
                  {activeTab === 'all' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === 'unread'
                      ? 'text-primary'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  Chưa đọc
                  {unreadCount > 0 && activeTab !== 'unread' && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs font-medium px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                  {activeTab === 'unread' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              </div>

              {/* Actions */}
              {displayedNotifications.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-accent/30">
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                    className="flex items-center space-x-1 text-sm text-foreground/70 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Đánh dấu tất cả đã đọc</span>
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-destructive hover:text-destructive/80 transition-colors"
                  >
                    Xóa tất cả
                  </button>
                </div>
              )}

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {displayedNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Bell className="w-12 h-12 text-foreground/30 mb-4" />
                    <p className="text-sm text-foreground/70">
                      {activeTab === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo nào'}
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {displayedNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onRemove={handleRemove}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
