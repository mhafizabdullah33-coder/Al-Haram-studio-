import React, { useState } from 'react';
import { Plus, TicketPercent, Edit2, Trash2, X, Check, Calendar, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import { formatPrice } from '../../utils/formatters';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, settings } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(3000);
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [usageLimit, setUsageLimit] = useState(500);
  const [isActive, setIsActive] = useState(true);

  const openAddModal = () => {
    setEditingCoupon(null);
    setCode('FESTIVE20');
    setType('percentage');
    setValue(20);
    setMinOrderAmount(4000);
    setExpiryDate('2027-12-31');
    setUsageLimit(200);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setType(c.type);
    setValue(c.value);
    setMinOrderAmount(c.minOrderAmount);
    setExpiryDate(c.expiryDate);
    setUsageLimit(c.usageLimit);
    setIsActive(c.isActive);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        minOrderAmount: Number(minOrderAmount),
        expiryDate,
        usageLimit: Number(usageLimit),
        isActive,
      });
    } else {
      addCoupon({
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        minOrderAmount: Number(minOrderAmount),
        expiryDate,
        usageLimit: Number(usageLimit),
        isActive,
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, couponCode: string) => {
    if (window.confirm(`Are you sure you want to delete promo coupon "${couponCode}"?`)) {
      deleteCoupon(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            Offers & Discount Coupons
          </h1>
          <p className="text-xs text-stone-500">
            Create promotional codes and festive discounts for customer checkout.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 border border-amber-500/40 shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Promo Code</th>
                <th className="py-3 px-4">Discount Value</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Redemptions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {coupons.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition"
                >
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-sm bg-stone-100 dark:bg-stone-800 text-emerald-900 dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
                      {c.code}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-stone-900 dark:text-stone-100">
                    {c.type === 'percentage'
                      ? `${c.value}% OFF`
                      : `Fixed Rs. ${c.value.toLocaleString()} OFF`}
                  </td>

                  <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                    {formatPrice(c.minOrderAmount, settings.currencySymbol)}
                  </td>

                  <td className="py-3 px-4 text-stone-600 dark:text-stone-400 font-mono">
                    {c.expiryDate}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {c.usedCount || 0} / {c.usageLimit}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-stone-500 hover:text-emerald-800 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100">
                {editingCoupon ? 'Edit Discount Code' : 'Create New Coupon'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Coupon Promo Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER15"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">
                    Discount Value ({type === 'percentage' ? '%' : 'PKR'}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Minimum Spend (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <label className="flex items-center gap-2 text-xs cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <span>Enable Coupon for Checkout</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-950 text-amber-200 rounded-xl text-xs font-semibold border border-amber-500/40 shadow hover:bg-emerald-900 transition"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
