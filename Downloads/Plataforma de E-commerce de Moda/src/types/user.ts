export interface UserMetrics{
  loyaltyPoints?: number;
  totalPurchases?: number;
  totalSpent?: number;
  referralCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: UserRole;
  plan?: string;
  preferences?: {
    newsletter: boolean;
    promotions: boolean;
  };
  createdAt: string;
  updatedAt: string;

   metrics?: UserMetrics;
}

export type UserRole = 
  | 'customer' 
  | 'premium_customer' 
  | 'seller' 
  | 'store_owner'
  | 'warehouse_manager' 
  | 'marketing_manager' 
  | 'customer_service' 
  | 'analyst' 
  | 'brand_partner' 
  | 'influencer' 
  | 'franchise_owner';

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  phone?: string;
  preferences?: {
    newsletter: boolean;
    promotions: boolean;
  };
}