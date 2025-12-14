import { useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { CommentCard } from './CommentCard';
import { CommentForm } from './CommentForm';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks';
import type { Comment } from '@/types/comment';

interface CommentListProps {
  comments: Comment[];
  loading?: boolean;
  onSubmitComment: (description: string, parentId?: number) => Promise<void>;
  onEditComment: (id: number, description: string) => Promise<void>;
  onDeleteComment: (id: number) => Promise<void>;
  productId: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
  } | null;
  onLoadMore?: () => Promise<void>;
}

export const CommentList = ({
  comments,
  loading = false,
  onSubmitComment,
  onEditComment,
  onDeleteComment,
  pagination,
  onLoadMore,
}: CommentListProps) => {
  const { isAuthenticated } = useAuth();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const hasMore = pagination
    ? comments.length < pagination.total
    : false;

  const handleSubmitComment = async (description: string, parentId?: number) => {
    setIsSubmitting(true);
    try {
      await onSubmitComment(description, parentId);
      setReplyingTo(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (description: string) => {
    if (!editingComment) return;
    setIsSubmitting(true);
    try {
      await onEditComment(editingComment.id, description);
      setEditingComment(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (id: number) => {
    setDeletingCommentId(id);
  };

  const confirmDelete = async () => {
    if (deletingCommentId) {
      await onDeleteComment(deletingCommentId);
      setDeletingCommentId(null);
    }
  };

  const handleLoadMore = async () => {
    if (!onLoadMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Loading overlay khi đang fetch comments lần đầu */}
      {loading && comments.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Loading overlay khi đang refresh (có comments rồi) */}
      {loading && comments.length > 0 && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Nội dung chính - ẩn khi đang loading lần đầu */}
      {(!loading || comments.length > 0) && (
        <>
      {/* Comment Form */}
      {isAuthenticated ? (
        <div className="bg-card border border-border rounded-lg p-4">
          {editingComment ? (
            <div>
              <div className="mb-2 text-sm text-muted-foreground">
                Chỉnh sửa bình luận
              </div>
              <CommentForm
                initialValue={editingComment.description}
                onSubmit={handleEditComment}
                onCancel={() => setEditingComment(null)}
                isSubmitting={isSubmitting}
              />
            </div>
          ) : (
            <CommentForm
              onSubmit={(description) => handleSubmitComment(description)}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      ) : (
        <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            Vui lòng đăng nhập để bình luận
          </p>
          <Button variant="outline" onClick={() => (window.location.href = '/login')}>
            Đăng nhập
          </Button>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Chưa có bình luận nào</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id}>
                {replyingTo === comment.id ? (
                  <div className="ml-8 mb-4 bg-muted/30 border border-border rounded-lg p-4">
                    <div className="mb-2 text-sm text-muted-foreground">
                      Trả lời {comment.customer.fullName}
                    </div>
                    <CommentForm
                      onSubmit={(description) => handleSubmitComment(description, comment.id)}
                      onCancel={() => setReplyingTo(null)}
                      isSubmitting={isSubmitting}
                      isReply
                      placeholder="Viết phản hồi..."
                    />
                  </div>
                ) : null}
                <CommentCard
                  comment={comment}
                  isEditing={editingComment?.id === comment.id}
                  onReply={(parentId) => {
                    if (isAuthenticated) {
                      setReplyingTo(parentId);
                    }
                  }}
                  onEdit={(comment) => setEditingComment(comment)}
                  onDelete={handleDeleteComment}
                />
              </div>
            ))}
          </div>
          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="min-w-[120px]"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  `Xem thêm (${pagination ? pagination.total - comments.length : 0} bình luận)`
                )}
              </Button>
            </div>
          )}
        </>
      )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deletingCommentId !== null} onOpenChange={(open) => !open && setDeletingCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bình luận</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
