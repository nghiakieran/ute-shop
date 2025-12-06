/**
 * Loyalty Points Page
 * Display user's loyalty points and transaction history
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchMyPoints,
  selectLoyaltyPoints,
  selectReviewLoading,
} from '@/redux/slices/review.slice';
import { Loading } from '@/components';
import { AuthGuard } from '@/guards';
import { MainLayout } from '@/layouts';
import { cn } from '@/lib/utils';
import type { LoyaltyPointTransactionType } from '@/types/review';

const LoyaltyPointsPage = () => {
  const dispatch = useAppDispatch();
  const loyaltyPoints = useAppSelector(selectLoyaltyPoints);
  const loading = useAppSelector(selectReviewLoading);

  useEffect(() => {
    dispatch(fetchMyPoints());
  }, [dispatch]);

  const getTransactionIcon = (type: LoyaltyPointTransactionType) => {
    switch (type) {
      case 'EARN':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'REDEEM':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'EXPIRED':
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: LoyaltyPointTransactionType) => {
    switch (type) {
      case 'EARN':
        return 'text-green-600';
      case 'REDEEM':
        return 'text-red-600';
      case 'EXPIRED':
        return 'text-gray-600';
    }
  };

  const getTransactionText = (type: LoyaltyPointTransactionType) => {
    switch (type) {
      case 'EARN':
        return 'Nhận điểm';
      case 'REDEEM':
        return 'Sử dụng';
      case 'EXPIRED':
        return 'Hết hạn';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !loyaltyPoints) {
    return <Loading />;
  }

  return (
    <AuthGuard>
      <MainLayout>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <section className="bg-secondary py-12">
            <div className="container-custom">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Điểm tích lũy</h1>
                <p className="text-muted-foreground">Theo dõi và sử dụng điểm thưởng của bạn</p>
              </motion.div>
            </div>
          </section>

          <div className="container-custom py-12">
            {/* Points Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-2">Tổng điểm hiện có</p>
                  <p className="text-5xl font-bold">{loyaltyPoints?.totalPoints || 0}</p>
                  <p className="text-sm opacity-75 mt-2">điểm</p>
                </div>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <Award className="w-10 h-10" />
                </div>
              </div>
            </motion.div>

            {/* Transaction History */}
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">Lịch sử giao dịch</h2>

              {!loyaltyPoints?.transactions || loyaltyPoints.transactions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 bg-card border border-border rounded-lg"
                >
                  <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                    <Award className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Chưa có giao dịch nào</h3>
                  <p className="text-muted-foreground">
                    Đánh giá sản phẩm để nhận điểm tích lũy nhé!
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {loyaltyPoints.transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="mt-1">
                            {getTransactionIcon(transaction.transactionType)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">
                              {getTransactionText(transaction.transactionType)}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn(
                              'text-2xl font-bold',
                              getTransactionColor(transaction.transactionType)
                            )}
                          >
                            {transaction.transactionType === 'EARN' ? '+' : '-'}
                            {transaction.points}
                          </p>
                          <p className="text-xs text-muted-foreground">điểm</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default LoyaltyPointsPage;
