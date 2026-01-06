/**
 * Checkout Page
 * Collect shipping and payment details before placing an order
 */

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, ArrowLeft, Home, Coins } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getCart, clearCart } from '@/redux/slices/cart.slice';
import { selectUser } from '@/redux/slices/auth.slice';
import { fetchMyPoints, selectLoyaltyPoints } from '@/redux/slices/review.slice';
import { Button, Input, Label, Loading } from '@/components';
import { MainLayout } from '@/layouts';
import { useToast } from '@/hooks';
import { getCheckoutData, createOrder } from '@/utils/order.api';
import type { CheckoutData, CreateOrderPayload } from '@/types/order';
import { vietnamLocations } from '@/data/vietnam-locations';

type PaymentMethod = 'CASH' | 'CARD' | 'BANKING';

const initialCardState = {
  name: '',
  number: '',
  expiry: '',
  cvc: '',
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const user = useAppSelector(selectUser);
  const loyaltyPoints = useAppSelector(selectLoyaltyPoints);

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [cardDetails, setCardDetails] = useState(initialCardState);
  const [note, setNote] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.fullName ?? '',
    phone: user?.phone ?? '',
    address: '',
    city: '',
    ward: '',
    district: '',
  });

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [availableDistricts, setAvailableDistricts] = useState<
    (typeof vietnamLocations)[0]['districts']
  >([]);
  const [availableWards, setAvailableWards] = useState<
    (typeof vietnamLocations)[0]['districts'][0]['wards']
  >([]);

  useEffect(() => {
    fetchCheckoutData();
    dispatch(fetchMyPoints());
  }, [dispatch]);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const data = await getCheckoutData();
      setCheckoutData(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load checkout data',
      });
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loading />
        </div>
      </MainLayout>
    );
  }

  if (!checkoutData || checkoutData.items.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 max-w-md bg-card p-10 rounded-2xl shadow-lg border border-border"
          >
            <div className="w-20 h-20 rounded-full bg-accent mx-auto flex items-center justify-center">
              <Home className="w-10 h-10 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2">Giỏ hàng của bạn đang trống</h2>
              <p className="text-muted-foreground">
                Thêm sản phẩm vào giỏ hàng trước khi thanh toán.
              </p>
            </div>
            <div className="space-y-3">
              <Link to="/products">
                <Button className="w-full">Xem sản phẩm</Button>
              </Link>
              <Link to="/cart">
                <Button variant="outline" className="w-full">
                  Về giỏ hàng
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  const handleShippingChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'note') {
      setNote(value);
    } else if (name === 'city') {
      setSelectedCity(value);
      const city = vietnamLocations.find((c) => c.name === value);
      setAvailableDistricts(city?.districts || []);
      setAvailableWards([]);
      setShippingInfo((prev) => ({ ...prev, city: value, district: '', ward: '' }));
    } else if (name === 'district') {
      setSelectedDistrict(value);
      const city = vietnamLocations.find((c) => c.name === selectedCity);
      const district = city?.districts.find((d) => d.name === value);
      setAvailableWards(district?.wards || []);
      setShippingInfo((prev) => ({ ...prev, district: value, ward: '' }));
    } else if (name in shippingInfo) {
      setShippingInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value as PaymentMethod);
  };

  const handleCardChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPlacingOrder(true);

    try {
      const fullAddress = `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`;

      const payload: CreateOrderPayload = {
        paymentMethod,
        receiverName: shippingInfo.fullName,
        receiverPhone: shippingInfo.phone,
        shippingAddress: fullAddress,
        note: note || undefined,
        loyaltyPointsUsed: usePoints && pointsToUse > 0 ? pointsToUse : undefined,
      };

      const response = await createOrder(payload);

      // Xóa giỏ hàng sau khi đặt hàng thành công
      await dispatch(clearCart()).unwrap();

      if (response.data.paymentUrl) {
        toast({
          title: 'Đặt hàng thành công',
          description: response.data.message || 'Đang chuyển đến trang thanh toán...',
        });
        window.location.href = response.data.paymentUrl;
      } else {
        toast({
          title: 'Đặt hàng thành công',
          description: response.data.message || `Đơn hàng #${response.data.billCode} đã được tạo`,
        });

        navigate('/orders');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Đặt hàng thất bại';
      toast({
        variant: 'destructive',
        title: 'Lỗi đặt hàng',
        description: errorMessage,
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-16">
        {/* Header */}
        <section className="bg-secondary py-12">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <p className="inline-flex items-center text-sm text-muted-foreground mb-2 gap-2">
                  <Link
                    to="/cart"
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại giỏ hàng
                  </Link>
                </p>
                <h1 className="text-3xl md:text-4xl font-serif font-bold">Thanh toán</h1>
                <p className="text-muted-foreground">Hoàn tất đơn hàng một cách an toàn</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span>Thanh toán an toàn được cung cấp bởi UTEShop</span>
              </div>
            </motion.div>
          </div>
        </section>

        <form onSubmit={handlePlaceOrder}>
          <div className="container-custom py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Forms */}
            <div className="lg:col-span-2 space-y-10">
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border shadow-sm"
              >
                <div className="p-6 border-b border-border flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold">Thông tin giao hàng</h2>
                    <p className="text-sm text-muted-foreground">
                      Cung cấp địa chỉ giao hàng của bạn
                    </p>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        required
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        required
                        placeholder="0912345678"
                        pattern="[0-9]{10}"
                        title="Vui lòng nhập số điện thoại 10 chữ số"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                      placeholder="123 Đường Nguyễn Văn Bảo"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                      <select
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Chọn Tỉnh/Thành phố</option>
                        {vietnamLocations.map((city) => (
                          <option key={city.code} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">Quận/Huyện *</Label>
                      <select
                        id="district"
                        name="district"
                        value={shippingInfo.district}
                        onChange={handleShippingChange}
                        required
                        disabled={!selectedCity}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Chọn Quận/Huyện</option>
                        {availableDistricts.map((district) => (
                          <option key={district.code} value={district.name}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward">Phường/Xã *</Label>
                      <select
                        id="ward"
                        name="ward"
                        value={shippingInfo.ward}
                        onChange={handleShippingChange}
                        required
                        disabled={!selectedDistrict}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Chọn Phường/Xã</option>
                        {availableWards.map((ward) => (
                          <option key={ward.code} value={ward.name}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú đơn hàng (Tùy chọn)</Label>
                    <textarea
                      id="notes"
                      name="note"
                      value={note}
                      onChange={handleShippingChange}
                      placeholder="Hướng dẫn giao hàng đặc biệt, để lại ở quầy lễ tân, v.v."
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border shadow-sm"
              >
                <div className="p-6 border-b border-border flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold">Phương thức thanh toán</h2>
                    <p className="text-sm text-muted-foreground">Chọn cách bạn muốn thanh toán</p>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'CASH'
                          ? 'border-primary shadow-sm bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Thanh toán khi nhận hàng</span>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="CASH"
                          checked={paymentMethod === 'CASH'}
                          onChange={handlePaymentChange}
                          className="accent-primary"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Thanh toán bằng tiền mặt khi nhận hàng
                      </p>
                    </label>

                    <label
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'BANKING'
                          ? 'border-primary shadow-sm bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Chuyển khoản ngân hàng</span>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="BANKING"
                          checked={paymentMethod === 'BANKING'}
                          onChange={handlePaymentChange}
                          className="accent-primary"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Chuyển khoản trực tiếp vào tài khoản ngân hàng của chúng tôi
                      </p>
                    </label>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Summary */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-xl border border-border shadow-sm h-fit sticky top-24 space-y-6 p-6"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">Tóm tắt đơn hàng</h2>
                  <p className="text-xs text-muted-foreground">
                    Xem lại sản phẩm trước khi đặt hàng
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {checkoutData.items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-2">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty {item.quantity} × {item.unitPrice.toLocaleString('vi-VN')}₫
                        </p>
                        <p className="text-sm font-semibold mt-1">
                          {item.itemTotal.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tạm tính</span>
                    <span className="font-medium">
                      {checkoutData.subtotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium">
                      {checkoutData.shipping === 0
                        ? 'MIỄN PHÍ'
                        : `${checkoutData.shipping.toLocaleString('vi-VN')}₫`}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Thuế (10%)</span>
                    <span className="font-medium">{checkoutData.tax.toLocaleString('vi-VN')}₫</span>
                  </div>
                  {checkoutData.discount > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Giảm giá</span>
                      <span className="font-medium">
                        -{checkoutData.discount.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  )}

                  {/* Sử dụng điểm tích lũy */}
                  {loyaltyPoints && loyaltyPoints.totalPoints > 0 && (
                    <div className="border-t border-border pt-4 mt-4 space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usePoints}
                          onChange={(e) => {
                            setUsePoints(e.target.checked);
                            if (e.target.checked) {
                              // Tự động set số điểm tối đa có thể dùng (không vượt quá tổng tiền)
                              const maxPoints = Math.min(
                                loyaltyPoints.totalPoints,
                                Math.floor(checkoutData.total / 1000)
                              );
                              setPointsToUse(maxPoints);
                            } else {
                              setPointsToUse(0);
                            }
                          }}
                          className="accent-primary"
                        />
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">
                            Sử dụng điểm tích lũy ({loyaltyPoints.totalPoints.toLocaleString('vi-VN')} điểm)
                          </span>
                        </div>
                      </label>
                      {usePoints && (
                        <div className="space-y-2 pl-6">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="pointsToUse" className="text-xs text-muted-foreground">
                              Số điểm muốn dùng (1 điểm = 1,000₫):
                            </Label>
                            <Input
                              id="pointsToUse"
                              type="number"
                              min={0}
                              max={Math.min(
                                loyaltyPoints.totalPoints,
                                Math.floor(checkoutData.total / 1000)
                              )}
                              value={pointsToUse}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                const maxPoints = Math.min(
                                  loyaltyPoints.totalPoints,
                                  Math.floor(checkoutData.total / 1000)
                                );
                                setPointsToUse(Math.min(value, maxPoints));
                              }}
                              className="w-24 h-8 text-sm"
                            />
                          </div>
                          {pointsToUse > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Giảm giá từ điểm:</span>
                              <span className="font-medium">
                                -{(pointsToUse * 1000).toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-3 flex justify-between text-lg">
                  <span className="font-bold">Tổng cộng</span>
                  <span className="font-bold">
                    {usePoints && pointsToUse > 0
                      ? (checkoutData.total - pointsToUse * 1000).toLocaleString('vi-VN')
                      : checkoutData.total.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                <div className="bg-accent/30 text-accent-foreground rounded-lg p-3 text-xs flex gap-2 items-start">
                  <ShieldCheck className="w-4 h-4 mt-0.5" />
                  <span>Thanh toán của bạn được bảo mật với mã hóa và giám sát gian lận 24/7.</span>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isPlacingOrder}>
                {isPlacingOrder ? 'Đang xử lý...' : 'Đặt hàng'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Bằng cách đặt hàng, bạn đồng ý với{' '}
                <span className="underline">Điều khoản & Điều kiện</span> và{' '}
                <span className="underline">Chính sách bảo mật</span> của chúng tôi.
              </p>
            </motion.aside>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
