/**
 * Mock Orders Data & API
 */

// Mock orders
export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    items: [],
    subtotal: 379.97,
    shipping: 0,
    tax: 37.99,
    total: 417.96,
    status: 'delivered',
    shippingAddress: {
      fullName: 'John Doe',
      phone: '+1234567890',
      address: '123 Fashion Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'John Doe',
      phone: '+1234567890',
      address: '123 Fashion Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    paymentMethod: {
      type: 'card',
      cardNumber: '**** **** **** 1234',
      cardHolder: 'JOHN DOE',
    },
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString(),
    estimatedDelivery: new Date('2024-02-22').toISOString(),
    trackingNumber: 'TRK123456789',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    items: [],
    subtotal: 229.99,
    shipping: 10,
    tax: 23.00,
    total: 262.99,
    status: 'processing',
    shippingAddress: {
      fullName: 'John Doe',
      phone: '+1234567890',
      address: '123 Fashion Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'John Doe',
      phone: '+1234567890',
      address: '123 Fashion Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    paymentMethod: {
      type: 'card',
      cardNumber: '**** **** **** 1234',
    },
    createdAt: new Date('2024-03-05').toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    items: [],
    subtotal: 159.99,
    shipping: 10,
    tax: 16.00,
    total: 185.99,
    status: 'pending',
    shippingAddress: {
      fullName: 'John Doe',
      phone: '+1234567890',
      address: '123 Fashion Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    billingAddress: {
      fullName: 'John Doe',
      phone: '+1234567890',
      address: '123 Fashion Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    paymentMethod: {
      type: 'cod',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockOrdersUtils = {
  /**
   * Get all orders for current user
   */
  getOrders: async (): Promise<Order[]> => {
    await delay(600);
    return MOCK_ORDERS;
  },

  /**
   * Get order by ID
   */
  getOrderById: async (id: string): Promise<Order | null> => {
    await delay(400);
    const order = MOCK_ORDERS.find(o => o.id === id);
    return order || null;
  },

  /**
   * Cancel order
   */
  cancelOrder: async (id: string): Promise<Order> => {
    await delay(500);
    const order = MOCK_ORDERS.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      throw new Error('Cannot cancel order in current status');
    }
    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    return order;
  },
};

