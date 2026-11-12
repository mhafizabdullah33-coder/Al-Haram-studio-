import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../storage/storageService';
import { CartItem, Coupon, Product } from '../types';
import { useStore } from './StoreContext';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  appliedCoupon: Coupon | null;
  deliveryCharges: number;
  grandTotal: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  // Actions
  addToCart: (product: Product, size: string, color: string, quantity?: number) => boolean;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, coupons, showToast } = useStore();
  const [cart, setCart] = useState<CartItem[]>(() => storageService.getCart());
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync cart changes to localStorage
  useEffect(() => {
    storageService.saveCart(cart);
  }, [cart]);

  // Totals calculations
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  // Discount calculation
  let discount = 0;
  if (appliedCoupon) {
    if (subtotal >= appliedCoupon.minOrderAmount) {
      if (appliedCoupon.type === 'percentage') {
        discount = Math.round((subtotal * appliedCoupon.value) / 100);
      } else {
        discount = Math.min(appliedCoupon.value, subtotal);
      }
    } else {
      // If subtotal dropped below min requirement, revoke
      // We can keep it or warn
    }
  }

  // Delivery charges
  const freeThreshold = settings.freeDeliveryThreshold || 4999;
  const baseDelivery = settings.deliveryCharges || 250;
  const deliveryCharges = subtotal === 0 || subtotal >= freeThreshold ? 0 : baseDelivery;
  const amountNeededForFreeDelivery = Math.max(0, freeThreshold - subtotal);

  const grandTotal = Math.max(0, subtotal - discount + deliveryCharges);

  const addToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: string,
    quantity: number = 1
  ): boolean => {
    if (product.stock <= 0) {
      showToast('Out of Stock', 'This product is currently unavailable.', 'error');
      return false;
    }

    const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;
    const existingIndex = cart.findIndex((item) => item.id === cartItemId);
    const unitPrice = product.salePrice ?? product.regularPrice;

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      const targetQty = currentQty + quantity;

      if (targetQty > product.stock) {
        showToast(
          'Maximum Stock Reached',
          `Only ${product.stock} items are available in stock.`,
          'warning'
        );
        return false;
      }

      const updated = [...cart];
      updated[existingIndex].quantity = targetQty;
      setCart(updated);
    } else {
      if (quantity > product.stock) {
        showToast('Insufficient Stock', `Only ${product.stock} items available.`, 'warning');
        return false;
      }
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        product,
        selectedSize,
        selectedColor,
        quantity,
        unitPrice,
      };
      setCart((prev) => [...prev, newItem]);
    }

    showToast('Added to Cart', `${product.name} (${selectedSize}) added to bag.`, 'success');
    return true;
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const item = cart.find((i) => i.id === cartItemId);
    if (item && newQty > item.product.stock) {
      showToast(
        'Stock Limit',
        `Cannot add more. Only ${item.product.stock} available.`,
        'warning'
      );
      return;
    }

    setCart((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity: newQty } : i))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    const item = cart.find((i) => i.id === cartItemId);
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    if (item) {
      showToast('Removed from Cart', `${item.product.name} was removed.`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    const found = coupons.find(
      (c) => c.code.toUpperCase() === cleanCode && c.isActive
    );

    if (!found) {
      showToast('Invalid Coupon', 'The promo code entered does not exist or is inactive.', 'error');
      return { success: false, message: 'Invalid or inactive promo code.' };
    }

    // Check expiry
    const today = new Date().toISOString().split('T')[0];
    if (found.expiryDate && found.expiryDate < today) {
      showToast('Coupon Expired', 'This promo code has expired.', 'error');
      return { success: false, message: 'This promo code has expired.' };
    }

    // Check usage limit
    if (found.usageLimit && found.usedCount >= found.usageLimit) {
      showToast('Limit Reached', 'This promo code has reached its maximum redemptions.', 'error');
      return { success: false, message: 'Promo code limit exceeded.' };
    }

    // Check min order amount
    if (subtotal < found.minOrderAmount) {
      const msg = `Minimum order amount of Rs. ${found.minOrderAmount.toLocaleString()} required for this coupon.`;
      showToast('Minimum Spend Required', msg, 'warning');
      return { success: false, message: msg };
    }

    setAppliedCoupon(found);
    showToast('Coupon Applied!', `Coupon "${found.code}" applied successfully.`, 'success');
    return { success: true, message: `Promo code ${found.code} applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Promo code removed from your order.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        discount,
        appliedCoupon,
        deliveryCharges,
        grandTotal,
        freeDeliveryThreshold: freeThreshold,
        amountNeededForFreeDelivery,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
