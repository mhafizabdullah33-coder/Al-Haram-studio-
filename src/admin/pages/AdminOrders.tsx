import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Printer,
  Trash2,
  CheckCircle2,
  X,
  MessageCircle,
  Truck,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { buildWhatsAppLink, formatDate, formatPrice } from '../../utils/formatters';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, updatePaymentStatus, deleteOrder } = useOrders();
  const { settings, showToast } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Status editing states within modal
  const [editStatus, setEditStatus] = useState<OrderStatus>('pending');
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>('unpaid');
  const [editTrxId, setEditTrxId] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
      if (paymentFilter !== 'all' && o.paymentMethod !== paymentFilter) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(query) ||
          o.trackingNumber.toLowerCase().includes(query) ||
          o.customerName.toLowerCase().includes(query) ||
          o.phone.includes(query) ||
          o.email.toLowerCase().includes(query) ||
          o.city.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [orders, statusFilter, paymentFilter, searchTerm]);

  const openDetailsModal = (o: Order) => {
    setSelectedOrder(o);
    setEditStatus(o.orderStatus);
    setEditPaymentStatus(o.paymentStatus);
    setEditTrxId(o.transactionId || '');
  };

  const handleSaveModalUpdates = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, editStatus);
    updatePaymentStatus(selectedOrder.id, editPaymentStatus, editTrxId.trim() || undefined);
    showToast('Order Updated', `Changes applied to ${selectedOrder.orderNumber}`);
    setSelectedOrder(null);
  };

  const handleDelete = (id: string, num: string) => {
    if (window.confirm(`Are you sure you want to delete order record "${num}"?`)) {
      deleteOrder(id);
      if (selectedOrder?.id === id) setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            Order Fulfillment & Management
          </h1>
          <p className="text-xs text-stone-500">
            Monitor, update, and dispatch client orders. Inventory restores automatically on cancellation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300">
            Total Orders: <strong>{orders.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Order #, Tracking, Customer, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 focus:outline-none"
          >
            <option value="all">All Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 focus:outline-none"
          >
            <option value="all">All Payment Modes</option>
            <option value="cod">Cash on Delivery</option>
            <option value="jazzcash">JazzCash</option>
            <option value="easypaisa">EasyPaisa</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Order / Tracking</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-stone-400">
                    No orders matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord.id}
                    className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100 block">
                        {ord.orderNumber}
                      </span>
                      <span className="font-mono text-[10px] text-emerald-800 dark:text-emerald-400">
                        {ord.trackingNumber}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-stone-500">{formatDate(ord.createdAt)}</td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-stone-900 dark:text-stone-100">
                        {ord.customerName}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {ord.city} • {ord.phone}
                      </p>
                    </td>

                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                      {ord.items.reduce((s, i) => s + i.quantity, 0)} items
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-950 dark:text-emerald-300">
                        {formatPrice(ord.total, settings.currencySymbol)}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold uppercase text-[10px] text-stone-700 dark:text-stone-300">
                          {ord.paymentMethod}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block w-fit uppercase ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.paymentStatus === 'pending_verification'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase inline-block ${
                          ord.orderStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : ord.orderStatus === 'shipped'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openDetailsModal(ord)}
                          className="p-1.5 text-stone-500 hover:text-emerald-800 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                          title="View / Edit Status"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setInvoiceOrder(ord)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ord.id, ord.orderNumber)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Order Details & Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-stone-500">
                  Courier Tracking: <strong className="font-mono text-emerald-800 dark:text-emerald-400">{selectedOrder.trackingNumber}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-700">
              <div className="space-y-1">
                <span className="font-bold text-stone-400 uppercase text-[10px]">Client Information:</span>
                <p className="font-bold text-sm text-stone-900 dark:text-stone-100">{selectedOrder.customerName}</p>
                <p className="text-stone-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {selectedOrder.phone}</p>
                <p className="text-stone-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedOrder.email}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-stone-400 uppercase text-[10px]">Delivery Destination:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">{selectedOrder.city}, Pakistan</p>
                <p className="text-stone-500 leading-relaxed">{selectedOrder.address}</p>
                {selectedOrder.orderNotes && (
                  <p className="italic text-amber-700 dark:text-amber-400 text-[11px] pt-1">
                    Note: &quot;{selectedOrder.orderNotes}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-stone-700 dark:text-stone-300">Ordered Garments</h4>
              <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs gap-3">
                    <img src={it.image} alt="" className="w-10 h-12 object-cover rounded-lg bg-stone-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">{it.productName}</p>
                      <p className="text-[11px] text-stone-400">SKU: {it.sku} • Size: {it.size} • Color: {it.color}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-stone-900 dark:text-stone-100">{formatPrice(it.total, settings.currencySymbol)}</p>
                      <p className="text-[10px] text-stone-400">{it.quantity} x {formatPrice(it.unitPrice, settings.currencySymbol)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Modification Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Update Fulfillment Status:
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled (Restores Inventory)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Update Payment Status:
                </label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Transaction Reference ID:
                </label>
                <input
                  type="text"
                  placeholder="e.g. TID-98214710294"
                  value={editTrxId}
                  onChange={(e) => setEditTrxId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                />
              </div>
            </div>

            {/* Quick WhatsApp update link */}
            <div className="flex items-center justify-between text-xs pt-1">
              <a
                href={buildWhatsAppLink(
                  selectedOrder.whatsapp || selectedOrder.phone,
                  `Assalam-o-Alaikum ${selectedOrder.customerName}! Your AL-HARAM order #${selectedOrder.orderNumber} status has been updated to: ${editStatus.toUpperCase()}. Tracking: ${selectedOrder.trackingNumber}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] font-semibold flex items-center gap-1.5 hover:underline"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Message Client on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setInvoiceOrder(selectedOrder)}
                className="text-stone-700 dark:text-stone-300 font-semibold flex items-center gap-1.5 hover:underline"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveModalUpdates}
                className="px-6 py-2 bg-emerald-950 text-amber-200 rounded-xl text-xs font-semibold border border-amber-500/40 shadow hover:bg-emerald-900 transition"
              >
                Apply Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
    </div>
  );
};
