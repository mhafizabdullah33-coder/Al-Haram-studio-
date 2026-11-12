import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { wishlist, toggleWishlist, settings } = useStore();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isLiked = wishlist.includes(product.id);
  const hasSale = product.salePrice && product.salePrice < product.regularPrice;
  const discountPercent = hasSale
    ? Math.round(((product.regularPrice - (product.salePrice ?? 0)) / product.regularPrice) * 100)
    : 0;

  const currentPrice = product.salePrice ?? product.regularPrice;
  const displayImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'Standard';
    const defaultColor = product.colors[0]?.name || 'Standard';
    const success = addToCart(product, defaultSize, defaultColor, 1);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-800 transition-all duration-300 hover:shadow-xl hover:border-amber-500/30 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasSale && (
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-emerald-900 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              Best Seller
            </span>
          )}
          {product.isNewArrival && !hasSale && (
            <span className="bg-stone-900 text-stone-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        {/* Quick action buttons (Floating right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleWishlist}
            aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-md ${
              isLiked
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-300 hover:text-rose-600 hover:scale-110'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
          </button>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label="Quick View"
              className="w-9 h-9 rounded-full bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 backdrop-blur-md flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stock warning */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full tracking-wider">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick add bottom overlay on hover */}
        {product.stock > 0 && (
          <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleQuickAdd}
              disabled={justAdded}
              className={`w-full py-2.5 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 shadow-lg backdrop-blur-md transition-all duration-200 ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-950/90 hover:bg-emerald-900 text-amber-200 border border-amber-500/40'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Quick Add ({product.sizes[0] || 'Standard'})
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
          <span className="uppercase font-semibold tracking-wider text-[10px] text-amber-700 dark:text-amber-400">
            {product.fabric}
          </span>
          <div className="flex items-center gap-1 text-stone-700 dark:text-stone-300">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="font-serif-luxury text-stone-900 dark:text-stone-100 text-base font-semibold line-clamp-1 hover:text-emerald-800 dark:hover:text-emerald-400 transition"
        >
          {product.name}
        </Link>

        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-1 mb-3">
          {product.shortDescription || product.pieces}
        </p>

        {/* Sizes & Colors preview */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-1 text-[11px] text-stone-500">
            <span>Sizes:</span>
            <span className="font-medium text-stone-700 dark:text-stone-300">
              {product.sizes.slice(0, 3).join(', ')}
              {product.sizes.length > 3 ? ' +' : ''}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {product.colors.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-stone-300 dark:border-stone-700 inline-block shadow-xs"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-emerald-950 dark:text-emerald-300">
              {formatPrice(currentPrice, settings.currencySymbol)}
            </span>
            {hasSale && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.regularPrice, settings.currencySymbol)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-400 font-mono">
            {product.sku}
          </span>
        </div>
      </div>
    </div>
  );
};
