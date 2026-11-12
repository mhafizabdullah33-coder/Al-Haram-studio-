import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { WhatsAppFloating } from '../common/WhatsAppFloating';
import { ToastContainer } from '../common/ToastContainer';

export const CustomerLayout: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Floating Elements */}
      <CartDrawer />
      <WhatsAppFloating />
      <ToastContainer />

      {/* Back to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-emerald-950/90 text-amber-200 border border-amber-500/40 shadow-xl backdrop-blur-md hover:bg-emerald-900 transition hover:scale-110 active:scale-95"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
