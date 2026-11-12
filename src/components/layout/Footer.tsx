import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink } from '../../utils/formatters';

export const Footer: React.FC = () => {
  const { settings, showToast } = useStore();
  const [emailSub, setEmailSub] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub.trim()) return;
    showToast(
      'Subscribed to Al-Haram Privileges',
      `Welcome! Exclusive offers and festive previews will be sent to ${emailSub}`
    );
    setEmailSub('');
  };

  return (
    <footer className="bg-emerald-950 text-stone-300 pt-16 pb-12 border-t border-emerald-900/60 no-print">
      {/* Value Proposition Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-emerald-900/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                100% Pure Fabric
              </h4>
              <p className="text-[11px] text-stone-400">Authentic Swiss Voile & Cotton</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/40 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                Nationwide Delivery
              </h4>
              <p className="text-[11px] text-stone-400">TCS Express in 2-4 working days</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/40 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                7-Day Exchange
              </h4>
              <p className="text-[11px] text-stone-400">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/40 flex items-center justify-center text-amber-400 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                Flexible Payment
              </h4>
              <p className="text-[11px] text-stone-400">COD, JazzCash, EasyPaisa, Bank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-900 to-black border border-amber-500/60 flex items-center justify-center">
                <span className="font-brand text-amber-400 text-lg font-bold">AH</span>
              </div>
              <div>
                <span className="font-brand text-lg font-bold tracking-widest text-white leading-none block">
                  AL-HARAM
                </span>
                <span className="text-[9px] tracking-[0.25em] text-amber-400 font-semibold uppercase">
                  Cloth Store
                </span>
              </div>
            </Link>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              {settings.tagline}. Al-Haram Cloth Store is synonymous with master craftsmanship, pure
              threads, and celebratory couture tailored for discerning gentlemen and graceful
              women.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Join The Al-Haram Club
              </h5>
              <form onSubmit={handleNewsletter} className="flex max-w-sm">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-l-xl bg-emerald-900/60 border border-emerald-800 text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 rounded-r-xl transition flex items-center justify-center shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[10px] text-stone-400 mt-1.5">
                Get Rs. 500 off your first purchase plus VIP seasonal catalogs.
              </p>
            </div>
          </div>

          {/* Quick Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/shop?category=cat-lawn"
                  className="hover:text-white transition hover:underline"
                >
                  Luxury Lawn 3PC
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=cat-festive"
                  className="hover:text-white transition hover:underline"
                >
                  Festive & Wedding Prêt
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=cat-men"
                  className="hover:text-white transition hover:underline"
                >
                  Egyptian Cotton Men
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=cat-unstitched"
                  className="hover:text-white transition hover:underline"
                >
                  Signature Boski Silk
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=cat-khaddar"
                  className="hover:text-white transition hover:underline"
                >
                  Winter Khaddar & Shawls
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=cat-kids"
                  className="hover:text-white transition hover:underline"
                >
                  Kids Traditional Attire
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/account" className="hover:text-white transition hover:underline">
                  My Profile & Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/account?tab=tracking"
                  className="hover:text-white transition hover:underline"
                >
                  Track Your Parcel
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition hover:underline">
                  Return & Exchange Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition hover:underline">
                  Privacy & Data Policy
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition hover:underline">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition hover:underline">
                  Store Locations & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Showroom & Support
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 fill-current" />
                <span>WhatsApp: {settings.whatsappNumber}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.email}</span>
              </p>
              <p className="text-[11px] text-stone-400 pt-1">
                Hours: {settings.openingHours}
              </p>

              <div className="pt-2">
                <a
                  href={buildWhatsAppLink(settings.whatsappNumber, 'Salam! I have an inquiry.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow hover:bg-[#20ba59] transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  Direct WhatsApp Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Payment Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
        <p>
          © {new Date().getFullYear()} <strong>AL-HARAM CLOTH STORE</strong>. All Rights Reserved.
          Crafted with Purity & Passion.
        </p>

        {/* Payment badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-stone-400 mr-1">Accepted Payments:</span>
          <span className="bg-emerald-900/80 px-2 py-1 rounded text-[10px] font-bold text-amber-300 border border-emerald-700/50">
            Cash On Delivery (COD)
          </span>
          <span className="bg-red-950/80 px-2 py-1 rounded text-[10px] font-bold text-red-300 border border-red-800/50">
            JazzCash
          </span>
          <span className="bg-emerald-900/80 px-2 py-1 rounded text-[10px] font-bold text-emerald-300 border border-emerald-600/50">
            EasyPaisa
          </span>
          <span className="bg-stone-900/80 px-2 py-1 rounded text-[10px] font-bold text-stone-300 border border-stone-700/50">
            Bank Transfer (Meezan)
          </span>
        </div>
      </div>
    </footer>
  );
};
