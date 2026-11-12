import React from 'react';
import { X, Printer, CheckCircle2, Download } from 'lucide-react';
import { Order } from '../../types';
import { formatPrice, formatDate } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const { settings } = useStore();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
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
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white text-stone-900 rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions (Hidden on print) */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Tax Invoice & Packing Slip
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {order.orderStatus}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-950 hover:bg-emerald-900 text-amber-200 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 sm:p-10 space-y-8 bg-white print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-amber-500 flex items-center justify-center shadow">
                <span className="font-brand text-amber-400 text-xl font-bold">AH</span>
              </div>
              <div>
                <h1 className="font-brand text-xl font-bold tracking-widest text-emerald-950 leading-none">
                  AL-HARAM CLOTH STORE
                </h1>
                <p className="text-[11px] text-stone-500 tracking-wider uppercase mt-1">
                  Luxury Eastern & Prêt Fashion • NTN: 894021-4
                </p>
                <p className="text-[10px] text-stone-400">
                  {settings.address} | Tel: {settings.phone}
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs uppercase tracking-widest text-stone-400 font-bold block">
                INVOICE
              </span>
              <span className="font-mono text-base font-bold text-stone-800 block">
                INV-{order.orderNumber.replace('AHC-', '')}
              </span>
              <p className="text-xs text-stone-500 mt-1">
                Date: <strong>{formatDate(order.createdAt)}</strong>
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
            <div>
              <span className="font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Billed & Shipped To:
              </span>
              <p className="font-bold text-stone-900 text-sm">{order.customerName}</p>
              <p className="text-stone-600 mt-0.5">{order.address}</p>
              <p className="text-stone-600 font-semibold">{order.city}, Pakistan</p>
              <p className="text-stone-500 mt-1">Phone: {order.phone}</p>
              <p className="text-stone-500">Email: {order.email}</p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Order Information:
              </span>
              <p>
                Order Reference: <strong className="font-mono text-stone-900">{order.orderNumber}</strong>
              </p>
              <p>
                Courier Tracking: <strong className="font-mono text-stone-900">{order.trackingNumber}</strong>
              </p>
              <p>
                Payment Method:{' '}
                <strong className="uppercase text-stone-900">{order.paymentMethod}</strong>
              </p>
              <p>
                Payment Status:{' '}
                <span className="inline-flex items-center gap-1 font-bold text-emerald-800 uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {order.paymentStatus}
                </span>
              </p>
              {order.transactionId && (
                <p className="font-mono text-[11px] text-stone-600">
                  Trx ID: {order.transactionId}
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-800 text-stone-700 font-bold uppercase text-[11px]">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5">SKU</th>
                  <th className="py-2.5 text-center">Size</th>
                  <th className="py-2.5 text-center">Color</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Price</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="text-stone-700">
                    <td className="py-3 font-medium text-stone-900">{item.productName}</td>
                    <td className="py-3 font-mono text-stone-400 text-[11px]">{item.sku}</td>
                    <td className="py-3 text-center">{item.size}</td>
                    <td className="py-3 text-center">{item.color}</td>
                    <td className="py-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 text-right">
                      {formatPrice(item.unitPrice, settings.currencySymbol)}
                    </td>
                    <td className="py-3 text-right font-bold text-stone-900">
                      {formatPrice(item.total, settings.currencySymbol)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-stone-200">
            <div className="text-xs text-stone-500 max-w-xs space-y-1">
              <p className="font-bold text-stone-800 uppercase text-[10px]">Terms & Returns:</p>
              <p>
                Unwashed, unstitched items with original tags can be exchanged within 7 days.
                Contact our customer support team with invoice number.
              </p>
              {order.orderNotes && (
                <p className="italic pt-1 text-stone-600">
                  Note: &quot;{order.orderNotes}&quot;
                </p>
              )}
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-stone-900">
                  {formatPrice(order.subtotal, settings.currencySymbol)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Coupon Discount ({order.couponCode || 'PROMO'}):</span>
                  <span>-{formatPrice(order.discount, settings.currencySymbol)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span>
                  {order.deliveryCharges === 0 ? (
                    <strong className="text-emerald-800">FREE</strong>
                  ) : (
                    formatPrice(order.deliveryCharges, settings.currencySymbol)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-emerald-950 pt-2 border-t-2 border-stone-800">
                <span>Total Amount:</span>
                <span>{formatPrice(order.total, settings.currencySymbol)}</span>
              </div>
            </div>
          </div>

          {/* Footer Signoff */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <p>Thank you for choosing AL-HARAM CLOTH STORE. May you wear it in happiness!</p>
            <div className="text-right">
              <p className="font-serif-luxury font-bold text-emerald-900 text-xs">
                AL-HARAM Quality Verified
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
