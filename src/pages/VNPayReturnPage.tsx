/**
 * VNPay Return Page
 * Xử lý callback từ VNPay sau khi thanh toán
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { MainLayout } from '@/layouts';
import { Button } from '@/components';
import { apiClient } from '@/utils/api.utils';
import { useToast } from '@/hooks';

const VNPayReturnPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    bill?: {
      id: number;
      billCode: string;
      total?: number;
      status: string;
    };
  } | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const queryString = searchParams.toString();
        const response = await apiClient.get(
          `/ute-shop/api/client/bills/payment/vnpay-return?${queryString}`
        );

        setPaymentResult(response.data.data);

        if (response.data.data.success) {
          toast({
            title: 'Thanh toán thành công',
            description: response.data.data.message,
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Thanh toán thất bại',
            description: response.data.data.message,
          });
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xử lý thanh toán';
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: errorMessage,
        });
        setPaymentResult({
          success: false,
          message: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams, toast]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 p-8"
          >
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
            <h2 className="text-2xl font-serif font-bold">Đang xử lý thanh toán...</h2>
            <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-card rounded-2xl border border-border shadow-lg p-10 text-center space-y-6"
        >
          {paymentResult?.success ? (
            <>
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-serif font-bold text-green-600">
                  Thanh toán thành công!
                </h1>
                <p className="text-muted-foreground">{paymentResult.message}</p>
              </div>
              {paymentResult.bill && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mã đơn hàng:</span>
                    <span className="font-medium">{paymentResult.bill.billCode}</span>
                  </div>
                  {paymentResult.bill.total && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tổng tiền:</span>
                      <span className="font-medium">
                        {paymentResult.bill.total.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Trạng thái:</span>
                    <span className="font-medium text-green-600">
                      {paymentResult.bill.status === 'PAID'
                        ? 'Đã thanh toán'
                        : paymentResult.bill.status}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Button onClick={() => navigate('/orders')} className="flex-1">
                  Xem đơn hàng
                </Button>
                <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
                  Về trang chủ
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-serif font-bold text-red-600">Thanh toán thất bại</h1>
                <p className="text-muted-foreground">
                  {paymentResult?.message || 'Giao dịch không thành công'}
                </p>
              </div>
              {paymentResult?.bill && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mã đơn hàng:</span>
                    <span className="font-medium">{paymentResult.bill.billCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Trạng thái:</span>
                    <span className="font-medium text-red-600">
                      {paymentResult.bill.status === 'CANCELLED'
                        ? 'Đã hủy'
                        : paymentResult.bill.status}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Button onClick={() => navigate('/checkout')} className="flex-1">
                  Thử lại
                </Button>
                <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
                  Về trang chủ
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default VNPayReturnPage;
