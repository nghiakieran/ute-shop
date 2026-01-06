/**
 * Vouchers Page
 * Display user's vouchers (active, used, expired)
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMyVouchers, selectVouchers, selectReviewLoading } from '@/redux/slices/review.slice';
import { VoucherCard, Loading } from '@/components';
import { AuthGuard } from '@/guards';
import { MainLayout } from '@/layouts';
import type { VoucherStatus } from '@/types/review';

const VouchersPage = () => {
  const dispatch = useAppDispatch();
  const vouchers = useAppSelector(selectVouchers);
  const loading = useAppSelector(selectReviewLoading);
  const [filter, setFilter] = useState<'ALL' | VoucherStatus>('ALL');

  useEffect(() => {
    dispatch(fetchMyVouchers());
  }, [dispatch]);

  const getVoucherStatus = (voucher: any): VoucherStatus => {
    if (voucher.isUsed) return 'USED';
    const isExpired = new Date(voucher.expiryDate) < new Date();
    if (isExpired) return 'EXPIRED';
    return 'ACTIVE';
  };

  const filteredVouchers = (vouchers || []).filter((voucher) => {
    if (filter === 'ALL') return true;
    return getVoucherStatus(voucher) === filter;
  });

  const getFilterCount = (status: 'ALL' | VoucherStatus) => {
    if (status === 'ALL') return (vouchers || []).length;
    return (vouchers || []).filter((v) => getVoucherStatus(v) === status).length;
  };

  if (loading && (!vouchers || vouchers.length === 0)) {
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
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Vouchers của tôi</h1>
                <p className="text-muted-foreground">Quản lý mã giảm giá của bạn</p>
              </motion.div>
            </div>
          </section>

          <div className="container-custom py-12">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {(['ALL', 'ACTIVE', 'USED', 'EXPIRED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {status === 'ALL' && 'Tất cả'}
                  {status === 'ACTIVE' && 'Còn hạn'}
                  {status === 'USED' && 'Đã dùng'}
                  {status === 'EXPIRED' && 'Hết hạn'}
                  <span className="ml-2 text-sm opacity-75">({getFilterCount(status)})</span>
                </button>
              ))}
            </div>

            {/* Vouchers List */}
            {filteredVouchers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                  <Ticket className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2">
                  {filter === 'ALL'
                    ? 'Chưa có voucher nào'
                    : filter === 'ACTIVE'
                    ? 'Không có voucher còn hạn'
                    : filter === 'USED'
                    ? 'Chưa sử dụng voucher nào'
                    : 'Không có voucher hết hạn'}
                </h2>
                <p className="text-muted-foreground">
                  Đánh giá sản phẩm để nhận voucher giảm giá nhé!
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVouchers.map((voucher, index) => (
                  <motion.div
                    key={voucher.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <VoucherCard voucher={voucher} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
};

export default VouchersPage;
