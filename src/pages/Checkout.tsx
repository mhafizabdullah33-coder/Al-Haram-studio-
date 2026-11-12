import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MessageCircle,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { InvoiceModal } from '../components/common/InvoiceModal';
import { Order, PaymentMethod } from '../types';
import { buildWhatsAppLink, formatPrice } from '../utils/formatters';

const MAJOR_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Quetta',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Other City',
];

export const Checkout: React.FC = () => {
  const { cart, subtotal, discount, appliedCoupon, deliveryCharges, grandTotal } = useCart();
  const { placeOrder } = useOrders();
  const { settings, showToast } = useStore();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Form Fields
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || currentUser?.phone || '');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [city, setCity] = useState(currentUser?.city || 'Lahore');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionId, setTransactionId] = useState('');

  // Processing & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // If cart is empty and no confirmed order, redirect to shop
  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-luxury text-2xl font-bold">Your bag is empty</h2>
        <p className="text-stone-500 text-xs">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-emerald-950 text-amber-200 text-xs font-semibold px-6 py-2.5 rounded-xl border border-amber-500/40"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (sameAsPhone) {
      setWhatsapp(val);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      showToast('Incomplete Form', 'Please fill in all required shipping fields.', 'error');
      return;
    }

    if (paymentMethod !== 'cod' && !transactionId.trim()) {
      showToast(
        'Transaction ID Required',
        `Please provide the ${paymentMethod.toUpperCase()} Transaction ID or Reference.`,
        'warning'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await placeOrder({
        customerName: fullName,
        email,
        phone,
        whatsapp: sameAsPhone ? phone : whatsapp,
        city,
        address,
        orderNotes,
        paymentMethod,
        transactionId: transactionId.trim() || undefined,
      });

      setConfirmedOrder(order);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#064E3B', '#D4AF37', '#FAF9F6'],
        });
      } catch {
        // Safe fallback if canvas-confetti is unavailable
      }
    } catch (err) {
      console.error(err);
      showToast('Error Placing Order', 'Could not complete order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTracking = () => {
    if (!confirmedOrder) return;
    navigator.clipboard.writeText(confirmedOrder.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
    showToast('Copied!', 'Tracking ID copied to clipboard.');
  };

  // If order is confirmed, display Order Confirmation View!
  if (confirmedOrder) {
    const confirmWhatsAppMsg = `Assalam-o-Alaikum!
I have placed an order on AL-HARAM CLOTH STORE:

Order No: ${confirmedOrder.orderNumber}
Tracking ID: ${confirmedOrder.trackingNumber}
Customer: ${confirmedOrder.customerName}
Total Amount: Rs. ${confirmedOrder.total.toLocaleString()}
Payment Method: ${confirmedOrder.paymentMethod.toUpperCase()} ${
      confirmedOrder.transactionId ? `(TID: ${confirmedOrder.transactionId})` : ''
    }

Please confirm receipt and dispatch schedule.`;

    const whatsAppUrl = buildWhatsAppLink(settings.whatsappNumber, confirmWhatsAppMsg);

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 space-y-8 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-12 border border-stone-200 dark:border-stone-800 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
              Booking Confirmed
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
              Shukriya, {confirmedOrder.customerName}!
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Your order has been recorded in our dispatch system. We have sent booking confirmation
              to <strong className="text-stone-800 dark:text-stone-200">{confirmedOrder.email}</strong>.
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-stone-50 dark:bg-stone-800/80 p-6 rounded-2xl border border-stone-200/80 dark:border-stone-700 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 font-medium">Order Reference:</span>
              <p className="font-mono text-base font-bold text-stone-900 dark:text-stone-100">
                {confirmedOrder.orderNumber}
              </p>
            </div>
            <div>
              <span className="text-stone-400 font-medium">TCS Tracking ID:</span>
              <div className="flex items-center gap-2">
                <p className="font-mono text-base font-bold text-emerald-800 dark:text-emerald-400">
                  {confirmedOrder.trackingNumber}
                </p>
                <button
                  onClick={copyTracking}
                  className="p-1 text-stone-400 hover:text-stone-700 transition"
                  title="Copy Tracking ID"
                >
                  {copiedTracking ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <span className="text-stone-400 font-medium">Payment Mode:</span>
              <p className="font-semibold text-stone-800 dark:text-stone-200 uppercase">
                {confirmedOrder.paymentMethod} •{' '}
                <span className="text-emerald-700 dark:text-emerald-400 capitalize">
                  {confirmedOrder.paymentStatus}
                </span>
              </p>
            </div>
            <div>
              <span className="text-stone-400 font-medium">Total Paid / Payable:</span>
              <p className="font-bold text-base text-emerald-950 dark:text-emerald-300">
                {formatPrice(confirmedOrder.total, settings.currencySymbol)}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setInvoiceModalOpen(true)}
              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-semibold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Order Invoice</span>
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Send Summary on WhatsApp</span>
            </a>

            <Link
              to="/account?tab=tracking"
              className="w-full sm:w-auto bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-semibold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-amber-500/40 shadow transition"
            >
              <span>Track Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Invoice Modal */}
        <InvoiceModal
          order={confirmedOrder}
          onClose={() => setInvoiceModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Page Header */}
      <div>
        <nav className="text-xs text-stone-500 mb-2 flex items-center gap-1.5">
          <Link to="/cart" className="hover:text-stone-800">
            Shopping Bag
          </Link>
          <span>/</span>
          <span className="text-emerald-950 dark:text-emerald-400 font-semibold">Checkout</span>
        </nav>
        <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Secure Shipping & Checkout
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Please enter your delivery destination details to finalize order booking.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: Shipping Details + Payment Method */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Contact & Shipping Information */}
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                <Truck className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100">
                  1. Shipping & Customer Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Full Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Malik / Hamza Khan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ayesha.m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Phone Number (for courier delivery) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      WhatsApp Number
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-stone-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsPhone}
                        onChange={(e) => {
                          setSameAsPhone(e.target.checked);
                          if (e.target.checked) setWhatsapp(phone);
                        }}
                        className="rounded text-emerald-800"
                      />
                      <span>Same as Phone</span>
                    </label>
                  </div>
                  {!sameAsPhone && (
                    <input
                      type="tel"
                      placeholder="WhatsApp contact for parcel updates"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Destination City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    {MAJOR_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Complete Street Address (House/Apartment #, Block, Area) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. House 42, Street 8, Sector F-7/2, Near Kohsar Market"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call before arrival, leave with security"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selection */}
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                <CreditCard className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100">
                  2. Payment Method
                </h3>
              </div>

              {/* Payment Methods Radio Group */}
              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-800'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-emerald-800 focus:ring-emerald-700"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Pay cash directly to the TCS / Leopard courier officer upon inspecting the
                      parcel seal.
                    </p>
                  </div>
                </label>

                {/* JazzCash */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'jazzcash'
                      ? 'border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-800'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="jazzcash"
                    checked={paymentMethod === 'jazzcash'}
                    onChange={() => setPaymentMethod('jazzcash')}
                    className="mt-1 text-emerald-800 focus:ring-emerald-700"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      JazzCash Mobile Wallet
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {settings.paymentInstructions.jazzcash}
                    </p>
                  </div>
                </label>

                {/* EasyPaisa */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'easypaisa'
                      ? 'border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-800'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="easypaisa"
                    checked={paymentMethod === 'easypaisa'}
                    onChange={() => setPaymentMethod('easypaisa')}
                    className="mt-1 text-emerald-800 focus:ring-emerald-700"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      EasyPaisa Mobile Account
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {settings.paymentInstructions.easypaisa}
                    </p>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-800'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-1 text-emerald-800 focus:ring-emerald-700"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      Direct Bank Transfer (Meezan Islamic Banking)
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {settings.paymentInstructions.bank}
                    </p>
                  </div>
                </label>
              </div>

              {/* Transaction ID input for online transfers */}
              {paymentMethod !== 'cod' && (
                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2 animate-in fade-in duration-200">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Transaction ID / Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TID-98214710294 or Bank Ref #"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-amber-400 bg-amber-50/30 dark:bg-stone-800 font-mono focus:outline-none"
                  />
                  <p className="text-[10px] text-stone-400">
                    Your order will be set to &quot;Pending Verification&quot; and confirmed once our
                    accounts team validates the reference.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Order Summary & Place Order Button */}
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl space-y-6 sticky top-28">
            <h3 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800">
              Order Review ({cart.length} items)
            </h3>

            {/* Cart Items Mini List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-stone-100 dark:divide-stone-800">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-12 h-14 object-cover rounded-lg bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {item.selectedSize} • {item.selectedColor} • Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {formatPrice(item.unitPrice * item.quantity, settings.currencySymbol)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300 pt-3 border-t border-stone-100 dark:border-stone-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, settings.currencySymbol)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 dark:text-emerald-400 font-semibold">
                  <span>Discount ({appliedCoupon?.code || 'PROMO'})</span>
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
              <div className="flex justify-between text-base font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-800">
                <span>Grand Total</span>
                <span className="text-xl text-emerald-950 dark:text-emerald-300">
                  {formatPrice(grandTotal, settings.currencySymbol)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-950 hover:bg-emerald-900 disabled:bg-stone-300 text-amber-200 font-bold py-4 px-6 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-amber-500/40 shadow-xl transition"
              >
                {isSubmitting ? (
                  <span>Processing Booking...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-[10px] text-stone-500 space-y-1">
                <p className="flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Al-Haram Protection Guarantee
                </p>
                <p>
                  Your order is booked directly into our centralized store database. You will
                  receive an instant order tracking number upon submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
