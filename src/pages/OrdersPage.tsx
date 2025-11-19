/**
 * Orders History Page
 * Display user's order history
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchOrders, selectOrders, selectOrderLoading } from '@/redux/slices/order.slice';
import { Button, Loading } from '@/components';
import { AuthGuard } from '@/guards';
import { MainLayout } from '@/layouts';
import type { Bill } from '@/types/order';

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const loading = useAppSelector(selectOrderLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'Pending',
      PAID: 'Paid',
      CANCELLED: 'Cancelled',
    };
    return statusMap[status] || status;
  };

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
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Order History</h1>
                <p className="text-muted-foreground">View and track your orders</p>
              </motion.div>
            </div>
          </section>

          <div className="container-custom py-12">
            {orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                <Link to="/products">
                  <Button>Browse Products</Button>
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-lg border border-border overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">Order {order.orderNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            Placed on{' '}
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-md border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="font-medium text-sm">
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                          <p className="text-lg font-bold">${order.totalPrice.toFixed(2)}</p>
                        </div>
                        {order.discount > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Discount</p>
                            <p className="text-sm">${order.discount.toFixed(2)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                          <p className="text-sm">{order.paymentMethod}</p>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {(order.address || order.phone) && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-1">Shipping Info</p>
                          <p className="text-sm">
                            {order.address && `${order.address}`}
                            {order.phone && `, ${order.phone}`}
                          </p>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="flex gap-3">
                        <Link to={`/orders/${order.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Details
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                        {order.status === 'PENDING' && (
                          <Button variant="destructive" className="flex-1">
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
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

export default OrdersPage;
