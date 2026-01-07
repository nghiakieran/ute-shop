export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: ProductCategory;
  images: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  stock: number;
  featured: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
};

export type ProductSize = {
  id: string;
  name: string;
  value: string;
  available: boolean;
};

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
  available: boolean;
};

type ProductFilter = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
};

type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  size: ProductSize;
  color: ProductColor;
  addedAt: string;
};

type Cart = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

type Order = {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
};

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

type Address = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
};

type PaymentMethod = {
  type: 'card' | 'paypal' | 'cod';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
};

type Wishlist = {
  id: string;
  userId: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
};

export interface ConfigurationProduct {
  name: string;
  detail: string[];
}

export interface ProductPayload {
  productName: string;
  brandId: number;
  categoryId: number;
  description: string;
  originalPrice: number;
  unitPrice: number;
  productStatus: string;
  quantityStock: number;
  images: any[];
  oldImages?: string[];
  configurations?: ConfigurationProduct[];
}
