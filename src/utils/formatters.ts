import { Order } from '../types';

export function formatPrice(amount: number, symbol: string = 'Rs.'): string {
  if (isNaN(amount) || amount === null || amount === undefined) return `${symbol} 0`;
  return `${symbol} ${Math.round(amount).toLocaleString('en-PK')}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function exportOrdersToCSV(orders: Order[]): void {
  const headers = [
    'Order Number',
    'Date',
    'Customer Name',
    'Email',
    'Phone',
    'City',
    'Items Count',
    'Subtotal (PKR)',
    'Discount (PKR)',
    'Delivery (PKR)',
    'Total (PKR)',
    'Payment Method',
    'Payment Status',
    'Order Status',
    'Tracking Number',
  ];

  const rows = orders.map((o) => [
    `"${o.orderNumber}"`,
    `"${o.createdAt.split('T')[0]}"`,
    `"${o.customerName.replace(/"/g, '""')}"`,
    `"${o.email}"`,
    `"${o.phone}"`,
    `"${o.city}"`,
    o.items.reduce((sum, item) => sum + item.quantity, 0),
    o.subtotal,
    o.discount,
    o.deliveryCharges,
    o.total,
    `"${o.paymentMethod.toUpperCase()}"`,
    `"${o.paymentStatus.toUpperCase()}"`,
    `"${o.orderStatus.toUpperCase()}"`,
    `"${o.trackingNumber || ''}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `al_haram_orders_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
