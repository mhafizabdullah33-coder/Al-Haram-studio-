import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../storage/storageService';
import {
  Category,
  Coupon,
  Product,
  Review,
  StoreSettings,
  SupportMessage,
  ToastMessage,
} from '../types';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  coupons: Coupon[];
  settings: StoreSettings;
  supportMessages: SupportMessage[];
  wishlist: string[];
  toasts: ToastMessage[];
  theme: 'light' | 'dark';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  // Review actions
  addReview: (review: Omit<Review, 'id' | 'date' | 'status'>) => void;
  updateReviewStatus: (id: string, status: 'approved' | 'pending' | 'rejected') => void;
  deleteReview: (id: string) => void;
  // Coupon actions
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  // Settings actions
  updateSettings: (newSettings: StoreSettings) => void;
  // Support actions
  addSupportMessage: (msg: Omit<SupportMessage, 'id' | 'date' | 'status'>) => void;
  replySupportMessage: (id: string, reply: string) => void;
  resolveSupportMessage: (id: string) => void;
  // Wishlist actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Toast notifications
  showToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  // Theme
  toggleTheme: () => void;
  // Backup & Reset
  resetToDemo: () => void;
  exportDatabase: () => string;
  importDatabase: (json: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(() => storageService.getSettings());
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial load
  useEffect(() => {
    storageService.initDefaults();
    setProducts(storageService.getProducts());
    setCategories(storageService.getCategories());
    setReviews(storageService.getReviews());
    setCoupons(storageService.getCoupons());
    setSettings(storageService.getSettings());
    setSupportMessages(storageService.getSupportMessages());
    setWishlist(storageService.getWishlist());
    const storedTheme = storageService.getTheme();
    setTheme(storedTheme);
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Sync to localStorage
  const updateProductState = (newList: Product[]) => {
    setProducts(newList);
    storageService.saveProducts(newList);
  };

  const updateCategoryState = (newList: Category[]) => {
    setCategories(newList);
    storageService.saveCategories(newList);
  };

  const updateReviewState = (newList: Review[]) => {
    setReviews(newList);
    storageService.saveReviews(newList);
  };

  const updateCouponState = (newList: Coupon[]) => {
    setCoupons(newList);
    storageService.saveCoupons(newList);
  };

  const showToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    storageService.saveTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Products
  const addProduct = (item: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...item,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 0,
    };
    const updated = [newProduct, ...products];
    updateProductState(updated);
    showToast('Product Added', `${newProduct.name} has been added.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    updateProductState(updated);
    showToast('Product Updated', 'Product changes saved successfully.');
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    updateProductState(updated);
    showToast('Product Deleted', 'The product has been removed.');
  };

  // Categories
  const addCategory = (item: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...item,
      id: 'cat-' + Date.now(),
    };
    const updated = [...categories, newCat];
    updateCategoryState(updated);
    showToast('Category Created', `${newCat.name} was added.`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    updateCategoryState(updated);
    showToast('Category Updated', 'Category details updated.');
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    updateCategoryState(updated);
    showToast('Category Removed', 'The category has been removed.');
  };

  // Reviews
  const addReview = (review: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newReview: Review = {
      ...review,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending', // Requires admin approval
    };
    const updated = [newReview, ...reviews];
    updateReviewState(updated);
    showToast(
      'Review Submitted!',
      'Thank you! Your review is pending admin approval and will appear shortly.'
    );
  };

  const updateReviewStatus = (id: string, status: 'approved' | 'pending' | 'rejected') => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, status } : r));
    updateReviewState(updated);

    const targetRev = reviews.find((r) => r.id === id);
    if (targetRev) {
      const prodApproved = updated.filter(
        (r) => r.productId === targetRev.productId && r.status === 'approved'
      );
      if (prodApproved.length > 0) {
        const avg = prodApproved.reduce((sum, r) => sum + r.rating, 0) / prodApproved.length;
        setProducts((prev) => {
          const prods = prev.map((p) =>
            p.id === targetRev.productId
              ? { ...p, rating: Number(avg.toFixed(1)), reviewCount: prodApproved.length }
              : p
          );
          storageService.saveProducts(prods);
          return prods;
        });
      }
    }

    showToast('Review Updated', `Review marked as ${status}.`);
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    updateReviewState(updated);
    showToast('Review Removed', 'Review was deleted.');
  };

  // Coupons
  const addCoupon = (item: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...item,
      id: 'coup-' + Date.now(),
      usedCount: 0,
    };
    const updated = [newCoupon, ...coupons];
    updateCouponState(updated);
    showToast('Coupon Created', `Code ${newCoupon.code} is now live.`);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, ...updates } : c));
    updateCouponState(updated);
    showToast('Coupon Updated', 'Discount code updated.');
  };

  const deleteCoupon = (id: string) => {
    const updated = coupons.filter((c) => c.id !== id);
    updateCouponState(updated);
    showToast('Coupon Deleted', 'Coupon removed.');
  };

  // Settings
  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    showToast('Settings Saved', 'Store configuration successfully updated.');
  };

  // Support messages
  const addSupportMessage = (msg: Omit<SupportMessage, 'id' | 'date' | 'status'>) => {
    const newMsg: SupportMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'open',
    };
    const updated = [newMsg, ...supportMessages];
    setSupportMessages(updated);
    storageService.saveSupportMessages(updated);
    showToast('Message Sent!', 'Our team has received your inquiry and will reply shortly.');
  };

  const replySupportMessage = (id: string, reply: string) => {
    const updated = supportMessages.map((m) =>
      m.id === id
        ? {
            ...m,
            adminReply: reply,
            repliedAt: new Date().toISOString(),
            status: 'resolved' as const,
          }
        : m
    );
    setSupportMessages(updated);
    storageService.saveSupportMessages(updated);
    showToast('Reply Saved', 'Support ticket marked as resolved.');
  };

  const resolveSupportMessage = (id: string) => {
    const updated = supportMessages.map((m) =>
      m.id === id ? { ...m, status: 'resolved' as const } : m
    );
    setSupportMessages(updated);
    storageService.saveSupportMessages(updated);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    let next: string[];
    const product = products.find((p) => p.id === productId);
    if (wishlist.includes(productId)) {
      next = wishlist.filter((id) => id !== productId);
      showToast('Removed from Wishlist', product ? product.name : undefined, 'info');
    } else {
      next = [...wishlist, productId];
      showToast('Added to Wishlist', product ? product.name : undefined, 'success');
    }
    setWishlist(next);
    storageService.saveWishlist(next);
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const resetToDemo = () => {
    storageService.resetToDemo();
  };

  const exportDatabase = () => {
    return storageService.exportDatabaseJSON();
  };

  const importDatabase = (json: string) => {
    return storageService.importDatabaseJSON(json);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        reviews,
        coupons,
        settings,
        supportMessages,
        wishlist,
        toasts,
        theme,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addReview,
        updateReviewStatus,
        deleteReview,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        updateSettings,
        addSupportMessage,
        replySupportMessage,
        resolveSupportMessage,
        toggleWishlist,
        isInWishlist,
        showToast,
        removeToast,
        toggleTheme,
        resetToDemo,
        exportDatabase,
        importDatabase,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
