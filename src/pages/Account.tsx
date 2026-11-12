import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useStore } from '../context/StoreContext';
import { InvoiceModal } from '../components/common/InvoiceModal';
import { Order } from '../types';
import { formatDate, formatPrice } from '../utils/formatters';

export const Account: React.FC = () => {
  const { currentUser, login, signup, logout, updateProfile, changePassword } = useAuth();
  const { orders, findOrder } = useOrders();
  const { settings, showToast } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState<string>(tabParam);

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Signup states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupConfirmPass, setSignupConfirmPass] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Tracking tab states
  const [trackingInput, setTrackingInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Profile Edit states
  const [profileName, setProfileName] = useState(currentUser?.fullName || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileCity, setProfileCity] = useState(currentUser?.city || 'Lahore');
  const [profileAddress, setProfileAddress] = useState(currentUser?.address || '');

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Invoice modal
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.fullName);
      setProfilePhone(currentUser.phone);
      setProfileCity(currentUser.city || 'Lahore');
      setProfileAddress(currentUser.address || '');
    }
  }, [currentUser]);

  // Customer orders
  const customerOrders = currentUser
    ? orders.filter(
        (o) =>
          o.email.toLowerCase() === currentUser.email.toLowerCase() ||
          o.phone === currentUser.phone
      )
    : [];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPass.trim()) return;
    const res = await login(loginEmail, loginPass);
    if (!res.success) {
      showToast('Login Failed', res.message, 'error');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPass !== signupConfirmPass) {
      showToast('Password Mismatch', 'Passwords do not match.', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('Terms Required', 'Please accept the Terms & Conditions.', 'warning');
      return;
    }
    const res = await signup({
      fullName: signupName,
      email: signupEmail,
      phone: signupPhone,
      password: signupPass,
    });
    if (!res.success) {
      showToast('Signup Failed', res.message, 'error');
    }
  };

  const fillDemoCustomer = () => {
    setLoginEmail('ayesha.m@example.com');
    setLoginPass('customer123');
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    const found = findOrder(trackingInput.trim());
    if (found) {
      setTrackedOrder(found);
    } else {
      showToast('Order Not Found', 'No record matches this order or tracking number.', 'error');
      setTrackedOrder(null);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: profileName,
      phone: profilePhone,
      city: profileCity,
      address: profileAddress,
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    await changePassword(oldPassword, newPassword);
    setOldPassword('');
    setNewPassword('');
  };

  // If user is not logged in and not on tracking tab, show Auth Forms
  if (!currentUser && activeTab !== 'tracking') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-20 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-amber-400 font-brand font-bold text-xl flex items-center justify-center mx-auto shadow-md">
            AH
          </div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            {authMode === 'login'
              ? 'Customer Portal Login'
              : authMode === 'signup'
              ? 'Create an Account'
              : 'Recover Password'}
          </h1>
          <p className="text-xs text-stone-500">
            Access your orders, dispatch timelines, and wishlist.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2.5 rounded-xl transition ${
              authMode === 'login'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2.5 rounded-xl transition ${
              authMode === 'signup'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {authMode === 'login' && (
          <form
            onSubmit={handleLoginSubmit}
            className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Email Address</label>
              <input
                type="email"
                required
                placeholder="ayesha.m@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider border border-amber-500/40 shadow-lg transition"
            >
              Sign In
            </button>

            {/* Quick Demo Fill button */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="w-full py-2 bg-stone-100 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-700 dark:text-stone-300 rounded-xl text-[11px] font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Fill Demo Customer (Ayesha Malik)
              </button>
            </div>

            <p className="text-[10px] text-stone-400 text-center leading-relaxed">
              Note: LocalStorage client-side persistence mode. No passwords stored in external
              clouds.
            </p>
          </form>
        )}

        {/* Signup Form */}
        {authMode === 'signup' && (
          <form
            onSubmit={handleSignupSubmit}
            className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Fatima Khan"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="0300 1234567"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Password</label>
              <input
                type="password"
                required
                placeholder="Create secure password"
                value={signupPass}
                onChange={(e) => setSignupPass(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Confirm Password</label>
              <input
                type="password"
                required
                placeholder="Confirm password"
                value={signupConfirmPass}
                onChange={(e) => setSignupConfirmPass(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
              />
            </div>

            <label className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-emerald-800"
              />
              <span>I agree to Al-Haram’s Privacy Policy and 7-Day Exchange Terms.</span>
            </label>

            <button
              type="submit"
              className="w-full bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider border border-amber-500/40 shadow-lg transition"
            >
              Complete Registration
            </button>
          </form>
        )}

        {/* Forgot Password Simulator */}
        {authMode === 'forgot' && (
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl space-y-4">
            <h3 className="font-serif-luxury text-base font-bold text-stone-900 dark:text-stone-100">
              Reset Password
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Enter your registered customer email address to reset your client password.
            </p>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
            />
            <button
              onClick={() => {
                showToast(
                  'Password Link Sent',
                  'In production with SMTP, a reset link is sent. For prototype, please login with demo account.'
                );
                setAuthMode('login');
              }}
              className="w-full bg-stone-900 text-white font-semibold py-2.5 rounded-xl text-xs"
            >
              Send Reset Instructions
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className="w-full text-xs text-stone-500 hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    );
  }

  // Logged-in Customer View OR Tracking Tab
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Top Profile Header */}
      {currentUser && (
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 text-amber-300 font-brand text-2xl font-bold flex items-center justify-center shadow-md border border-amber-500/40">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {currentUser.fullName}
                </h1>
                <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Privilege Patron
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{currentUser.email}</p>
              <p className="text-xs text-stone-400">Phone: {currentUser.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-600 dark:text-stone-300 pt-3 sm:pt-0 border-t sm:border-0 border-stone-100 dark:border-stone-800 w-full sm:w-auto justify-between sm:justify-end">
            <div>
              <p className="font-bold text-base text-stone-900 dark:text-stone-100">
                {customerOrders.length}
              </p>
              <p className="text-[11px] text-stone-400">Total Orders</p>
            </div>
            <div>
              <p className="font-bold text-base text-emerald-900 dark:text-emerald-400">
                {formatPrice(currentUser.totalSpent || 0, settings.currencySymbol)}
              </p>
              <p className="text-[11px] text-stone-400">Lifetime Spending</p>
            </div>
            <button
              onClick={logout}
              className="text-rose-600 hover:text-rose-700 p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 transition flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Account Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 dark:border-stone-800 text-xs font-semibold">
        {currentUser && (
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'bg-emerald-950 text-amber-300 shadow'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({customerOrders.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('tracking')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'tracking'
              ? 'bg-emerald-950 text-amber-300 shadow'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Track Any Package</span>
        </button>

        {currentUser && (
          <>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
                activeTab === 'profile'
                  ? 'bg-emerald-950 text-amber-300 shadow'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Addresses & Details</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
                activeTab === 'security'
                  ? 'bg-emerald-950 text-amber-300 shadow'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security</span>
            </button>
          </>
        )}
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && currentUser && (
        <div className="space-y-4">
          {customerOrders.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
              <Package className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="font-serif-luxury text-lg font-bold">No orders found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                You haven&apos;t placed any orders with this account yet.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-emerald-950 text-amber-200 text-xs font-semibold px-6 py-2.5 rounded-xl border border-amber-500/40"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            customerOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
                  <div>
                    <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                      {ord.orderNumber}
                    </span>
                    <p className="text-[11px] text-stone-500">
                      Booked on {formatDate(ord.createdAt)} • Tracking:{' '}
                      <strong className="text-emerald-800 dark:text-emerald-400 font-mono">
                        {ord.trackingNumber}
                      </strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                    <button
                      onClick={() => setSelectedInvoiceOrder(ord)}
                      className="text-xs text-stone-700 dark:text-stone-300 hover:text-emerald-800 px-3 py-1 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Invoice
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img
                        src={it.image}
                        alt=""
                        className="w-12 h-14 object-cover rounded-lg bg-stone-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {it.productName}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Size: {it.size} • Color: {it.color} • Qty {it.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {formatPrice(it.total, settings.currencySymbol)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
                  <div className="text-stone-500">
                    Destination: <strong className="text-stone-700 dark:text-stone-300">{ord.city}</strong> (
                    {ord.paymentMethod.toUpperCase()})
                  </div>
                  <div className="font-bold text-sm text-emerald-950 dark:text-emerald-300">
                    Total: {formatPrice(ord.total, settings.currencySymbol)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Order Tracking Simulator */}
      {activeTab === 'tracking' && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl space-y-4">
            <h3 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100">
              Live Courier Tracking
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Enter your Order ID (e.g. <code>AHC-2026-1001</code>) or TCS Tracking Number (e.g.{' '}
              <code>TCS-89214730</code>) to view live fulfillment checkpoints.
            </p>

            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="AHC-2026-XXXX or TCS-XXXXXXXX"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="flex-1 text-xs px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
              <button
                type="submit"
                className="bg-emerald-950 hover:bg-emerald-900 text-amber-200 text-xs font-semibold px-6 py-3 rounded-xl border border-amber-500/40 shadow transition flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                Track
              </button>
            </form>
          </div>

          {/* Tracked Order Result View */}
          {trackedOrder && (
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                    {trackedOrder.orderNumber}
                  </span>
                  <p className="text-xs text-stone-500">
                    Consignee: {trackedOrder.customerName} • {trackedOrder.city}
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase self-start sm:self-center">
                  Status: {trackedOrder.orderStatus}
                </span>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                <div
                  className={`p-2 rounded-xl ${
                    ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(
                      trackedOrder.orderStatus
                    )
                      ? 'bg-emerald-900 text-amber-300 font-bold'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  1. Booked
                </div>
                <div
                  className={`p-2 rounded-xl ${
                    ['confirmed', 'processing', 'shipped', 'delivered'].includes(
                      trackedOrder.orderStatus
                    )
                      ? 'bg-emerald-900 text-amber-300 font-bold'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  2. Packed
                </div>
                <div
                  className={`p-2 rounded-xl ${
                    ['shipped', 'delivered'].includes(trackedOrder.orderStatus)
                      ? 'bg-emerald-900 text-amber-300 font-bold'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  3. In Transit
                </div>
                <div
                  className={`p-2 rounded-xl ${
                    trackedOrder.orderStatus === 'delivered'
                      ? 'bg-emerald-900 text-amber-300 font-bold'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  4. Delivered
                </div>
              </div>

              {/* Itemized preview */}
              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Parcel Contents ({trackedOrder.items.length} items):
                </p>
                {trackedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-stone-600 dark:text-stone-400">
                    <span>
                      {it.productName} ({it.size}) x {it.quantity}
                    </span>
                    <span className="font-bold">{formatPrice(it.total, settings.currencySymbol)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedInvoiceOrder(trackedOrder)}
                  className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold flex items-center gap-1.5 hover:underline"
                >
                  <Printer className="w-4 h-4" />
                  View Printable Tax Invoice
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Edit Profile */}
      {activeTab === 'profile' && currentUser && (
        <form
          onSubmit={handleSaveProfile}
          className="max-w-xl bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl space-y-4"
        >
          <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100">
            Personal & Shipping Details
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Full Name</label>
            <input
              type="text"
              required
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Phone</label>
            <input
              type="tel"
              required
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">City</label>
            <input
              type="text"
              required
              value={profileCity}
              onChange={(e) => setProfileCity(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Shipping Address</label>
            <textarea
              rows={2}
              required
              value={profileAddress}
              onChange={(e) => setProfileAddress(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider border border-amber-500/40 shadow transition"
          >
            Save Profile Changes
          </button>
        </form>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && currentUser && (
        <form
          onSubmit={handleChangePassword}
          className="max-w-md bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl space-y-4"
        >
          <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100">
            Change Account Password
          </h3>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">New Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition"
          >
            Update Password
          </button>
        </form>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
};
