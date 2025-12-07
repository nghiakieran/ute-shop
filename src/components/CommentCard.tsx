import { useState } from 'react';
import { Reply, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Comment } from '@/types/comment';
import { useAuth } from '@/hooks';

interface CommentCardProps {
  comment: Comment;
  onReply?: (parentId: number) => void;
  onEdit?: (comment: Comment) => void;
  onDelete?: (id: number) => void;
  level?: number;
  isEditing?: boolean;
}

export const CommentCard = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  level = 0,
  isEditing = false,
}: CommentCardProps) => {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(true);
  const isOwner = user?.id ? Number(user.id) === comment.customer.id : false;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else if (minutes > 0) {
      return `${minutes} phút trước`;
    } else {
      return 'Vừa xong';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn('border border-border rounded-lg p-4 transition-colors', {
        'ml-8 mt-4': level > 0,
        'bg-muted/30': level > 0,
        'border-primary bg-primary/5': isEditing,
      })}
    >
      {/* Comment Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment.customer.avatar} alt={comment.customer.fullName} />
          <AvatarFallback>{getInitials(comment.customer.fullName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h4 className="font-semibold text-sm">{comment.customer.fullName}</h4>
              <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
            </div>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(comment)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(comment.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Comment Content */}
      <div className="mb-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.description}</p>
      </div>

      {/* Comment Actions */}
      <div className="flex items-center gap-4">
        {onReply && level === 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => onReply(comment.id)}
          >
            <Reply className="h-3 w-3 mr-1" />
            Trả lời
          </Button>
        )}
        {hasReplies && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? 'Ẩn' : 'Hiện'} {comment.replies?.length} phản hồi
          </Button>
        )}
      </div>

      {/* Replies */}
      {hasReplies && showReplies && (
        <div className="mt-4 space-y-2">
          {comment.replies?.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
