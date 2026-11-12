import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';

const PRESET_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
];

export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, settings } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [regularPrice, setRegularPrice] = useState(4500);
  const [salePrice, setSalePrice] = useState<string>('');
  const [stock, setStock] = useState(25);
  const [fabric, setFabric] = useState('Luxury Swiss Lawn');
  const [pieces, setPieces] = useState('3 Piece');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [sizesStr, setSizesStr] = useState('S, M, L, XL');
  const [colorName, setColorName] = useState('Emerald Green');
  const [colorHex, setColorHex] = useState('#064E3B');
  const [imageUrl1, setImageUrl1] = useState(PRESET_IMAGE_URLS[0]);
  const [imageUrl2, setImageUrl2] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [status, setStatus] = useState<Product['status']>('active');

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.fabric.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [products, selectedCategory, searchTerm]);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`AHC-${Math.floor(100 + Math.random() * 900)}`);
    setCategory(categories[0]?.id || 'cat-lawn');
    setRegularPrice(5500);
    setSalePrice('4800');
    setStock(20);
    setFabric('Swiss Voile Lawn');
    setPieces('3 Piece');
    setDescription('Intricately embroidered luxury fabric ensemble.');
    setShortDescription('Embroidered Shirt with Pure Dupatta & Trouser.');
    setSizesStr('Unstitched, S, M, L, XL');
    setColorName('Emerald Green');
    setColorHex('#064E3B');
    setImageUrl1(PRESET_IMAGE_URLS[Math.floor(Math.random() * PRESET_IMAGE_URLS.length)]);
    setImageUrl2('');
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsNewArrival(true);
    setStatus('active');
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setRegularPrice(p.regularPrice);
    setSalePrice(p.salePrice ? p.salePrice.toString() : '');
    setStock(p.stock);
    setFabric(p.fabric);
    setPieces(p.pieces);
    setDescription(p.description);
    setShortDescription(p.shortDescription);
    setSizesStr(p.sizes.join(', '));
    setColorName(p.colors[0]?.name || 'Standard');
    setColorHex(p.colors[0]?.hex || '#064E3B');
    setImageUrl1(p.images[0] || PRESET_IMAGE_URLS[0]);
    setImageUrl2(p.images[1] || '');
    setIsFeatured(p.isFeatured);
    setIsBestSeller(p.isBestSeller);
    setIsNewArrival(p.isNewArrival);
    setStatus(p.status);
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    const sizes = sizesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const images = [imageUrl1.trim(), imageUrl2.trim()].filter(Boolean);
    const colors = [{ name: colorName.trim(), hex: colorHex }];
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const parsedSale = salePrice.trim() ? Number(salePrice) : undefined;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        slug,
        sku,
        category,
        regularPrice: Number(regularPrice),
        salePrice: parsedSale,
        stock: Number(stock),
        fabric,
        pieces,
        description,
        shortDescription,
        sizes,
        colors,
        images,
        isFeatured,
        isBestSeller,
        isNewArrival,
        status,
      });
    } else {
      addProduct({
        name,
        slug,
        sku,
        category,
        regularPrice: Number(regularPrice),
        salePrice: parsedSale,
        stock: Number(stock),
        fabric,
        pieces,
        description,
        shortDescription,
        sizes,
        colors,
        images,
        isFeatured,
        isBestSeller,
        isNewArrival,
        status,
        rating: 5.0,
        reviewCount: 0,
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, prodName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${prodName}"?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            Product Management
          </h1>
          <p className="text-xs text-stone-500">
            Add, update, or remove garments. Changes sync immediately to the storefront.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 border border-amber-500/40 shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Title, SKU, Fabric..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 focus:outline-none"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <span className="text-xs text-stone-500 shrink-0">
            {filteredProducts.length} articles
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">SKU / Fabric</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Regular / Sale Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredProducts.map((p) => {
                const catName = categories.find((c) => c.id === p.category)?.name || 'General';
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-14 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200 dark:border-stone-800"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-stone-400 truncate">
                            Sizes: {p.sizes.join(', ')}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-stone-700 dark:text-stone-300 font-semibold block">
                        {p.sku}
                      </span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                        {p.fabric}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                      {catName}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-emerald-950 dark:text-emerald-300">
                          {formatPrice(p.salePrice ?? p.regularPrice, settings.currencySymbol)}
                        </span>
                        {p.salePrice && (
                          <span className="text-[10px] text-stone-400 line-through">
                            {formatPrice(p.regularPrice, settings.currencySymbol)}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          p.stock <= 5
                            ? 'bg-rose-100 text-rose-700'
                            : p.stock <= 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isFeatured && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                            Best Seller
                          </span>
                        )}
                        {p.isNewArrival && (
                          <span className="text-[9px] bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold px-1.5 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          p.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-stone-500 hover:text-emerald-800 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100">
                {editingProduct ? 'Edit Garment Article' : 'Add New Garment to Catalog'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold">Article Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Sale / Promo Price (PKR)</label>
                  <input
                    type="number"
                    placeholder="Leave blank if no sale"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Stock Inventory Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Fabric Type *</label>
                  <input
                    type="text"
                    required
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Pieces / Cut</label>
                  <input
                    type="text"
                    value={pieces}
                    onChange={(e) => setPieces(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Available Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={sizesStr}
                    onChange={(e) => setSizesStr(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Primary Color Name & Hex</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      className="w-2/3 text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                    />
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-1/3 h-9 rounded-xl border p-1 bg-white cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Catalog Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold">Primary Image URL *</label>
                  <input
                    type="url"
                    required
                    value={imageUrl1}
                    onChange={(e) => setImageUrl1(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold">Secondary Image URL (Hover)</label>
                  <input
                    type="url"
                    value={imageUrl2}
                    onChange={(e) => setImageUrl2(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                {/* Checkbox flags */}
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>Mark as Featured</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>Mark as Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="rounded text-emerald-800"
                    />
                    <span>Mark as New Arrival</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-950 text-amber-200 rounded-xl text-xs font-semibold border border-amber-500/40 shadow hover:bg-emerald-900 transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
