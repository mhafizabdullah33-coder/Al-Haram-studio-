import React, { useState } from 'react';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  MessageCircle,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppLink, formatPrice } from '../utils/formatters';

export const Cart: React.FC = () => {
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
  } = useCart();

  const { settings, products } = useStore();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) setCouponInput('');
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

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif-luxury text-3xl font-bold text-stone-900 dark:text-stone-100">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-stone-500 text-sm max-w-md mx-auto">
            You have not added any designer lawn, silk, or stitched prêt articles to your bag yet.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-emerald-950 text-amber-200 font-bold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider border border-amber-500/40 shadow-xl hover:bg-emerald-900 transition"
        >
          <span>Explore Festive Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review your selected garments ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 self-start sm:self-center"
        >
          <Trash2 className="w-4 h-4" /> Clear Shopping Bag
        </button>
      </div>

      {/* Free Delivery Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-300">
          {amountNeededForFreeDelivery > 0 ? (
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Add <strong>{formatPrice(amountNeededForFreeDelivery, settings.currencySymbol)}</strong> more to get <strong>FREE Express Delivery</strong>!
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4" />
              You qualify for FREE TCS Express Nationwide Delivery!
            </span>
          )}
          <span>{freeProgress}%</span>
        </div>
        <div className="w-full h-2 bg-amber-200 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 transition-all duration-500"
            style={{ width: `${freeProgress}%` }}
          />
        </div>
      </div>

      {/* Cart Layout: Items List + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 shadow-sm overflow-hidden">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200 dark:border-stone-800"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {item.product.fabric}
                    </span>
                    <Link
                      to={`/product/${item.product.id}`}
                      className="font-serif-luxury font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 hover:text-emerald-800 transition line-clamp-1 block"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span>
                        Size: <strong className="text-stone-700 dark:text-stone-300">{item.selectedSize}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Color: <strong className="text-stone-700 dark:text-stone-300">{item.selectedColor}</strong>
                      </span>
                    </div>
                    <p className="text-xs font-mono text-stone-400">SKU: {item.product.sku}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-stone-100 dark:border-stone-800">
                  {/* Stepper */}
                  <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-800">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-xs hover:bg-stone-200 dark:hover:bg-stone-700 transition"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-xs hover:bg-stone-200 dark:hover:bg-stone-700 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <p className="text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-300">
                      {formatPrice(item.unitPrice * item.quantity, settings.currencySymbol)}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {formatPrice(item.unitPrice, settings.currencySymbol)} each
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-rose-600 p-1.5 transition rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-stone-500 pt-2">
            <Link to="/shop" className="hover:text-emerald-800 dark:hover:text-emerald-400 underline">
              ← Continue Shopping for other articles
            </Link>
            <span>Prices are inclusive of standard GST</span>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-xl space-y-6">
          <h3 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800">
            Order Summary
          </h3>

          {/* Promo Code Form */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Have a Promo Code?
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 px-3.5 py-2.5 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <Tag className="w-4 h-4" />
                  <span>
                    Coupon <strong>{appliedCoupon.code}</strong> Applied (-{formatPrice(discount, settings.currencySymbol)})
                  </span>
                </div>
                <button onClick={removeCoupon} className="text-stone-400 hover:text-rose-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 uppercase focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Breakdown */}
          <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-800">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {formatPrice(subtotal, settings.currencySymbol)}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-800 dark:text-emerald-400 font-semibold">
                <span>Promotional Discount</span>
                <span>-{formatPrice(discount, settings.currencySymbol)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Nationwide Shipping</span>
              <span>
                {deliveryCharges === 0 ? (
                  <span className="text-emerald-800 dark:text-emerald-400 font-bold">FREE</span>
                ) : (
                  formatPrice(deliveryCharges, settings.currencySymbol)
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-stone-900 dark:text-stone-100 pt-3 border-t border-stone-200 dark:border-stone-800">
              <span>Grand Total</span>
              <span className="text-xl text-emerald-950 dark:text-emerald-300">
                {formatPrice(grandTotal, settings.currencySymbol)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-amber-500/40 shadow-xl transition"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-3 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Instant Order via WhatsApp</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Safe & Secure Local Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>TCS Express with real-time tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-700" />
              <span>7-Day Return & Exchange Promise</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
