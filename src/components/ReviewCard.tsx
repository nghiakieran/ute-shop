/**
 * ReviewCard Component
 * Display a single review with user info, rating, and description
 */

import { Star, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Review } from '@/types/review';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* User Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          {review.user?.avatar ? (
            <img
              src={review.user.avatar}
              alt={review.user.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold">{review.user?.username || 'Anonymous'}</h4>
              <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
            </div>
          </div>
          {/* Rating */}
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn('w-4 h-4', {
                  'fill-yellow-400 text-yellow-400': star <= review.rating,
                  'text-gray-300': star > review.rating,
                })}
              />
            ))}
          </div>
          {/* Description */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{review.description}</p>
        </div>
      </div>
    </div>
  );
};
