import {
  CartItem,
  Category,
  Coupon,
  Customer,
  Order,
  Product,
  Review,
  StoreSettings,
  SupportMessage,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_SUPPORT_MESSAGES,
} from './initialData';

const KEYS = {
  PRODUCTS: 'al_haram_v1_products',
  CATEGORIES: 'al_haram_v1_categories',
  CUSTOMERS: 'al_haram_v1_customers',
  ORDERS: 'al_haram_v1_orders',
  CART: 'al_haram_v1_cart',
  WISHLIST: 'al_haram_v1_wishlist',
  COUPONS: 'al_haram_v1_coupons',
  SETTINGS: 'al_haram_v1_settings',
  SUPPORT: 'al_haram_v1_support',
  REVIEWS: 'al_haram_v1_reviews',
  AUTH: 'al_haram_v1_auth',
  THEME: 'al_haram_v1_theme',
};

function safeGet<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('al_haram_storage_change'));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export const storageService = {
  // Initialization
  initDefaults(): void {
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      safeSet(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
    if (!localStorage.getItem(KEYS.CATEGORIES)) {
      safeSet(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    }
    if (!localStorage.getItem(KEYS.REVIEWS)) {
      safeSet(KEYS.REVIEWS, INITIAL_REVIEWS);
    }
    if (!localStorage.getItem(KEYS.COUPONS)) {
      safeSet(KEYS.COUPONS, INITIAL_COUPONS);
    }
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      safeSet(KEYS.SETTINGS, INITIAL_SETTINGS);
    }
    if (!localStorage.getItem(KEYS.CUSTOMERS)) {
      safeSet(KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    }
    if (!localStorage.getItem(KEYS.ORDERS)) {
      safeSet(KEYS.ORDERS, INITIAL_ORDERS);
    }
    if (!localStorage.getItem(KEYS.SUPPORT)) {
      safeSet(KEYS.SUPPORT, INITIAL_SUPPORT_MESSAGES);
    }
  },

  resetToDemo(): void {
    safeSet(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    safeSet(KEYS.CATEGORIES, INITIAL_CATEGORIES);
    safeSet(KEYS.REVIEWS, INITIAL_REVIEWS);
    safeSet(KEYS.COUPONS, INITIAL_COUPONS);
    safeSet(KEYS.SETTINGS, INITIAL_SETTINGS);
    safeSet(KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    safeSet(KEYS.ORDERS, INITIAL_ORDERS);
    safeSet(KEYS.SUPPORT, INITIAL_SUPPORT_MESSAGES);
    safeSet(KEYS.CART, []);
    safeSet(KEYS.WISHLIST, []);
    window.location.reload();
  },

  // Products
  getProducts(): Product[] {
    return safeGet<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  saveProducts(products: Product[]): void {
    safeSet(KEYS.PRODUCTS, products);
  },

  // Categories
  getCategories(): Category[] {
    return safeGet<Category[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },
  saveCategories(categories: Category[]): void {
    safeSet(KEYS.CATEGORIES, categories);
  },

  // Reviews
  getReviews(): Review[] {
    return safeGet<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  },
  saveReviews(reviews: Review[]): void {
    safeSet(KEYS.REVIEWS, reviews);
  },

  // Coupons
  getCoupons(): Coupon[] {
    return safeGet<Coupon[]>(KEYS.COUPONS, INITIAL_COUPONS);
  },
  saveCoupons(coupons: Coupon[]): void {
    safeSet(KEYS.COUPONS, coupons);
  },

  // Settings
  getSettings(): StoreSettings {
    const settings = safeGet<StoreSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
    let modified = false;
    // Automatically migrate if previous placeholder numbers were stored in localStorage
    if (
      settings.whatsappNumber === '+923001234567' ||
      settings.phone === '+92 42 35789123' ||
      !settings.whatsappNumber
    ) {
      settings.phone = '+92302-8088471';
      settings.whatsappNumber = '+92302-8088471';
      modified = true;
    }
    // Ensure heroVideo exists and has default properties
    if (!settings.heroVideo) {
      settings.heroVideo = INITIAL_SETTINGS.heroVideo;
      modified = true;
    } else if (
      settings.heroVideo.videoUrl.includes('Upgrade_website_homepage_design_38d0ff40_23e6a58e') ||
      !settings.heroVideo.videoUrl
    ) {
      settings.heroVideo.videoUrl =
        '/assets/aistudio/Add_hero_video_to_homepage_0d586848_aa5d6908.mp4';
      settings.heroVideo.posterUrl = '/assets/aistudio/hero_video_poster.jpg';
      modified = true;
    }
    // Ensure heroType is set
    if (!settings.heroType) {
      settings.heroType = 'chain';
      modified = true;
    }
    if (modified) {
      safeSet(KEYS.SETTINGS, settings);
    }
    return settings;
  },
  saveSettings(settings: StoreSettings): void {
    safeSet(KEYS.SETTINGS, settings);
  },

  // Orders
  getOrders(): Order[] {
    return safeGet<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
  },
  saveOrders(orders: Order[]): void {
    safeSet(KEYS.ORDERS, orders);
  },

  // Customers
  getCustomers(): Customer[] {
    return safeGet<Customer[]>(KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },
  saveCustomers(customers: Customer[]): void {
    safeSet(KEYS.CUSTOMERS, customers);
  },

  // Cart
  getCart(): CartItem[] {
    return safeGet<CartItem[]>(KEYS.CART, []);
  },
  saveCart(cart: CartItem[]): void {
    safeSet(KEYS.CART, cart);
  },

  // Wishlist
  getWishlist(): string[] {
    return safeGet<string[]>(KEYS.WISHLIST, []);
  },
  saveWishlist(ids: string[]): void {
    safeSet(KEYS.WISHLIST, ids);
  },

  // Support messages
  getSupportMessages(): SupportMessage[] {
    return safeGet<SupportMessage[]>(KEYS.SUPPORT, INITIAL_SUPPORT_MESSAGES);
  },
  saveSupportMessages(msgs: SupportMessage[]): void {
    safeSet(KEYS.SUPPORT, msgs);
  },

  // Auth session
  getAuth(): { user: Customer | null; token: string | null; isAdmin: boolean } {
    return safeGet(KEYS.AUTH, { user: null, token: null, isAdmin: false });
  },
  saveAuth(auth: { user: Customer | null; token: string | null; isAdmin: boolean }): void {
    safeSet(KEYS.AUTH, auth);
  },

  // Theme
  getTheme(): 'light' | 'dark' {
    return safeGet<'light' | 'dark'>(KEYS.THEME, 'light');
  },
  saveTheme(theme: 'light' | 'dark'): void {
    safeSet(KEYS.THEME, theme);
  },

  // Export & Import Database
  exportDatabaseJSON(): string {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      products: this.getProducts(),
      categories: this.getCategories(),
      orders: this.getOrders(),
      customers: this.getCustomers(),
      reviews: this.getReviews(),
      coupons: this.getCoupons(),
      settings: this.getSettings(),
      supportMessages: this.getSupportMessages(),
    };
    return JSON.stringify(data, null, 2);
  },

  importDatabaseJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products && Array.isArray(data.products)) this.saveProducts(data.products);
      if (data.categories && Array.isArray(data.categories)) this.saveCategories(data.categories);
      if (data.orders && Array.isArray(data.orders)) this.saveOrders(data.orders);
      if (data.customers && Array.isArray(data.customers)) this.saveCustomers(data.customers);
      if (data.reviews && Array.isArray(data.reviews)) this.saveReviews(data.reviews);
      if (data.coupons && Array.isArray(data.coupons)) this.saveCoupons(data.coupons);
      if (data.settings && typeof data.settings === 'object') this.saveSettings(data.settings);
      if (data.supportMessages && Array.isArray(data.supportMessages)) this.saveSupportMessages(data.supportMessages);
      window.location.reload();
      return true;
    } catch (err) {
      console.error('Failed to parse and import backup JSON:', err);
      return false;
    }
  },
};
