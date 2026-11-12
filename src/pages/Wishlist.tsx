import React from 'react';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/products/ProductCard';

export const Wishlist: React.FC = () => {
  const { wishlist, products, toggleWishlist, showToast } = useStore();
  const { addToCart, setIsCartDrawerOpen } = useCart();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    let addedCount = 0;
    savedProducts.forEach((product) => {
      if (product.stock > 0) {
        addToCart(product, product.sizes[0] || 'Standard', product.colors[0]?.name || 'Standard', 1);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      showToast('Moved to Bag', `${addedCount} wishlist articles added to your cart.`);
      setIsCartDrawerOpen(true);
    }
  };

  if (savedProducts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
          Your Wishlist is Empty
        </h1>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Save your favorite luxury lawn prints, festive silk kurtas, and men’s cotton suits here to
          review later.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-emerald-950 text-amber-200 text-xs font-semibold px-6 py-2.5 rounded-xl border border-amber-500/40"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {savedProducts.length} saved {savedProducts.length === 1 ? 'article' : 'articles'}
          </p>
        </div>

        <button
          onClick={handleMoveAllToCart}
          className="bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 border border-amber-500/40 shadow transition self-start sm:self-center"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Move All to Bag</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {savedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
