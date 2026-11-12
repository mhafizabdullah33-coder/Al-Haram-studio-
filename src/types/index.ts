export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  regularPrice: number;
  salePrice?: number;
  category: string;
  subCategory?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  images: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  fabric: string;
  pieces: string; // e.g. "3 Piece", "2 Piece", "1 Piece Unstitched"
  status: 'active' | 'draft' | 'out_of_stock';
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface CartItem {
  id: string; // Unique id combining productId + size + color
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
}

export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer';
export type PaymentStatus = 'unpaid' | 'pending_verification' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  total: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingNumber: string;
  customerName: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharges: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city?: string;
  address?: string;
  totalSpent: number;
  ordersCount: number;
  role: 'customer' | 'admin';
  createdAt: string;
  passwordHash?: string; // Simulated client-side hash
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g., 10 for 10% or 500 for Rs. 500
  minOrderAmount: number;
  expiryDate: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
}

export interface SupportMessage {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'open' | 'resolved';
  adminReply?: string;
  repliedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  openingHours: string;
  currency: string;
  currencySymbol: string;
  deliveryCharges: number;
  freeDeliveryThreshold: number;
  lowStockThreshold: number;
  socialLinks: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
  };
  announcementText: string;
  paymentInstructions: {
    jazzcash: string;
    easypaisa: string;
    bank: string;
  };
  heroType?: 'chain' | 'video';
  heroVideo?: HeroVideoSettings;
}

export interface HeroVideoSettings {
  enabled: boolean;
  videoUrl: string;
  posterUrl: string;
  heading: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  overlayOpacity: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
