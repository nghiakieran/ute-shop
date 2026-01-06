/**
 * Order/Bill Types
 */

export type Bill = {
  id: number;
  total: number;
  discount: number;
  paymentMethod: 'CASH' | 'CARD' | 'BANKING';
  status: 'PENDING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'COMPLETED' | 'CANCELLED';
  billCode: string;
  orderId: number;
  receiverName: string | null;
  receiverPhone: string | null;
  shippingAddress: string | null;
  note: string | null;
  createdAt: string;
  items: LineItem[];
};

export type User = {
  id: number;
  email: string;
  fullName: string;
};

export type Payment = {
  id: number;
  amount: number;
  status: string;
};

export type LineItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  isReviewed: boolean;
  product: Product;
};

export type Product = {
  id: number;
  productName: string;
  slug: string;
  images: string[];
};

export type Image = {
  id: number;
  url: string;
};

export type CheckoutData = {
  userId: number;
  items: CheckoutItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
};

export type CheckoutItem = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
  image: string | null;
};

export type CreateOrderPayload = {
  paymentMethod: 'CASH' | 'CARD' | 'BANKING';
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  note?: string;
};

export type CreateOrderResponse = {
  success?: boolean;
  message: string;
  billId?: number;
  billCode?: string;
  paymentUrl?: string;
};

export type OrderLineItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    productName: string;
    slug: string;
    unitPrice: number;
    quantityStock: number;
  };
};
export type AdminBill = {
  id: number;
  total: number;
  discount: number;
  paymentMethod: 'CASH' | 'CARD' | 'BANKING';
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  billCode: string;
  orderId: number;
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: number;
    email: string;
    fullName: string;
  };
  payment: {
    id: number;
    paymentStatus: string;
    paymentMethod: string;
  };
  items: LineItem[];
};

export interface GetAdminOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface GetAdminOrdersResponse {
  data: AdminBill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
