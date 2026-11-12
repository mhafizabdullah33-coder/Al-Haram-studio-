import React, { useState } from 'react';
import {
  LayoutDashboard,
  Shirt,
  FolderTree,
  ShoppingBag,
  Users,
  BarChart3,
  Boxes,
  TicketPercent,
  Inbox,
  Star,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useOrders } from '../context/OrderContext';

export const AdminLayout: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const { theme, toggleTheme, products, supportMessages, resetToDemo } = useStore();
  const { orders } = useOrders();
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If not admin, block and show login gateway
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-950 p-4">
        <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            Access Restricted
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            The Al-Haram Administrative Console requires verified store manager credentials.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/admin/login"
              className="bg-emerald-950 text-amber-200 font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-wider border border-amber-500/40"
            >
              Sign In with Admin Account
            </Link>
            <Link to="/" className="text-xs text-stone-500 hover:underline">
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'pending').length;
  const lowStockCount = products.filter((p) => p.stock <= 10).length;
  const openMessagesCount = supportMessages.filter((m) => m.status === 'open').length;

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Shirt, badge: products.length },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : undefined,
      badgeColor: 'bg-amber-500 text-stone-950',
    },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    {
      name: 'Inventory',
      path: '/admin/inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} alert` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { name: 'Coupons', path: '/admin/coupons', icon: TicketPercent },
    {
      name: 'Support Inbox',
      path: '/admin/support',
      icon: Inbox,
      badge: openMessagesCount > 0 ? `${openMessagesCount}` : undefined,
      badgeColor: 'bg-emerald-600 text-white',
    },
    { name: 'Reviews Moderation', path: '/admin/reviews', icon: Star },
    { name: 'Settings & Backup', path: '/admin/settings', icon: Settings },
  ];

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to restore factory demo data? This will reset products, categories, reviews, and test orders.'
      )
    ) {
      resetToDemo();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col lg:flex-row text-stone-900 dark:text-stone-100">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-brand font-bold text-sm text-emerald-950 dark:text-emerald-400">
            AL-HARAM ADMIN
          </span>
        </div>
        <Link
          to="/"
          className="text-xs text-emerald-800 dark:text-emerald-400 flex items-center gap-1 font-semibold"
        >
          <span>Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-emerald-950 text-stone-200 p-5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 border-r border-emerald-900/60 shadow-2xl ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-black border border-amber-500/60 flex items-center justify-center font-brand font-bold text-amber-400 text-lg">
                AH
              </div>
              <div>
                <span className="font-brand font-bold text-sm tracking-widest text-white block">
                  AL-HARAM
                </span>
                <span className="text-[9px] uppercase tracking-wider text-amber-400 font-semibold">
                  Management Console
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links list */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                      : 'text-stone-300 hover:bg-emerald-900/80 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-emerald-900 text-stone-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-emerald-900 space-y-2 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-emerald-300 hover:text-white hover:bg-emerald-900 rounded-xl transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Storefront</span>
          </Link>

          <button
            onClick={handleResetData}
            className="w-full flex items-center gap-2 px-3 py-2 text-amber-300 hover:text-amber-200 hover:bg-emerald-900 rounded-xl transition text-[11px]"
            title="Reset to default 15 products and demo orders"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Database</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Top bar for desktop */}
        <div className="hidden lg:flex items-center justify-between pb-6 mb-6 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-stone-500">
              Live Store System Active • LocalStorage Database Synchronized
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-amber-500"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-emerald-950 hover:text-amber-200 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Storefront</span>
            </Link>
          </div>
        </div>

        {/* Nested Admin Page Outlet */}
        <Outlet />
      </main>
    </div>
  );
};
