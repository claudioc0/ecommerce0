export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  condition: 'new' | 'used' | 'excellent';
  brand?: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  isValid: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}