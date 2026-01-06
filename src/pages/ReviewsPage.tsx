/**
 * Reviews Page
 * Page for users to review products they've purchased
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Gift, Award } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectOrders, fetchOrders } from '@/redux/slices/order.slice';
import {
  submitReview,
  fetchMyReviews,
  selectReviewLoading,
  selectLastReward,
  selectMyReviews,
  clearLastReward,
} from '@/redux/slices/review.slice';
import { ReviewForm, Loading } from '@/components';
import { AuthGuard } from '@/guards';
import { MainLayout } from '@/layouts';
import { useToast } from '@/hooks';
import type { Bill, LineItem } from '@/types/order';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ReviewsPage = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const loading = useAppSelector(selectReviewLoading);
  const lastReward = useAppSelector(selectLastReward);
  const myReviews = useAppSelector(selectMyReviews);
  const [selectedProduct, setSelectedProduct] = useState<{
    product: LineItem;
    billId: number;
  } | null>(null);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchOrders({}));
    dispatch(fetchMyReviews());
  }, [dispatch]);

  useEffect(() => {
    if (lastReward) {
      setShowRewardDialog(true);
    }
  }, [lastReward]);

  // Get products that can be reviewed (from COMPLETED orders)
  const getReviewableProducts = (): Array<{ product: LineItem; bill: Bill }> => {
    const products: Array<{ product: LineItem; bill: Bill }> = [];

    // Tạo Set để check nhanh xem sản phẩm đã được đánh giá chưa
    // Key format: "productId-billId"
    const reviewedSet = new Set<string>();
    if (myReviews) {
      myReviews.forEach((review) => {
        reviewedSet.add(`${review.productId}-${review.billId}`);
      });
    }

    orders
      .filter((order) => order.status === 'COMPLETED')
      .forEach((order) => {
        order.items.forEach((item) => {
          // Filter: không hiển thị sản phẩm đã được đánh giá
          const reviewKey = `${item.product.id}-${order.id}`;
          const isAlreadyReviewed = reviewedSet.has(reviewKey) || item.isReviewed;

          if (!isAlreadyReviewed) {
            products.push({ product: item, bill: order });
          }
        });
      });

    return products;
  };

  const reviewableProducts = getReviewableProducts();

  const handleReviewClick = (product: LineItem, billId: number) => {
    setSelectedProduct({ product, billId });
  };

  const handleSubmitReview = async (data: { rating: number; description: string }) => {
    if (!selectedProduct) return;

    try {
      await dispatch(
        submitReview({
          productId: selectedProduct.product.product.id,
          billId: selectedProduct.billId,
          rating: data.rating,
          description: data.description,
        })
      ).unwrap();

      toast({
        title: 'Thành công!',
        description: 'Đánh giá của bạn đã được gửi',
      });

      setSelectedProduct(null);
      dispatch(fetchOrders({})); // Refresh orders
      dispatch(fetchMyReviews()); // Refresh my reviews để filter đúng
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error || 'Không thể gửi đánh giá',
      });
    }
  };

  const handleCloseRewardDialog = () => {
    setShowRewardDialog(false);
    dispatch(clearLastReward());
  };

  if (loading && reviewableProducts.length === 0) {
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
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                  Đánh giá sản phẩm
                </h1>
                <p className="text-muted-foreground">Chia sẻ trải nghiệm của bạn và nhận thưởng</p>
              </motion.div>
            </div>
          </section>

          <div className="container-custom py-12">
            {reviewableProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                  <Star className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2">Chưa có sản phẩm để đánh giá</h2>
                <p className="text-muted-foreground">
                  Hãy mua sắm và đánh giá sản phẩm để nhận thưởng nhé!
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviewableProducts.map(({ product, bill }, index) => (
                  <motion.div
                    key={`${bill.id}-${product.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-4">
                      {product.product.images && product.product.images.length > 0 && (
                        <img
                          src={product.product.images[0]}
                          alt={product.product.productName}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {product.product.productName}
                      </h3>
                      <div className="space-y-1 mb-4">
                        <p className="text-sm text-muted-foreground">Đơn hàng #{bill.orderId}</p>
                        <p className="text-xs text-muted-foreground">
                          Mã đơn: {bill.billCode}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ngày đặt: {new Date(bill.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleReviewClick(product, bill.id)}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        Đánh giá ngay
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review Dialog */}
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Đánh giá sản phẩm</DialogTitle>
              <DialogDescription>{selectedProduct?.product.product.productName}</DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="mt-4">
                <ReviewForm
                  productId={selectedProduct.product.product.id}
                  billId={selectedProduct.billId}
                  onSubmit={handleSubmitReview}
                  onCancel={() => setSelectedProduct(null)}
                  isSubmitting={loading}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reward Alert Dialog */}
        <AlertDialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Gift className="w-6 h-6 text-primary" />
                Chúc mừng! Bạn nhận được phần thưởng
              </AlertDialogTitle>
              <AlertDialogDescription className="pt-4">
                {lastReward?.type === 'VOUCHER' && lastReward.voucher && (
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                      <Gift className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Voucher giảm giá</h3>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                      <code className="text-2xl font-mono font-bold text-primary">
                        {lastReward.voucher.code}
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {lastReward.voucher.voucherType === 'PERCENTAGE'
                        ? `Giảm ${lastReward.voucher.discountValue}%`
                        : `Giảm ${lastReward.voucher.discountValue.toLocaleString('vi-VN')}₫`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Áp dụng cho đơn hàng từ{' '}
                      {lastReward.voucher.minOrderValue.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                )}
                {lastReward?.type === 'POINTS' && (
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                      <Award className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Điểm tích lũy</h3>
                    <p className="text-4xl font-bold text-yellow-600 mb-2">+{lastReward.points}</p>
                    <p className="text-sm text-muted-foreground">
                      điểm đã được thêm vào tài khoản của bạn
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleCloseRewardDialog}>Tuyệt vời!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </MainLayout>
    </AuthGuard>
  );
};

export default ReviewsPage;
