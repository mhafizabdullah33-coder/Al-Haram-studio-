import React, { useState, useMemo, useEffect } from 'react';
import {
  Filter,
  Grid,
  List,
  Search,
  SlidersHorizontal,
  X,
  Star,
  ShoppingBag,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/products/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';

export const Shop: React.FC = () => {
  const { products, categories, settings, wishlist, toggleWishlist } = useStore();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state from URL or defaults
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const filterParam = searchParams.get('filter') || 'all'; // 'new', 'best'

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchTerm, setSearchTerm] = useState<string>(searchParam);
  const [priceRange, setPriceRange] = useState<number>(20000);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Sync state if URL changes
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchTerm(searchParam);
  }, [categoryParam, searchParam]);

  // Extract unique sizes and colors
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [products]);

  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    const activeCat = categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory);
    const targetCatId = activeCat ? activeCat.id : selectedCategory;

    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== targetCatId) {
        return false;
      }

      // Pre-set filters (new, best seller)
      if (filterParam === 'new' && !product.isNewArrival) return false;
      if (filterParam === 'best' && !product.isBestSeller) return false;

      // Search keyword filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesFabric = product.fabric.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesFabric && !matchesDesc) {
          return false;
        }
      }

      // Price filter
      const price = product.salePrice ?? product.regularPrice;
      if (price > priceRange) return false;

      // Size filter
      if (selectedSize !== 'all' && !product.sizes.includes(selectedSize)) {
        return false;
      }

      // Color filter
      if (
        selectedColor !== 'all' &&
        !product.colors.some((c) => c.name.toLowerCase() === selectedColor.toLowerCase())
      ) {
        return false;
      }

      // Stock filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    });
  }, [
    products,
    categories,
    selectedCategory,
    filterParam,
    searchTerm,
    priceRange,
    selectedSize,
    selectedColor,
    inStockOnly,
  ]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort(
          (a, b) => (a.salePrice ?? a.regularPrice) - (b.salePrice ?? b.regularPrice)
        );
      case 'price-desc':
        return list.sort(
          (a, b) => (b.salePrice ?? b.regularPrice) - (a.salePrice ?? a.regularPrice)
        );
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'latest':
        return list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'featured':
      default:
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setPriceRange(20000);
    setSelectedSize('all');
    setSelectedColor('all');
    setInStockOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchTerm !== '' ||
    priceRange < 20000 ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header & Breadcrumbs */}
      <div>
        <nav className="text-xs text-stone-500 mb-2 flex items-center gap-1.5">
          <Link to="/" className="hover:text-stone-800 dark:hover:text-stone-300">
            Home
          </Link>
          <span>/</span>
          <span className="text-emerald-950 dark:text-emerald-400 font-semibold">Shop</span>
          {selectedCategory !== 'all' && (
            <>
              <span>/</span>
              <span className="capitalize">
                {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
              </span>
            </>
          )}
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
              {selectedCategory !== 'all'
                ? categories.find((c) => c.id === selectedCategory)?.name || 'Collections'
                : 'All Designer Garments'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Showing {sortedProducts.length} handcrafted articles available
            </p>
          </div>

          {/* Quick Filter toggle button for mobile */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filter Catalog</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar + Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              Filter By
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-semibold text-rose-600 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Name, SKU, Fabric..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Category</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-900 text-amber-300 font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition flex justify-between items-center ${
                      selectedCategory === c.id
                        ? 'bg-emerald-900 text-amber-300 font-semibold'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Max Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
              <span>Max Price</span>
              <span className="text-emerald-800 dark:text-emerald-400">
                {formatPrice(priceRange, settings.currencySymbol)}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="20000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-emerald-800"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>Rs. 2,000</span>
              <span>Rs. 20,000+</span>
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Size</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedSize('all')}
                className={`px-2.5 py-1 text-[11px] rounded-lg border transition ${
                  selectedSize === 'all'
                    ? 'border-emerald-900 bg-emerald-900 text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                }`}
              >
                All
              </button>
              {allSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2 py-1 text-[11px] rounded-lg border transition ${
                    selectedSize === sz
                      ? 'border-emerald-900 bg-emerald-900 text-amber-300 font-bold'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Color Palette</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedColor('all')}
                className={`px-2 py-1 text-[10px] rounded-lg border ${
                  selectedColor === 'all'
                    ? 'border-emerald-900 bg-emerald-900 text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-700 text-stone-500'
                }`}
              >
                All Colors
              </button>
              {allColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-6 h-6 rounded-full border shadow-xs transition ${
                    selectedColor === c.name
                      ? 'ring-2 ring-amber-500 ring-offset-2 scale-110'
                      : 'border-stone-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
            <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700"
              />
              <span>In Stock Articles Only</span>
            </label>
          </div>
        </aside>

        {/* Catalog Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & View Controls */}
          <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500">
              Showing <strong className="text-stone-800 dark:text-stone-200">{paginatedProducts.length}</strong> of{' '}
              <strong className="text-stone-800 dark:text-stone-200">{sortedProducts.length}</strong> articles
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-800 dark:text-stone-200 focus:outline-none"
                >
                  <option value="featured">Featured / Best Selection</option>
                  <option value="latest">New Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Grid vs List toggle */}
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-stone-700 text-emerald-900 dark:text-emerald-300 shadow-xs'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                  aria-label="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-stone-700 text-emerald-900 dark:text-emerald-300 shadow-xs'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                  aria-label="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-400 text-[11px]">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  Category: {categories.find((c) => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSize !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                  Size: {selectedSize}
                  <button onClick={() => setSelectedSize('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedColor !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                  Color: {selectedColor}
                  <button onClick={() => setSelectedColor('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-semibold text-rose-600 hover:underline ml-1"
              >
                Reset All
              </button>
            </div>
          )}

          {/* Products View */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 mx-auto flex items-center justify-center text-stone-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100">
                No matching articles found
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                We couldn&apos;t find any garments matching your active filter criteria. Try relaxing
                your filters or search terms.
              </p>
              <button
                onClick={resetAllFilters}
                className="bg-emerald-950 text-amber-200 text-xs font-semibold px-6 py-2.5 rounded-xl border border-amber-500/30 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {paginatedProducts.map((product) => {
                const currentPrice = product.salePrice ?? product.regularPrice;
                const hasSale = product.salePrice && product.salePrice < product.regularPrice;
                const isLiked = wishlist.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-4 flex flex-col sm:flex-row gap-5 hover:shadow-lg transition"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="w-full sm:w-44 aspect-[3/4] sm:aspect-square rounded-xl overflow-hidden bg-stone-100 shrink-0"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                          <span className="uppercase text-[10px] font-bold text-amber-700 dark:text-amber-400">
                            {product.fabric} • {product.pieces}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-semibold">{product.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <Link
                          to={`/product/${product.id}`}
                          className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100 hover:text-emerald-800 transition block"
                        >
                          {product.name}
                        </Link>

                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                          <span className="text-stone-400 text-[11px]">Available Sizes:</span>
                          {product.sizes.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-emerald-950 dark:text-emerald-300">
                            {formatPrice(currentPrice, settings.currencySymbol)}
                          </span>
                          {hasSale && (
                            <span className="text-xs text-stone-400 line-through">
                              {formatPrice(product.regularPrice, settings.currencySymbol)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-2 rounded-xl border transition ${
                              isLiked
                                ? 'bg-rose-50 text-rose-600 border-rose-200'
                                : 'border-stone-200 text-stone-600 hover:text-rose-600'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                          </button>
                          <button
                            onClick={() => setQuickViewProduct(product)}
                            className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              addToCart(
                                product,
                                product.sizes[0] || 'Standard',
                                product.colors[0]?.name || 'Standard',
                                1
                              )
                            }
                            className="bg-emerald-950 hover:bg-emerald-900 text-amber-200 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 border border-amber-500/40 transition"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 disabled:opacity-40 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold transition ${
                    currentPage === i + 1
                      ? 'bg-emerald-950 text-amber-300 font-bold border border-amber-500/40'
                      : 'border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 disabled:opacity-40 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};
