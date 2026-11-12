import React, { useState } from 'react';
import { X, Star, ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { settings } = useStore();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const navigate = useNavigate();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  // Initialize size & color if not selected
  const currentSize = selectedSize || product.sizes[0] || 'Standard';
  const currentColor = selectedColor || product.colors[0]?.name || 'Standard';

  const currentPrice = product.salePrice ?? product.regularPrice;
  const hasSale = product.salePrice && product.salePrice < product.regularPrice;

  const handleAddToCart = () => {
    const success = addToCart(product, currentSize, currentColor, quantity);
    if (success) {
      onClose();
      setIsCartDrawerOpen(true);
    }
  };

  const handleBuyNow = () => {
    const success = addToCart(product, currentSize, currentColor, quantity);
    if (success) {
      onClose();
      navigate('/checkout');
    }
  };

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 dark:bg-stone-800/80 backdrop-blur-md text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white flex items-center justify-center shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Images */}
        <div className="md:w-1/2 bg-stone-100 dark:bg-stone-800 p-4 flex flex-col justify-between">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white dark:bg-stone-900 shadow-inner">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-14 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    activeImageIndex === i ? 'border-amber-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2 p-6 flex flex-col overflow-y-auto">
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 uppercase font-semibold tracking-wider">
            <span>{product.fabric}</span>
            <span>•</span>
            <span>{product.pieces}</span>
          </div>

          <h2 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {product.name}
          </h2>

          <div className="flex items-center gap-2 mt-1.5 text-xs text-stone-500">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 font-semibold text-stone-800 dark:text-stone-200">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span>•</span>
            <span>SKU: {product.sku}</span>
            <span>•</span>
            <span
              className={
                product.stock > 0
                  ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                  : 'text-rose-600 font-medium'
              }
            >
              {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 my-3">
            <span className="text-2xl font-bold text-emerald-950 dark:text-emerald-300">
              {formatPrice(currentPrice, settings.currencySymbol)}
            </span>
            {hasSale && (
              <span className="text-sm text-stone-400 line-through">
                {formatPrice(product.regularPrice, settings.currencySymbol)}
              </span>
            )}
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 mb-4 leading-relaxed">
            {product.description}
          </p>

          {/* Size picker */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Select Size: <span className="text-amber-700 dark:text-amber-400">{currentSize}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1.5 text-xs rounded-xl font-medium border transition ${
                    currentSize === sz
                      ? 'border-emerald-900 bg-emerald-900 text-amber-300'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Select Color: <span className="text-stone-900 dark:text-stone-100">{currentColor}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-xl border transition ${
                    currentColor === c.name
                      ? 'border-amber-500 ring-2 ring-amber-400/30'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-stone-300 inline-block"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity stepper */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-800">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition"
              >
                -
              </button>
              <span className="px-3 py-1.5 text-xs font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1.5 text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition"
              >
                +
              </button>
            </div>
            <span className="text-[11px] text-stone-400">
              Max {product.stock} available
            </span>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 mt-auto">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-emerald-950 hover:bg-emerald-900 disabled:bg-stone-300 text-amber-200 font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-amber-500/30 shadow-md transition"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                Buy Now
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="w-full text-center py-2 text-xs font-medium text-emerald-800 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1"
            >
              View Full Product Page & Customer Reviews <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 mt-3 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-500">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Original Fabric</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fast TCS Delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>7-Day Easy Exchange</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
