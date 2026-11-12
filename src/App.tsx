import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { ScrollToTop } from './components/common/ScrollToTop';

// Customer Pages (12 main pages)
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Shop } from './pages/Shop';
import { Categories } from './pages/Categories';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Account } from './pages/Account';
import { Wishlist } from './pages/Wishlist';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Returns } from './pages/Returns';
import { NotFound } from './pages/NotFound';

// Admin Portal Pages
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminProducts } from './admin/pages/AdminProducts';
import { AdminCategories } from './admin/pages/AdminCategories';
import { AdminOrders } from './admin/pages/AdminOrders';
import { AdminCustomers } from './admin/pages/AdminCustomers';
import { AdminAnalytics } from './admin/pages/AdminAnalytics';
import { AdminInventory } from './admin/pages/AdminInventory';
import { AdminCoupons } from './admin/pages/AdminCoupons';
import { AdminSupport } from './admin/pages/AdminSupport';
import { AdminReviews } from './admin/pages/AdminReviews';
import { AdminSettings } from './admin/pages/AdminSettings';

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <CartProvider>
          <AuthProvider>
            <OrderProvider>
              <ScrollToTop />
              <Routes>
                {/* Customer Storefront Routes */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Administrative Portal Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="support" element={<AdminSupport />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </OrderProvider>
          </AuthProvider>
        </CartProvider>
      </StoreProvider>
    </BrowserRouter>
  );
}
