import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle, Tag, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink, formatPrice } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    itemCount,
    subtotal,
    discount,
    appliedCoupon,
    deliveryCharges,
    grandTotal,
    amountNeededForFreeDelivery,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  const { settings } = useStore();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const itemsList = cart
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.product.name} (Size: ${i.selectedSize}, Color: ${i.selectedColor}) x ${i.quantity} = Rs. ${(i.unitPrice * i.quantity).toLocaleString()}`
      )
      .join('\n');

    const message = `Assalam-o-Alaikum Al-Haram Cloth Store!
I want to order via WhatsApp:

${itemsList}

Subtotal: Rs. ${subtotal.toLocaleString()}
${discount > 0 ? `Discount: -Rs. ${discount.toLocaleString()}\n` : ''}Delivery: ${deliveryCharges === 0 ? 'FREE' : `Rs. ${deliveryCharges}`}
Total Amount: Rs. ${grandTotal.toLocaleString()}

Please confirm availability and booking details.`;

    const url = buildWhatsAppLink(settings.whatsappNumber, message);
    window.open(url, '_blank');
  };

  const freeProgress = Math.min(
    100,
    Math.round(((settings.freeDeliveryThreshold - amountNeededForFreeDelivery) / settings.freeDeliveryThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
              <h3 className="font-serif-luxury font-bold text-lg text-stone-900 dark:text-stone-100">
                Shopping Bag ({itemCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          {cart.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/30 px-5 py-3 border-b border-amber-200/50 dark:border-amber-900/30">
              <div className="flex items-center justify-between text-xs font-medium text-amber-900 dark:text-amber-300 mb-1.5">
                {amountNeededForFreeDelivery > 0 ? (
                  <span>
                    Add <strong className="font-bold">{formatPrice(amountNeededForFreeDelivery, settings.currencySymbol)}</strong> more for <strong>FREE Delivery</strong>!
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    Congratulations! You qualified for FREE Delivery!
                  </span>
                )}
                <span>{freeProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-amber-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 transition-all duration-500"
                  style={{ width: `${freeProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100 dark:divide-stone-800/80">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Discover our luxury lawn, festive prêt, and royal unstitched collections.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="bg-emerald-950 hover:bg-emerald-900 text-amber-200 text-xs font-semibold px-6 py-2.5 rounded-xl border border-amber-500/40 shadow-md transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-3 first:pt-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-24 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200 dark:border-stone-800"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 p-0.5 transition shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span>Size: <strong className="text-stone-700 dark:text-stone-300">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-stone-700 dark:text-stone-300">{item.selectedColor}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-lg overflow-hidden bg-stone-50 dark:bg-stone-800">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-xs hover:bg-stone-200 dark:hover:bg-stone-700 transition"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-xs hover:bg-stone-200 dark:hover:bg-stone-700 transition"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-emerald-950 dark:text-emerald-300">
                        {formatPrice(item.unitPrice * item.quantity, settings.currencySymbol)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-3">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(discount, settings.currencySymbol)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Promo / Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 uppercase focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                  <button
                    type="submit"
                    className="text-xs font-semibold px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl transition"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, settings.currencySymbol)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discount, settings.currencySymbol)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryCharges === 0 ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">FREE</span>
                    ) : (
                      formatPrice(deliveryCharges, settings.currencySymbol)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span>Grand Total</span>
                  <span className="text-base text-emerald-950 dark:text-emerald-300">
                    {formatPrice(grandTotal, settings.currencySymbol)}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleProceedCheckout}
                  className="w-full bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-amber-500/40 shadow-lg transition"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  Order Bag via WhatsApp
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={clearCart}
                  className="text-[11px] text-stone-400 hover:text-rose-600 transition"
                >
                  Clear Bag
                </button>
                <span className="text-[10px] text-stone-400">
                  TCS / Leopard Nationwide Shipping
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
