/**
 * Review (Comment) Types
 */

export interface Review {
  id: number;
  productId: number;
  userId: number;
  billId: number;
  rating: number; // 1-5
  description: string;
  hasRewardGiven: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
  product?: {
    id: number;
    productName: string;
    images?: string[];
  };
}

export interface CreateReviewRequest {
  productId: number;
  billId: number;
  rating: number;
  description: string;
}

export interface CreateReviewResponse {
  message: string;
  review: Review;
  reward: {
    type: 'VOUCHER' | 'POINTS';
    voucher?: Voucher;
    points?: number;
  };
}

export interface GetProductReviewsResponse {
  reviews: Review[];
  stats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
}

/**
 * Voucher Types
 */

export type VoucherType = 'PERCENTAGE' | 'FIXED' | 'FIXED_AMOUNT';
export type VoucherStatus = 'ACTIVE' | 'USED' | 'EXPIRED' | 'INACTIVE';

export interface Voucher {
  id: number;
  code: string;
  type: VoucherType;
  value: number;
  maxDiscount: number | null;
  minOrderValue: number;
  status: VoucherStatus;
  expiryDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetMyVouchersResponse {
  data: Voucher[];
  message: string;
  status: number;
}

/**
 * Loyalty Points Types
 */

export type LoyaltyPointTransactionType = 'EARN' | 'REDEEM' | 'EXPIRED';

export interface LoyaltyPointTransaction {
  id: number;
  userId: number;
  transactionType: LoyaltyPointTransactionType;
  points: number;
  description: string;
  createdAt: string;
}

export interface GetMyPointsResponse {
  totalPoints: number;
  transactions: LoyaltyPointTransaction[];
}

export interface GetMyReviewsResponse {
  data: Array<{
    productId: number;
    billId: number;
  }>;
}
