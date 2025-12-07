import { useState, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface CommentFormProps {
  onSubmit: (description: string) => Promise<void>;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  isSubmitting?: boolean;
  isReply?: boolean;
}

export const CommentForm = ({
  onSubmit,
  onCancel,
  initialValue = '',
  placeholder = 'Viết bình luận...',
  isSubmitting = false,
  isReply = false,
}: CommentFormProps) => {
  const [description, setDescription] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setDescription(initialValue);
  }, [initialValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isSubmitting) return;

    try {
      await onSubmit(description.trim());
      setDescription('');
      setIsFocused(false);
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        className={cn('min-h-[100px] resize-none', {
          'min-h-[80px]': isReply,
        })}
        disabled={isSubmitting}
      />
      {(isFocused || description) && (
        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />
              Hủy
            </Button>
          )}
          <Button type="submit" size="sm" disabled={!description.trim() || isSubmitting}>
            <Send className="h-4 w-4 mr-1" />
            {isSubmitting ? 'Đang gửi...' : isReply ? 'Trả lời' : 'Gửi bình luận'}
          </Button>
        </div>
      )}
    </form>
  );
};
