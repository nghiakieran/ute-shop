/**
 * ReviewForm Component
 * Form for submitting product reviews with rating
 */

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  productId: number;
  billId: number;
  onSubmit: (data: { rating: number; description: string }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const ReviewForm = ({
  productId,
  billId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && description.trim()) {
      onSubmit({ rating, description: description.trim() });
    }
  };

  const ratingLabels = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating Stars */}
      <div className="space-y-2">
        <Label>Đánh giá của bạn</Label>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={cn('w-8 h-8', {
                    'fill-yellow-400 text-yellow-400': star <= (hoveredRating || rating),
                    'text-gray-300': star > (hoveredRating || rating),
                  })}
                />
              </button>
            ))}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {ratingLabels[rating - 1]}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Nhận xét của bạn</Label>
        <Textarea
          id="description"
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
          disabled={isSubmitting}
          className="resize-none min-h-[120px]"
        />
        <p className={cn("text-xs", {
          "text-muted-foreground": description.length >= 10,
          "text-destructive": description.length > 0 && description.length < 10,
        })}>
          Tối thiểu 10 ký tự. Hiện tại: {description.length} ký tự
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !description.trim() || description.length < 10}
          className="min-w-[120px]"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </Button>
      </div>
    </form>
  );
};
