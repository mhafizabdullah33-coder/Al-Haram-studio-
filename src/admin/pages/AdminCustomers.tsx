import React, { useState, useMemo } from 'react';
import { Search, Users, Mail, Phone, MapPin, ShoppingBag, Eye, X } from 'lucide-react';
import { storageService } from '../../storage/storageService';
import { useOrders } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import { Customer, Order } from '../../types';
import { formatDate, formatPrice } from '../../utils/formatters';

export const AdminCustomers: React.FC = () => {
  const { settings } = useStore();
  const { orders } = useOrders();
  const customers = storageService.getCustomers();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          c.fullName.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          (c.city && c.city.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [customers, searchTerm]);

  // Customer specific orders
  const customerOrders: Order[] = selectedCustomer
    ? orders.filter(
        (o) =>
          o.email.toLowerCase() === selectedCustomer.email.toLowerCase() ||
          o.phone === selectedCustomer.phone
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            Customer Directory
          </h1>
          <p className="text-xs text-stone-500">
            Review registered client profiles, purchase histories, and contact info.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300">
          Total Patrons: <strong>{customers.length}</strong>
        </span>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Name, Email, Phone, City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
          />
        </div>
        <span className="text-xs text-stone-500 hidden sm:inline">
          Showing {filteredCustomers.length} clients
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">View History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-950 text-amber-300 font-bold flex items-center justify-center text-xs">
                        {cust.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {cust.fullName}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <p className="text-stone-700 dark:text-stone-300">{cust.email}</p>
                    <p className="text-[11px] text-stone-400 font-mono">{cust.phone}</p>
                  </td>

                  <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                    {cust.city || 'Lahore'}
                  </td>

                  <td className="py-3 px-4 font-bold text-stone-800 dark:text-stone-200">
                    {cust.ordersCount} orders
                  </td>

                  <td className="py-3 px-4 font-bold text-emerald-950 dark:text-emerald-300">
                    {formatPrice(cust.totalSpent, settings.currencySymbol)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        cust.role === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {cust.role}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="p-1.5 text-stone-500 hover:text-emerald-800 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                      title="View Orders History"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Orders History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-amber-300 font-bold flex items-center justify-center">
                  {selectedCustomer.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif-luxury text-base font-bold text-stone-900 dark:text-stone-100">
                    {selectedCustomer.fullName}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {selectedCustomer.email} • {selectedCustomer.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl text-xs space-y-1">
              <p className="text-stone-500">
                Primary Shipping Address: <strong className="text-stone-800 dark:text-stone-200">{selectedCustomer.address || 'Standard Address'}</strong>
              </p>
              <p className="text-stone-500">
                Destination City: <strong className="text-stone-800 dark:text-stone-200">{selectedCustomer.city || 'Lahore'}</strong>
              </p>
              <p className="text-emerald-800 dark:text-emerald-400 font-bold">
                Lifetime Value: {formatPrice(selectedCustomer.totalSpent, settings.currencySymbol)} ({customerOrders.length} bookings)
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                Order History Records
              </h4>
              {customerOrders.length === 0 ? (
                <p className="text-xs text-stone-400 py-4 text-center">
                  No orders recorded for this profile yet.
                </p>
              ) : (
                <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                  {customerOrders.map((o) => (
                    <div key={o.id} className="p-3 text-xs flex justify-between items-center">
                      <div>
                        <p className="font-mono font-bold text-stone-900 dark:text-stone-100">{o.orderNumber}</p>
                        <p className="text-[11px] text-stone-400">{formatDate(o.createdAt)} • {o.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-900 dark:text-emerald-400 block">
                          {formatPrice(o.total, settings.currencySymbol)}
                        </span>
                        <span className="text-[10px] font-semibold text-amber-700 uppercase">
                          {o.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
