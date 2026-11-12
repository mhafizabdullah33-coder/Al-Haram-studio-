import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Phone,
  MessageCircle,
  Sun,
  Moon,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const { settings, wishlist, theme, toggleTheme, products } = useStore();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchResults = searchInput.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchInput.toLowerCase()) ||
            p.fabric.toLowerCase().includes(searchInput.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}`);
    setSearchOpen(false);
    setSearchInput('');
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-emerald-950 text-amber-200/90 text-[11px] sm:text-xs py-2 px-4 border-b border-amber-600/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="flex items-center gap-1.5 font-medium truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{settings.announcementText}</span>
          </p>

          <div className="hidden md:flex items-center gap-5 text-stone-300 text-[11px]">
            <a
              href={buildWhatsAppLink(
                settings.whatsappNumber,
                'Salam! I need assistance with AL-HARAM collections.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-300 transition text-[#25D366] font-semibold flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp: {settings.whatsappNumber}</span>
            </a>
            <span className="text-emerald-800">|</span>
            <Link
              to="/account?tab=tracking"
              className="hover:text-amber-300 transition text-stone-300"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-950 border border-amber-500/50 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <span className="font-brand text-amber-400 text-lg font-bold tracking-tighter">
                  AH
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-brand text-lg sm:text-xl font-bold tracking-widest text-emerald-950 dark:text-emerald-400 leading-none">
                  AL-HARAM
                </span>
                <span className="text-[10px] tracking-[0.25em] text-amber-700 dark:text-amber-500 font-semibold uppercase mt-0.5">
                  Cloth Store
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide text-stone-700 dark:text-stone-200">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `hover:text-emerald-800 dark:hover:text-emerald-400 transition ${
                    isActive ? 'text-emerald-900 dark:text-emerald-400 font-bold border-b-2 border-amber-500 pb-0.5' : ''
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `hover:text-emerald-800 dark:hover:text-emerald-400 transition ${
                    isActive ? 'text-emerald-900 dark:text-emerald-400 font-bold border-b-2 border-amber-500 pb-0.5' : ''
                  }`
                }
              >
                Shop All
              </NavLink>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `hover:text-emerald-800 dark:hover:text-emerald-400 transition ${
                    isActive ? 'text-emerald-900 dark:text-emerald-400 font-bold border-b-2 border-amber-500 pb-0.5' : ''
                  }`
                }
              >
                Categories
              </NavLink>
              <NavLink
                to="/shop?category=cat-women"
                className="hover:text-emerald-800 dark:hover:text-emerald-400 transition"
              >
                Women
              </NavLink>
              <NavLink
                to="/shop?category=cat-men"
                className="hover:text-emerald-800 dark:hover:text-emerald-400 transition"
              >
                Men
              </NavLink>
              <NavLink
                to="/shop?category=cat-unstitched"
                className="hover:text-emerald-800 dark:hover:text-emerald-400 transition"
              >
                Unstitched
              </NavLink>
              <NavLink
                to="/shop?category=cat-pret"
                className="hover:text-emerald-800 dark:hover:text-emerald-400 transition"
              >
                Prêt
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `hover:text-emerald-800 dark:hover:text-emerald-400 transition ${
                    isActive ? 'text-emerald-900 dark:text-emerald-400 font-bold border-b-2 border-amber-500 pb-0.5' : ''
                  }`
                }
              >
                About Us
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `hover:text-emerald-800 dark:hover:text-emerald-400 transition ${
                    isActive ? 'text-emerald-900 dark:text-emerald-400 font-bold border-b-2 border-amber-500 pb-0.5' : ''
                  }`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full text-stone-700 dark:text-stone-300 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                aria-label="Toggle Theme"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-full text-stone-700 dark:text-stone-300 hover:text-rose-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2.5 rounded-full text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-800 text-amber-300 text-[10px] font-bold rounded-full flex items-center justify-center border border-amber-400">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account / Admin Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-2 rounded-full text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-xs font-bold text-stone-700 dark:text-stone-200">
                    {currentUser ? (
                      currentUser.fullName.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 py-2 z-50 text-xs animate-in fade-in duration-150"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    {currentUser ? (
                      <>
                        <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                          <p className="font-semibold text-stone-900 dark:text-stone-100">
                            {currentUser.fullName}
                          </p>
                          <p className="text-[11px] text-stone-400 truncate">{currentUser.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
                              Store Administrator
                            </span>
                          )}
                        </div>
                        <Link
                          to="/account"
                          className="block px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                        >
                          My Account & Orders
                        </Link>
                        <Link
                          to="/account?tab=tracking"
                          className="block px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                        >
                          Track Package
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-950/60"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-t border-stone-100 dark:border-stone-800 mt-1"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/account"
                          className="block px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
                        >
                          Customer Sign In / Register
                        </Link>
                        <Link
                          to="/account?tab=tracking"
                          className="block px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                        >
                          Track an Order
                        </Link>
                        <div className="border-t border-stone-100 dark:border-stone-800 my-1"></div>
                        <Link
                          to="/admin/login"
                          className="flex items-center gap-2 px-4 py-2 text-emerald-800 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Admin Console Login
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Admin Portal Shortcut badge for easy demo navigation */}
              <Link
                to={isAdmin ? '/admin' : '/admin/login'}
                className="hidden xl:flex items-center gap-1 text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-emerald-900 hover:text-amber-200 text-stone-700 dark:text-stone-300 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Admin Panel</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-6 space-y-3">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-stone-800 dark:text-stone-200">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Shop All Products
              </Link>
              <Link
                to="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Browse Categories
              </Link>
              <Link
                to="/shop?category=cat-women"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-amber-700 dark:text-amber-400"
              >
                Women's Collection
              </Link>
              <Link
                to="/shop?category=cat-men"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-emerald-800 dark:text-emerald-400"
              >
                Men's Collection
              </Link>
              <Link
                to="/shop?category=cat-unstitched"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Unstitched Fabric
              </Link>
              <Link
                to="/shop?category=cat-pret"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Stitched Prêt
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                About Our Heritage
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Contact & Showrooms
              </Link>
              <Link
                to="/account?tab=tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold text-emerald-700"
              >
                Track Your Order
              </Link>
            </nav>

            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex gap-2">
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-center bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold"
              >
                My Account
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-center bg-emerald-950 text-amber-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3"
            >
              <Search className="w-5 h-5 text-emerald-800 dark:text-emerald-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search by lawn, prêt, silk, men kurta, SKU..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="text-stone-400 hover:text-stone-600 text-xs px-2 py-1 rounded"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            {/* Live Search Suggestions */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {searchInput.trim() === '' ? (
                <div className="py-6 text-center text-stone-400 text-xs space-y-2">
                  <p>Popular Searches:</p>
                  <div className="flex flex-wrap justify-center gap-2 pt-1">
                    {['Lawn 3PC', 'Boski Silk', 'Festive Chiffon', 'Egyptian Cotton', 'Waistcoat', 'Khaddar'].map(
                      (tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setSearchInput(tag);
                          }}
                          className="bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 px-3 py-1.5 rounded-full text-xs transition"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-stone-500 text-xs">
                  No products matched &quot;{searchInput}&quot;. Try searching for &quot;Lawn&quot;, &quot;Silk&quot;, or &quot;Cotton&quot;.
                </div>
              ) : (
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                    Matching Products ({searchResults.length})
                  </p>
                  {searchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/product/${prod.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="py-3 flex items-center gap-3 hover:bg-stone-50 dark:hover:bg-stone-800/60 px-2 rounded-xl transition"
                    >
                      <img
                        src={prod.images[0]}
                        alt=""
                        className="w-12 h-14 object-cover rounded-lg bg-stone-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                          <span>{prod.fabric}</span>
                          <span>•</span>
                          <span className="font-mono text-stone-400">{prod.sku}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-400">
                        Rs. {(prod.salePrice ?? prod.regularPrice).toLocaleString()}
                      </span>
                    </Link>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full mt-3 py-2.5 text-center text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition"
                  >
                    View all matching results in Shop →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
