/**
 * Shopping Cart Page
 * Display cart items and checkout summary
 */

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartShipping,
  selectCartTax,
  selectCartTotal,
  selectCartItemCount,
  removeFromCart,
  updateQuantity,
  clearCart,
  setVoucher,
  selectSelectedVoucher,
  selectVoucherDiscount,
} from '@/redux/slices/cart.slice';
import { getValidVouchers, applyVoucher } from '@/utils/voucher.api';
import type { Voucher } from '@/types/voucher';
import { useState, useEffect } from 'react';
import { Button } from '@/components';
import { useToast } from '@/hooks';
import { MainLayout } from '@/layouts';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shipping = useAppSelector(selectCartShipping);
  const tax = useAppSelector(selectCartTax);
  const total = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);
  const selectedVoucher = useAppSelector(selectSelectedVoucher);
  const voucherDiscount = useAppSelector(selectVoucherDiscount);

  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const data = await getValidVouchers();
      setVouchers(data);
    } catch (error) {
      console.error('Failed to fetch vouchers', error);
    }
  };

  const handleVoucherChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    if (!code) {
      dispatch(setVoucher(null));
      return;
    }

    try {
      const result = await applyVoucher(code, subtotal);
      dispatch(setVoucher({ voucher: result.voucher, discount: result.discountAmount }));
      toast({
        title: 'Áp dụng voucher thành công',
        description: `Đã giảm ${result.discountAmount.toLocaleString('vi-VN')}đ`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Không thể áp dụng voucher',
        description: error.response?.data?.message || 'Có lỗi xảy ra',
      });
      // Reset selection if failed
      e.target.value = '';
    }
  };

  const handleRemoveItem = (cartItemId: number) => {
    dispatch(removeFromCart(cartItemId));
    toast({
      title: 'Xóa sản phẩm',
      description: 'Sản phẩm đã được xóa khỏi giỏ hàng',
    });
  };

  const handleUpdateQuantity = (cartItemId: number, quantity: number) => {
    dispatch(updateQuantity({ cartItemId, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast({
      title: 'Đã xóa giỏ hàng',
      description: 'Tất cả sản phẩm đã được xóa khỏi giỏ hàng',
    });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-muted-foreground mb-6">Thêm sản phẩm để bắt đầu mua sắm</p>
          </div>
          <Button onClick={() => navigate('/products')}>Tiếp tục mua sắm</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-secondary py-12">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Giỏ hàng</h1>
                <p className="text-muted-foreground">
                  {itemCount} {itemCount === 1 ? 'sản phẩm' : 'sản phẩm'} trong giỏ hàng
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="hidden md:inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Tiếp tục mua sắm
              </button>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Clear Cart Button */}
              <div className="flex justify-end mb-4">
                <Button variant="ghost" size="sm" onClick={handleClearCart}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa giỏ hàng
                </Button>
              </div>

              {/* Items List */}
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-card rounded-lg p-4 md:p-6 flex gap-4"
                >
                  {/* Product Image */}
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="w-24 h-32 md:w-32 md:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={item.product.images?.[0]?.url || 'https://via.placeholder.com/200'}
                      alt={item.product.productName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link
                          to={`/products/${item.product.slug}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.product.productName}
                        </Link>
                        {item.product.discountDetail &&
                          item.product.discountDetail.percentage > 0 && (
                            <p className="text-sm text-destructive mt-1">
                              -{item.product.discountDetail.percentage}% OFF
                            </p>
                          )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-md border border-border hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4 mx-auto" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.quantityStock}
                          className="w-8 h-8 rounded-md border border-border hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {item.itemTotal.toLocaleString('vi-VN')}₫
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            {item.product.unitPrice.toLocaleString('vi-VN')}₫ mỗi sản phẩm
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 sticky top-24 space-y-6">
                <h2 className="text-xl font-serif font-bold">Tóm tắt đơn hàng</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="font-medium">{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'MIỄN PHÍ' : `${shipping.toLocaleString('vi-VN')}₫`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thuế</span>
                    <span className="font-medium">{tax.toLocaleString('vi-VN')}₫</span>
                  </div>

                  {/* Voucher Selection */}
                  <div className="pt-2">
                    <label className="text-sm font-medium mb-1 block">Mã giảm giá</label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onChange={handleVoucherChange}
                      value={selectedVoucher?.code || ''}
                    >
                      <option value="">Chọn mã giảm giá</option>
                      {vouchers.map((voucher) => (
                        <option
                          key={voucher.id}
                          value={voucher.code}
                          disabled={subtotal < (voucher.minOrderValue || 0)}
                        >
                          {voucher.code} - Giảm {voucher.type === 'PERCENTAGE' ? voucher.value + '%' : voucher.value.toLocaleString('vi-VN') + 'đ'}
                          {subtotal < (voucher.minOrderValue || 0) &&
                            ` (Đơn tối thiểu ${voucher.minOrderValue?.toLocaleString('vi-VN')}đ)`}
                        </option>
                      ))}
                    </select>
                    {voucherDiscount > 0 && (
                      <div className="flex justify-between mt-2 text-green-600">
                        <span className="text-sm">Giảm giá</span>
                        <span className="font-medium">-{voucherDiscount.toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-3 flex justify-between text-lg">
                    <span className="font-bold">Tổng cộng</span>
                    <span className="font-bold">{total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                {shipping === 0 ? (
                  <div className="bg-accent/50 text-accent-foreground p-3 rounded-md text-sm">
                    🎉 Bạn được miễn phí vận chuyển!
                  </div>
                ) : (
                  <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
                    Thêm {(500000 - subtotal).toLocaleString('vi-VN')}₫ để được miễn phí vận chuyển
                  </div>
                )}

                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Tiến hành thanh toán
                </Button>

                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
