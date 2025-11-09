/**
 * Orders History Page
 * Display user's order history
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchOrders,
  selectOrders,
  selectOrderLoading,
} from '@/redux/slices/order.slice';
import { Button, Loading } from '@/components';
import { AuthGuard } from '@/guards';
import { MainLayout } from '@/layouts';

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const loading = useAppSelector(selectOrderLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return statusMap[status];
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
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
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
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
                        <h3 className="text-lg font-semibold mb-1">
                          Order {order.orderNumber}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-md border ${getStatusColor(order.status)}`}>
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
                        <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                      </div>
                      {order.trackingNumber && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                          <p className="text-sm font-mono">{order.trackingNumber}</p>
                        </div>
                      )}
                      {order.estimatedDelivery && order.status !== 'delivered' && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                          <p className="text-sm">
                            {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                      <p className="text-sm">
                        {order.shippingAddress.fullName}, {order.shippingAddress.address},{' '}
                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                        {order.shippingAddress.zipCode}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-3">
                      <Link to={`/orders/${order.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      {(order.status === 'pending' || order.status === 'confirmed') && (
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

