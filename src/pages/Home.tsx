import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Star,
  Quote,
  ShoppingBag,
  TrendingUp,
  ChevronDown,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/products/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const Home: React.FC = () => {
  const { products, categories, reviews, settings } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const featuredCategories = categories.filter((c) => c.isActive).slice(0, 6);

  const scrollToCollections = () => {
    // If music isn't playing yet, start it upon user action
    if (audioRef.current && !isMusicPlaying) {
      audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }

    const target = document.getElementById('festive-collection');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch((err) => console.log('Audio playback permission:', err));
    }
  };

  useEffect(() => {
    const startAudioOnGesture = () => {
      if (audioRef.current && !isMusicPlaying) {
        audioRef.current
          .play()
          .then(() => setIsMusicPlaying(true))
          .catch(() => {});
      }
      window.removeEventListener('click', startAudioOnGesture);
      window.removeEventListener('scroll', startAudioOnGesture);
    };

    window.addEventListener('click', startAudioOnGesture, { once: true });
    window.addEventListener('scroll', startAudioOnGesture, { once: true });

    return () => {
      window.removeEventListener('click', startAudioOnGesture);
      window.removeEventListener('scroll', startAudioOnGesture);
    };
  }, [isMusicPlaying]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hidden Loop Soundtrack Audio Element */}
      <audio
        ref={audioRef}
        src="/assets/aistudio/hero_ambient_music.mp3"
        loop
        preload="auto"
      />

      {/* Full-screen 3D Chrome Chain Hero Section */}
      <div style={{ position: 'relative', height: '100vh', background: '#0b0909', overflow: 'hidden' }}>
        <iframe
          src="/chain.html"
          title="3D chain"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />

        {/* Ambient Dark Gradient for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0909] via-transparent to-[#0b0909]/40 pointer-events-none" />

        {/* Hero Foreground Content Layer (Higher z-index, Left-Aligned, Single Block) */}
        <div
          style={{ position: 'relative', zIndex: 20 }}
          className="w-full h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-between py-10 sm:py-12 pointer-events-none"
        >
          {/* Top Bar with Music Toggle */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={toggleMusic}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider hover:bg-stone-850 transition pointer-events-auto cursor-pointer shadow-lg"
              title={isMusicPlaying ? 'Pause Ambient Soundtrack' : 'Play Ambient Soundtrack'}
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">Music: Playing</span>
                  <span className="sm:hidden">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  <span className="hidden sm:inline">Play Music</span>
                  <span className="sm:hidden">Sound Off</span>
                </>
              )}
            </button>
          </div>

          {/* Left-Aligned Single Foreground Hero Text Block */}
          <div className="max-w-2xl space-y-4 text-left">
            {/* Small label */}
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AL-HARAM CLOTH STORE</span>
            </div>

            {/* Single-line Heading */}
            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-2xl">
              Luxury Eastern Wear
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base lg:text-lg text-stone-200 font-light max-w-xl leading-relaxed drop-shadow">
              Timeless Eastern Elegance & Royal Heritage Fashion
            </p>

            {/* ONE SHOP NOW Button */}
            <div className="pt-2 pointer-events-auto">
              <button
                type="button"
                onClick={scrollToCollections}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm tracking-widest uppercase rounded-2xl shadow-xl shadow-amber-950/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Scroll Prompt */}
          <div className="flex items-center justify-between text-xs text-stone-400 pt-4 pointer-events-auto">
            <button
              type="button"
              onClick={scrollToCollections}
              className="flex items-center gap-2 text-stone-300 hover:text-amber-300 tracking-wider transition cursor-pointer"
            >
              <span>Scroll to Explore Collections</span>
              <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Hero Banner & Festive Launch */}
      <section id="festive-collection" className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white min-h-[580px] lg:min-h-[660px] flex items-center">
        {/* Background decorative pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-35 lg:opacity-60 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80"
            alt="Al-Haram Luxury Eastern Couture"
            className="w-full h-full object-cover object-top filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/60 to-transparent lg:block hidden" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 z-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Festive Eid & Wedding Edition 2026
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Regal Eastern Grace <br />
              <span className="italic font-normal text-amber-300">Tailored to Perfection</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-xl font-light leading-relaxed">
              Explore AL-HARAM CLOTH STORE’s signature Swiss Voile unstitched fabrics, handcrafted
              zari prêt, authentic Giza Egyptian cotton men&apos;s suits, and heirloom Kashmiri shawls.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/shop"
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-7 py-3.5 rounded-2xl text-xs sm:text-sm tracking-wider uppercase transition shadow-xl shadow-amber-950/40 flex items-center gap-2 group"
              >
                <span>Shop Festive Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/shop?category=cat-unstitched"
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-2xl text-xs sm:text-sm tracking-wider uppercase backdrop-blur-md border border-white/20 transition flex items-center gap-2"
              >
                <span>Unstitched Voile & Boski</span>
              </Link>
            </div>

            {/* Quick stats badges */}
            <div className="pt-8 border-t border-emerald-800/60 grid grid-cols-3 gap-6 text-stone-300">
              <div>
                <p className="font-serif-luxury text-2xl font-bold text-amber-300">100%</p>
                <p className="text-xs text-stone-400">Pure Combed Yarns</p>
              </div>
              <div>
                <p className="font-serif-luxury text-2xl font-bold text-amber-300">25,000+</p>
                <p className="text-xs text-stone-400">Happy Eastern Patrons</p>
              </div>
              <div>
                <p className="font-serif-luxury text-2xl font-bold text-amber-300">4.9 ★</p>
                <p className="text-xs text-stone-400">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">
              Curated Masterpieces
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              Explore Our Signature Categories
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 flex items-center gap-1.5 mt-2 sm:mt-0 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-200 dark:bg-stone-800 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent" />
              <div className="absolute bottom-3 inset-x-3 text-center">
                <h3 className="font-serif-luxury text-sm font-bold text-white group-hover:text-amber-300 transition">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-stone-300 uppercase tracking-wider block mt-0.5">
                  Explore Designs →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Fresh from our Ateliers
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              New Arrivals & Seasonal Drops
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 flex items-center gap-1.5 mt-2 sm:mt-0 group"
          >
            <span>See All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* Promotional Banner: Welcome Coupon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-amber-500/30">
          <div className="max-w-xl space-y-4">
            <span className="bg-amber-500 text-stone-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block">
              Special Privilege Promo
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold leading-tight">
              Enjoy 10% Off Your First Order with Code:{' '}
              <span className="text-amber-300 underline decoration-amber-400">WELCOME10</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
              Experience the unmatched luxury of authentic hand-dyed Boski, pure chiffon dupattas,
              and fine Kamalia khaddar delivered directly to your doorstep. Free delivery over Rs.
              4,999.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg transition"
              >
                Claim Discount in Shop
              </Link>
              <Link
                to="/about"
                className="border border-white/30 hover:bg-white/10 text-white font-medium px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition"
              >
                Our Fabric Standards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
              <TrendingUp className="w-3.5 h-3.5" />
              Customer Favorites
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              Most Loved & Best Sellers
            </h2>
          </div>
          <Link
            to="/shop?filter=best"
            className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 flex items-center gap-1.5 mt-2 sm:mt-0 group"
          >
            <span>Explore All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* Brand Story Highlight */}
      <section className="bg-stone-100 dark:bg-stone-900/60 py-16 sm:py-20 border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                The Al-Haram Legacy of Pure Weaves
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
                Authentic Craftsmanship, <br />
                Uncompromising Fabric Purity
              </h2>

              <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                Founded with a singular commitment to preserving the royal heritage of Pakistani
                textiles, AL-HARAM CLOTH STORE sources exclusively certified long-staple Egyptian
                cotton, artisanal handloom khaddar, and the purest 8-pound imported Boski silk.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Color-fast guarantee on all reactive-dyed lawn and linen.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Precision tailored collars and cuffs according to Savile Row standards.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Exclusive in-house Kashmiri tilla and zari embroidery designs.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-emerald-950 dark:bg-emerald-900 text-amber-200 hover:bg-emerald-900 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition"
                >
                  Read Our Heritage Story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80"
                  alt="Men Cotton Kurta Craftsmanship"
                  className="rounded-2xl object-cover aspect-[3/4] shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
                  alt="Women Luxury Chiffon Embroidery"
                  className="rounded-2xl object-cover aspect-[3/4] shadow-lg translate-y-6"
                />
              </div>
              <div className="absolute -bottom-4 left-6 bg-white dark:bg-stone-800 p-4 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 max-w-xs">
                <p className="font-serif-luxury font-bold text-sm text-emerald-950 dark:text-emerald-300">
                  MM Alam Road Flagship
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Visit our physical boutique in Gulberg III, Lahore for custom bridal consultations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">
            Words of Praise
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            What Our Patrons Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 italic leading-relaxed">
                  &quot;{rev.comment}&quot;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {rev.customerName}
                  </h4>
                  <p className="text-[10px] text-stone-400 mt-0.5">{rev.productName}</p>
                </div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};
