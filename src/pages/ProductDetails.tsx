import React, { useState, useMemo } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Ruler,
  Check,
  ChevronRight,
  Send,
  AlertCircle,
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/products/ProductCard';
import { buildWhatsAppLink, formatPrice } from '../utils/formatters';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, categories, reviews, addReview, wishlist, toggleWishlist, settings, showToast } =
    useStore();
  const { addToCart, setIsCartDrawerOpen } = useCart();

  const product = products.find((p) => p.id === id || p.slug === id);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Review form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Auto-init size & color
  const currentSize = selectedSize || product?.sizes[0] || 'Standard';
  const currentColor = selectedColor || product?.colors[0]?.name || 'Standard';

  const productReviews = useMemo(() => {
    if (!product) return [];
    return reviews.filter((r) => r.productId === product.id && r.status === 'approved');
  }, [reviews, product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-luxury text-2xl font-bold">Product Not Found</h2>
        <p className="text-stone-500 text-sm">
          The requested garment article might have been moved or archived.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-emerald-950 text-amber-200 text-xs font-semibold px-6 py-2.5 rounded-xl border border-amber-500/40"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const currentPrice = product.salePrice ?? product.regularPrice;
  const hasSale = product.salePrice && product.salePrice < product.regularPrice;
  const isLiked = wishlist.includes(product.id);

  const handleAddToCart = () => {
    const success = addToCart(product, currentSize, currentColor, quantity);
    if (success) {
      setIsCartDrawerOpen(true);
    }
  };

  const handleBuyNow = () => {
    const success = addToCart(product, currentSize, currentColor, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  const handleWhatsAppInquiry = () => {
    const msg = `Assalam-o-Alaikum!
I am interested in buying from Al-Haram Cloth Store:

Article: ${product.name} (SKU: ${product.sku})
Price: Rs. ${currentPrice.toLocaleString()}
Selected Size: ${currentSize}
Selected Color: ${currentColor}
Quantity: ${quantity}

Please confirm stock availability and booking.`;
    const url = buildWhatsAppLink(settings.whatsappNumber, msg);
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Look at this luxury Eastern attire at AL-HARAM CLOTH STORE: ${product.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Product link copied to your clipboard!');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    setReviewSubmitting(true);
    addReview({
      productId: product.id,
      productName: product.name,
      customerName: reviewerName.trim(),
      customerEmail: reviewerEmail.trim(),
      rating,
      comment: reviewComment.trim(),
    });

    setReviewerName('');
    setReviewerEmail('');
    setReviewComment('');
    setReviewSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumbs */}
      <nav className="text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-stone-800 dark:hover:text-stone-300">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-stone-800 dark:hover:text-stone-300">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/shop?category=${product.category}`}
          className="hover:text-stone-800 dark:hover:text-stone-300 capitalize"
        >
          {categories.find((c) => c.id === product.category)?.name || 'Category'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-950 dark:text-emerald-400 font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-xl border border-stone-200/80 dark:border-stone-800">
            <img
              src={product.images[activeImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300 hover:scale-105 cursor-zoom-in"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {hasSale && (
                <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Sale
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-emerald-950 text-amber-300 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                  Best Seller
                </span>
              )}
            </div>

            {/* Floating Share & Wishlist */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded-full backdrop-blur-md shadow-md transition ${
                  isLiked
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-600' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-md text-stone-700 dark:text-stone-300 hover:text-emerald-800 transition"
                title="Share link"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 aspect-[3/4] rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                    activeImage === idx
                      ? 'border-amber-500 scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Attributes & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
              <span>{product.fabric}</span>
              <span>•</span>
              <span>{product.pieces}</span>
            </div>

            <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 mt-2 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3 text-xs text-stone-500">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 font-bold text-stone-800 dark:text-stone-200">
                  {product.rating.toFixed(1)}
                </span>
                <span className="ml-1 text-stone-400">({product.reviewCount} reviews)</span>
              </div>
              <span>•</span>
              <span className="font-mono">SKU: {product.sku}</span>
              <span>•</span>
              <span
                className={
                  product.stock > 0
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-rose-600 font-semibold'
                }
              >
                {product.stock > 0 ? `${product.stock} Units in Stock` : 'Sold Out'}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 py-3 border-y border-stone-200 dark:border-stone-800">
            <span className="text-3xl font-bold text-emerald-950 dark:text-emerald-300">
              {formatPrice(currentPrice, settings.currencySymbol)}
            </span>
            {hasSale && (
              <span className="text-lg text-stone-400 line-through">
                {formatPrice(product.regularPrice, settings.currencySymbol)}
              </span>
            )}
            <span className="text-xs text-stone-400">Inclusive of all local sales taxes</span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {product.description}
          </p>

          {/* Sizing Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
                Select Size: <span className="text-amber-700 dark:text-amber-400">{currentSize}</span>
              </label>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                Size Chart Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border transition ${
                    currentSize === sz
                      ? 'border-emerald-900 bg-emerald-900 text-amber-300 shadow-md'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Color Tone: <span className="text-stone-600 dark:text-stone-400">{currentColor}</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition ${
                    currentColor === c.name
                      ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/50 dark:bg-stone-800 font-semibold'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold text-stone-800 dark:text-stone-200">Quantity:</label>
            <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-800">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 text-sm hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-xs font-bold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1.5 text-sm hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                +
              </button>
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Only {product.stock} left in stock!
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full bg-emerald-950 hover:bg-emerald-900 disabled:bg-stone-300 text-amber-200 font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-amber-500/40 shadow-xl transition"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-stone-300 text-stone-950 font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition"
              >
                Buy Now
              </button>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-3 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              Order or Inquire through WhatsApp
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-center">
            <div className="space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-400 mx-auto" />
              <p className="text-[11px] font-bold text-stone-800 dark:text-stone-200">100% Purity</p>
              <p className="text-[10px] text-stone-400">Genuine Swiss & Egyptian Cotton</p>
            </div>
            <div className="space-y-1">
              <Truck className="w-5 h-5 text-emerald-800 dark:text-emerald-400 mx-auto" />
              <p className="text-[11px] font-bold text-stone-800 dark:text-stone-200">TCS Express</p>
              <p className="text-[10px] text-stone-400">Nationwide 2-4 days</p>
            </div>
            <div className="space-y-1">
              <RotateCcw className="w-5 h-5 text-emerald-800 dark:text-emerald-400 mx-auto" />
              <p className="text-[11px] font-bold text-stone-800 dark:text-stone-200">7-Day Exchange</p>
              <p className="text-[10px] text-stone-400">No questions asked return</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="bg-stone-50 dark:bg-stone-900/60 p-6 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
              Customer Reviews & Feedback
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Real opinions from certified buyers of this article
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-serif-luxury text-3xl font-bold text-amber-500">
                {product.rating.toFixed(1)}
              </p>
              <div className="flex text-amber-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <span className="text-xs text-stone-400">Based on {product.reviewCount} ratings</span>
          </div>
        </div>

        {/* Reviews List & Write Review Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {productReviews.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                <p className="text-xs text-stone-500">
                  No written reviews yet for this article. Be the first to review!
                </p>
              </div>
            ) : (
              productReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/80 dark:border-stone-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {rev.customerName}
                      </h4>
                      <p className="text-[10px] text-stone-400">{rev.date}</p>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review Form */}
          <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4">
            <h4 className="font-serif-luxury text-base font-bold text-stone-900 dark:text-stone-100">
              Share Your Experience
            </h4>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Overall Rating
                </label>
                <div className="flex gap-1.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-stone-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fatima Khan"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Your Review
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us about the fabric feel, stitching, and fit..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full bg-emerald-950 text-amber-200 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-amber-500/40 shadow hover:bg-emerald-900 transition"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Products Carousel/Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
              Complete The Look – Related Articles
            </h3>
            <Link
              to={`/shop?category=${product.category}`}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
            >
              View More from this Category →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Size Chart Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                <h3 className="font-serif-luxury font-bold text-lg text-stone-900 dark:text-stone-100">
                  Standard Sizing Guide (Inches)
                </h3>
              </div>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Measurements shown in inches. All stitched prêt garments include 1.5-inch margins for
              tailoring ease.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-bold uppercase text-[10px]">
                    <th className="py-2">Size</th>
                    <th className="py-2">Chest</th>
                    <th className="py-2">Waist</th>
                    <th className="py-2">Hip</th>
                    <th className="py-2">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-600 dark:text-stone-400">
                  <tr>
                    <td className="py-2 font-bold text-stone-900 dark:text-stone-100">XS</td>
                    <td>34 - 36</td>
                    <td>28 - 30</td>
                    <td>38 - 40</td>
                    <td>38</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-stone-900 dark:text-stone-100">Small (S)</td>
                    <td>36 - 38</td>
                    <td>31 - 33</td>
                    <td>40 - 42</td>
                    <td>39</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-stone-900 dark:text-stone-100">Medium (M)</td>
                    <td>39 - 41</td>
                    <td>34 - 36</td>
                    <td>43 - 45</td>
                    <td>40</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-stone-900 dark:text-stone-100">Large (L)</td>
                    <td>42 - 44</td>
                    <td>37 - 39</td>
                    <td>46 - 48</td>
                    <td>41</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-stone-900 dark:text-stone-100">XL</td>
                    <td>45 - 47</td>
                    <td>40 - 42</td>
                    <td>49 - 51</td>
                    <td>42</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl text-xs text-amber-900 dark:text-amber-300">
              <strong>Unstitched Fabric note:</strong> All unstitched 3-piece suits come with a
              generous 3.0 meters shirt fabric, 2.5 meters dupatta, and 2.5 meters trouser fabric.
            </div>

            <button
              onClick={() => setSizeGuideOpen(false)}
              className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold"
            >
              Close Size Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
