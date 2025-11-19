/**
 * Order/Bill Types
 */

type Bill = {
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

type User = {
  id: number;
  email: string;
  fullName: string;
};

type Payment = {
  id: number;
  amount: number;
  status: string;
};

type LineItem = {
  id: number;
  quantity: number;
  price: number;
  product: Product;
};

type Product = {
  id: number;
  productName: string;
  unitPrice: number;
  images: Image[];
};

type Image = {
  id: number;
  url: string;
};
