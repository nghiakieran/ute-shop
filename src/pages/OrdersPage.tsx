/**
 * Orders History Page
 * Display user's order history
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Gift,
  Award,
  Truck,
  Search,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchOrders, selectOrders, selectOrderLoading } from '@/redux/slices/order.slice';
import {
  submitReview,
  selectReviewLoading,
  selectLastReward,
  clearLastReward,
} from '@/redux/slices/review.slice';
import { Button, Loading, ReviewForm } from '@/components';
import { AuthGuard } from '@/guards';
import { MainLayout } from '@/layouts';
import type { Bill, LineItem } from '@/types/order';
import { useToast } from '@/hooks';
import { cancelOrder, retryPayment } from '@/utils/order.api';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders) || [];
  const loading = useAppSelector(selectOrderLoading);
  const reviewLoading = useAppSelector(selectReviewLoading);
  const lastReward = useAppSelector(selectLastReward);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Bill | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{
    product: LineItem;
    billId: number;
  } | null>(null);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { toast } = useToast();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const params: any = {
      page: 1,
      limit: 10,
    };

    if (statusFilter !== 'ALL') {
      if (statusFilter === 'UNPAID') {
        // For UNPAID filter, we need to handle it differently
        // This will be filtered on client-side
      } else {
        params.status = statusFilter;
      }
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    dispatch(fetchOrders(params));
  }, [dispatch, statusFilter, debouncedSearch]);

  useEffect(() => {
    if (lastReward) {
      setShowRewardDialog(true);
    }
  }, [lastReward]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Kiểm tra đơn hàng có thể thanh toán lại trong vòng 24h
  const canRetryPayment = (order: Bill) => {
    if (order.paymentMethod !== 'BANKING' || order.paymentStatus !== 'PENDING') {
      return false;
    }
    const createdTime = new Date(order.createdAt).getTime();
    const now = new Date().getTime();
    const hoursPassed = (now - createdTime) / (1000 * 60 * 60);
    return hoursPassed < 24;
  };

  // Tính thời gian còn lại để thanh toán
  const getTimeRemaining = (order: Bill) => {
    const createdTime = new Date(order.createdAt).getTime();
    const hoursRemaining = 24 - (currentTime - createdTime) / (1000 * 60 * 60);

    if (hoursRemaining <= 0) return 'Hết hạn';

    const hours = Math.floor(hoursRemaining);
    const minutes = Math.floor((hoursRemaining - hours) * 60);
    const seconds = Math.floor(((hoursRemaining - hours) * 60 - minutes) * 60);
    return `${hours}h ${minutes}ph ${seconds}s`;
  };

  const handleRetryPayment = async (billCode: string) => {
    try {
      const response = await retryPayment(billCode);

      if (response.data?.paymentUrl) {
        // Chuyển hướng đến trang thanh toán VNPay
        window.location.href = response.data.paymentUrl;
      } else {
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể tạo link thanh toán',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể tạo lại link thanh toán',
      });
    }
  };

  // Xử lý hủy đơn hàng
  const handleCancelOrder = async (order: Bill) => {
    setOrderToCancel(order);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    setCancellingOrderId(orderToCancel.id);
    try {
      const response = await cancelOrder(orderToCancel.id);

      toast({
        title: 'Thành công',
        description: response.message || 'Hủy đơn hàng thành công',
      });

      // Refresh orders with current filters
      const params: any = {};
      if (statusFilter !== 'ALL' && statusFilter !== 'UNPAID') {
        params.status = statusFilter;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      dispatch(fetchOrders(params));
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể hủy đơn hàng',
      });
    } finally {
      setCancellingOrderId(null);
      setOrderToCancel(null);
    }
  };

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
        variant: 'success',
        title: 'Thành công!',
        description: 'Đánh giá của bạn đã được gửi',
      });

      setSelectedProduct(null);
      // Refresh orders with current filters
      const params: any = {};
      if (statusFilter !== 'ALL' && statusFilter !== 'UNPAID') {
        params.status = statusFilter;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      dispatch(fetchOrders(params));
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'SHIPPING':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'UNPAID':
        return <CreditCard className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'SHIPPING':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'UNPAID':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'Chờ xác nhận',
      SHIPPING: 'Vận chuyển',
      CONFIRMED: 'Đã xác nhận',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
      UNPAID: 'Chưa thanh toán',
    };
    return statusMap[status] || status;
  };

  const getOrderStatus = (order: Bill): string => {
    if (order.paymentMethod === 'BANKING' && order.paymentStatus === 'PENDING') {
      return 'UNPAID';
    }
    return order.status;
  };

  const filteredOrders =
    statusFilter === 'UNPAID'
      ? orders.filter(
          (order) => order.paymentMethod === 'BANKING' && order.paymentStatus === 'PENDING'
        )
      : statusFilter === 'PENDING'
      ? orders.filter(
          (order) =>
            order.status === 'PENDING' &&
            !(order.paymentMethod === 'BANKING' && order.paymentStatus === 'PENDING')
        )
      : orders;
  const statusTabs = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'UNPAID', label: 'Chưa thanh toán' },
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'SHIPPING', label: 'Vận chuyển' },
    { value: 'PAID', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  if (loading && orders.length === 0) {
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
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Đơn hàng của tôi</h1>
                <p className="text-muted-foreground">Xem và quản lý đơn hàng của bạn</p>
              </motion.div>
            </div>
          </section>

          <div className="container-custom py-12">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn, tên sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                />
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="bg-card rounded-lg border border-border mb-6 overflow-hidden">
              <div className="flex overflow-x-auto">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setStatusFilter(tab.value)}
                    className={`flex-1 min-w-[120px] px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                      statusFilter === tab.value
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2">Chưa có đơn hàng nào</h2>
                <p className="text-muted-foreground mb-6">
                  Bắt đầu mua sắm để xem đơn hàng của bạn tại đây
                </p>
                <Link to="/products">
                  <Button>Xem sản phẩm</Button>
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order, index) => {
                  const orderStatus = getOrderStatus(order);
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-lg border border-border overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Order Status Bar */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${getStatusColor(
                                orderStatus
                              )}`}
                            >
                              {getStatusIcon(orderStatus)}
                              <span className="font-medium text-sm">
                                {getStatusText(orderStatus)}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Mã đơn:</span> {order.billCode}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleOrderDetails(order.id)}
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {expandedOrders.has(order.id) ? 'Thu gọn' : 'Chi tiết'}
                            {expandedOrders.has(order.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Products List */}
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-4 p-3 hover:bg-muted/30 rounded-lg transition-colors"
                            >
                              {item.product.images && item.product.images.length > 0 && (
                                <Link
                                  to={`/products/${item.product.slug}`}
                                  className="flex-shrink-0"
                                >
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.productName}
                                    className="w-20 h-20 rounded-md object-cover border border-border"
                                  />
                                </Link>
                              )}
                              <div className="flex-1 min-w-0">
                                <Link
                                  to={`/products/${item.product.slug}`}
                                  className="font-medium hover:text-primary line-clamp-2 mb-1 block"
                                >
                                  {item.product.productName}
                                </Link>
                                <p className="text-sm text-muted-foreground">
                                  Phân loại hàng: Mặc định
                                </p>
                                <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                              </div>
                              <div className="text-right flex flex-col justify-between items-end">
                                <div>
                                  <p className="text-sm text-muted-foreground line-through">
                                    {(item.unitPrice * 1.2).toLocaleString('vi-VN')}₫
                                  </p>
                                  <p className="font-semibold text-lg">
                                    {item.unitPrice.toLocaleString('vi-VN')}₫
                                  </p>
                                </div>
                                {order.status === 'PAID' && !item.isReviewed && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleReviewClick(item, order.id)}
                                    className="mt-2 h-8 text-xs"
                                  >
                                    Đánh Giá
                                  </Button>
                                )}
                                {order.status === 'PAID' && item.isReviewed && (
                                  <span className="text-xs text-muted-foreground mt-2">
                                    Đã đánh giá
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Summary and Actions */}
                        <div className="mt-6 pt-6 border-t border-border">
                          <div className="flex justify-end mb-4">
                            <div className="w-80 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tổng tiền hàng:</span>
                                <span>
                                  {order.items
                                    .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
                                    .toLocaleString('vi-VN')}
                                  ₫
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Phí vận chuyển:</span>
                                <span>0₫</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Giảm giá:</span>
                                  <span className="text-green-600">
                                    -{order.discount.toLocaleString('vi-VN')}₫
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between items-center pt-2 border-t border-border">
                                <span className="text-muted-foreground">Thành tiền:</span>
                                <span className="text-2xl font-bold text-primary">
                                  {order.total.toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                              {(() => {
                                let paymentMethodText = '';
                                if (order.paymentMethod === 'CASH') {
                                  paymentMethodText = 'Tiền mặt (COD)';
                                } else if (order.paymentMethod === 'CARD') {
                                  paymentMethodText = 'Thẻ (VNPay)';
                                } else {
                                  paymentMethodText = 'Chuyển khoản (VNPay)';
                                }
                                return (
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Phương thức thanh toán:</span>
                                    <span>{paymentMethodText}</span>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-3">
                            {order.status === 'PENDING' && order.paymentStatus !== 'PAID' && (
                              <Button
                                variant="destructive"
                                onClick={() => handleCancelOrder(order)}
                                disabled={cancellingOrderId === order.id}
                              >
                                {cancellingOrderId === order.id ? 'Đang hủy...' : 'Hủy Đơn Hàng'}
                              </Button>
                            )}
                            {canRetryPayment(order) && (
                              <Button onClick={() => handleRetryPayment(order.billCode)}>
                                <CreditCard className="w-4 h-4 mr-2" />
                                Thanh toán ngay
                              </Button>
                            )}
                            {order.status === 'PAID' && <Button variant="default">Mua Lại</Button>}
                          </div>

                          {/* Payment Warning for Banking Orders */}
                          {canRetryPayment(order) && (
                            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-800">
                                  Chờ thanh toán - Còn lại: {getTimeRemaining(order)}
                                </span>
                              </div>
                              <p className="text-xs text-yellow-700">
                                Vui lòng hoàn tất thanh toán trong vòng 24h kể từ khi đặt hàng
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Expandable Details Section */}
                        <AnimatePresence>
                          {expandedOrders.has(order.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-6 pt-6 border-t border-border">
                                <h4 className="font-semibold mb-4">Thông tin giao hàng</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {order.receiverName && (
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">
                                        Người nhận
                                      </p>
                                      <p className="text-sm font-medium">{order.receiverName}</p>
                                    </div>
                                  )}
                                  {order.receiverPhone && (
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">
                                        Số điện thoại
                                      </p>
                                      <p className="text-sm">{order.receiverPhone}</p>
                                    </div>
                                  )}
                                  {order.shippingAddress && (
                                    <div className="md:col-span-2">
                                      <p className="text-sm text-muted-foreground mb-1">
                                        Địa chỉ giao hàng
                                      </p>
                                      <p className="text-sm">{order.shippingAddress}</p>
                                    </div>
                                  )}
                                  {order.note && (
                                    <div className="md:col-span-2">
                                      <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                                      <p className="text-sm italic">{order.note}</p>
                                    </div>
                                  )}
                                  <div className="md:col-span-2">
                                    <p className="text-sm text-muted-foreground mb-1">
                                      Ngày đặt hàng
                                    </p>
                                    <p className="text-sm">
                                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <AlertDialog
          open={!!orderToCancel}
          onOpenChange={(open) => !open && setOrderToCancel(null)}
        >
          <AlertDialogContent className="bg-white dark:bg-gray-900">
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn hủy đơn hàng <strong>#{orderToCancel?.orderId}</strong>?
                <br />
                Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={cancellingOrderId !== null}>
                Không, giữ đơn hàng
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmCancelOrder}
                disabled={cancellingOrderId !== null}
                className="bg-destructive hover:bg-destructive/90"
              >
                {cancellingOrderId !== null ? 'Đang hủy...' : 'Có, hủy đơn hàng'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Review Dialog */}
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl bg-white ">
            <DialogHeader>
              <DialogTitle>Đánh giá sản phẩm</DialogTitle>
              <DialogDescription>{selectedProduct?.product.product.productName}</DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <ReviewForm
                productId={selectedProduct.product.product.id}
                billId={selectedProduct.billId}
                onSubmit={handleSubmitReview}
                onCancel={() => setSelectedProduct(null)}
                isSubmitting={reviewLoading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Reward Alert Dialog */}
        <AlertDialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
          <AlertDialogContent className="bg-white dark:bg-gray-900">
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

export default OrdersPage;
