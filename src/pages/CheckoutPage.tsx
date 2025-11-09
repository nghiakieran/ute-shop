/**
 * Checkout Page
 * Collect shipping and payment details before placing an order
 */

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, ArrowLeft, Home } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartShipping,
  selectCartTax,
  selectCartTotal,
  clearCart,
} from '@/redux/slices/cart.slice';
import { selectUser } from '@/redux/slices/auth.slice';
import { Button, Input, Label } from '@/components';
import { MainLayout } from '@/layouts';
import { useToast } from '@/hooks';

type PaymentMethod = 'card' | 'cod';

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

  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shipping = useAppSelector(selectCartShipping);
  const tax = useAppSelector(selectCartTax);
  const total = useAppSelector(selectCartTotal);
  const user = useAppSelector(selectUser);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardDetails, setCardDetails] = useState(initialCardState);
  const [notes, setNotes] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  if (items.length === 0) {
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
              <h2 className="text-3xl font-serif font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground">
                Add some items to your cart before heading to checkout.
              </p>
            </div>
            <div className="space-y-3">
              <Link to="/products">
                <Button className="w-full">Browse Products</Button>
              </Link>
              <Link to="/cart">
                <Button variant="outline" className="w-full">
                  Go to Cart
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  const handleShippingChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in shippingInfo) {
      setShippingInfo((prev) => ({ ...prev, [name]: value }));
    } else {
      setNotes(value);
    }
  };

  const handlePaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value as PaymentMethod);
  };

  const handleCardChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPlacingOrder(true);

    setTimeout(() => {
      dispatch(clearCart());
      toast({
        title: 'Order placed successfully',
        description: 'Thank you for shopping with UTEShop!',
      });
      navigate('/orders');
    }, 800);
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
                  <Link to="/cart" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Cart
                  </Link>
                </p>
                <h1 className="text-3xl md:text-4xl font-serif font-bold">Checkout</h1>
                <p className="text-muted-foreground">Complete your purchase securely</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure payment powered by UTEShop</span>
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
                    <h2 className="text-lg font-semibold">Shipping Information</h2>
                    <p className="text-sm text-muted-foreground">
                      Provide your delivery details
                    </p>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        required
                        placeholder="+1 555 555 5555"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country/Region *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                      placeholder="123 Fashion Ave"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={notes}
                      onChange={handleShippingChange}
                      placeholder="Special delivery instructions, leave at the front desk, etc."
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
                    <h2 className="text-lg font-semibold">Payment Method</h2>
                    <p className="text-sm text-muted-foreground">
                      Choose how you want to pay
                    </p>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-primary shadow-sm bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Credit / Debit Card</span>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={handlePaymentChange}
                          className="accent-primary"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Visa, Mastercard, American Express
                      </p>
                    </label>

                    <label
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-primary shadow-sm bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Cash on Delivery</span>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={handlePaymentChange}
                          className="accent-primary"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Pay with cash when your order arrives
                      </p>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="name">Name on Card *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={cardDetails.name}
                          onChange={handleCardChange}
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="number">Card Number *</Label>
                        <Input
                          id="number"
                          name="number"
                          value={cardDetails.number}
                          onChange={handleCardChange}
                          required
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date *</Label>
                        <Input
                          id="expiry"
                          name="expiry"
                          value={cardDetails.expiry}
                          onChange={handleCardChange}
                          required
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC *</Label>
                        <Input
                          id="cvc"
                          name="cvc"
                          value={cardDetails.cvc}
                          onChange={handleCardChange}
                          required
                          placeholder="123"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  )}
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
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                  <p className="text-xs text-muted-foreground">
                    Review your items before placing the order
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4">
                      <div>
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.size.value} • {item.color.name} • Qty {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>

                <div className="bg-accent/30 text-accent-foreground rounded-lg p-3 text-xs flex gap-2 items-start">
                  <ShieldCheck className="w-4 h-4 mt-0.5" />
                  <span>Your payment is secured with encryption and 24/7 fraud monitoring.</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? 'Processing...' : 'Place Order'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By placing this order, you agree to our{' '}
                <span className="underline">Terms & Conditions</span> and{' '}
                <span className="underline">Privacy Policy</span>.
              </p>
            </motion.aside>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;


