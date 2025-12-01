/**
 * Order/Bill Types
 */

export type Bill = {
  id: number;
  totalPrice: number;
  discount: number;
  paymentMethod: 'CASH' | 'CARD' | 'BANKING';
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  orderNumber: number;
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  customer: User;
  payment?: Payment;
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
  price: number;
  product: Product;
};

export type Product = {
  sizes: any;
  colors: any;
  name: any;
  id: number;
  productName: string;
  unitPrice: number;
  images: Image[];
};

export type Image = {
  id: number;
  url: string;
};
