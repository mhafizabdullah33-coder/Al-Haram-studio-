import React, { useState, useMemo } from 'react';
import { Boxes, AlertTriangle, CheckCircle2, Search, ArrowUpDown, Plus, Minus, ShieldAlert } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

export const AdminInventory: React.FC = () => {
  const { products, updateProduct, settings, showToast } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');

  const lowStockThreshold = settings.lowStockThreshold || 10;

  // Aggregate metrics
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.stock * (p.salePrice ?? p.regularPrice),
    0
  );
  const outOfStockList = products.filter((p) => p.stock === 0);
  const lowStockList = products.filter((p) => p.stock > 0 && p.stock <= lowStockThreshold);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filterMode === 'low' && (p.stock > lowStockThreshold || p.stock === 0)) return false;
      if (filterMode === 'out' && p.stock > 0) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, filterMode, searchTerm, lowStockThreshold]);

  const handleAdjustStock = (productId: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + delta);
    updateProduct(prod.id, {
      stock: newStock,
      status: newStock === 0 ? 'out_of_stock' : 'active',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-stone-500">
            Monitor real-time warehouse counts, low stock thresholds, and rapid restocking.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Warehouse Units</span>
            <Boxes className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            {totalUnits.toLocaleString()}
          </p>
          <span className="text-[10px] text-stone-400">Across {products.length} articles</span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Inventory Value</span>
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif-luxury text-2xl font-bold text-emerald-950 dark:text-emerald-300">
            {formatPrice(totalStockValue, settings.currencySymbol)}
          </p>
          <span className="text-[10px] text-stone-400">At current retail prices</span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif-luxury text-2xl font-bold text-amber-600">
            {lowStockList.length} Articles
          </p>
          <span className="text-[10px] text-stone-400">Under {lowStockThreshold} units remaining</span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Out of Stock</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="font-serif-luxury text-2xl font-bold text-rose-600">
            {outOfStockList.length} Articles
          </p>
          <span className="text-[10px] text-stone-400">Zero inventory</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Article or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterMode === 'all'
                ? 'bg-emerald-950 text-amber-300 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setFilterMode('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterMode === 'low'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            Low Stock ({lowStockList.length})
          </button>
          <button
            onClick={() => setFilterMode('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterMode === 'out'
                ? 'bg-rose-600 text-white font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            Out of Stock ({outOfStockList.length})
          </button>
        </div>
      </div>

      {/* Inventory Table with Quick Adjustment Steppers */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Garment Article</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Fabric</th>
                <th className="py-3 px-4">Retail Price</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Stock Health</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredProducts.map((p) => {
                const isOut = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= lowStockThreshold;

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
                          className="w-10 h-12 object-cover rounded-xl bg-stone-100 shrink-0"
                        />
                        <span className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-1 max-w-xs">
                          {p.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-stone-600 dark:text-stone-300">
                      {p.sku}
                    </td>

                    <td className="py-3 px-4 text-amber-700 dark:text-amber-400 font-medium">
                      {p.fabric}
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-950 dark:text-emerald-300">
                      {formatPrice(p.salePrice ?? p.regularPrice, settings.currencySymbol)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {p.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Low Stock ({p.stock})
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Healthy ({p.stock})
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAdjustStock(p.id, -1)}
                          disabled={p.stock <= 0}
                          className="p-1 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-40 transition"
                          title="Decrease 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, 5)}
                          className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-semibold text-[11px] transition"
                          title="Restock 5 units"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, 10)}
                          className="px-2 py-1 rounded bg-emerald-950 text-amber-300 hover:bg-emerald-900 font-semibold text-[11px] transition"
                          title="Restock 10 units"
                        >
                          +10
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
    </div>
  );
};
