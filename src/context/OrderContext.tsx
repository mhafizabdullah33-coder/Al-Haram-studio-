import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../storage/storageService';
import { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus } from '../types';
import { useCart } from './CartContext';
import { useStore } from './StoreContext';

interface PlaceOrderParams {
  customerName: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  orderNotes?: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (params: PlaceOrderParams) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus, transactionId?: string) => void;
  deleteOrder: (orderId: string) => void;
  findOrder: (orderNumberOrTracking: string) => Order | undefined;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products, updateProduct, coupons, updateCoupon, showToast } = useStore();
  const { cart, subtotal, discount, appliedCoupon, deliveryCharges, grandTotal, clearCart } =
    useCart();
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());

  useEffect(() => {
    storageService.saveOrders(orders);
  }, [orders]);

  const placeOrder = async (params: PlaceOrderParams): Promise<Order> => {
    const timestamp = Date.now();
    const orderNumSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingSuffix = Math.floor(10000000 + Math.random() * 90000000);

    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      sku: item.product.sku,
      size: item.selectedSize,
      color: item.selectedColor,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.unitPrice * item.quantity,
      image: item.product.images[0] || '',
    }));

    // Deduct inventory stock
    cart.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const remainingStock = Math.max(0, prod.stock - item.quantity);
        updateProduct(prod.id, {
          stock: remainingStock,
          status: remainingStock === 0 ? 'out_of_stock' : prod.status,
        });
      }
    });

    // Update coupon count if applied
    if (appliedCoupon) {
      updateCoupon(appliedCoupon.id, {
        usedCount: (appliedCoupon.usedCount || 0) + 1,
      });
    }

    const newOrder: Order = {
      id: 'ord-' + timestamp,
      orderNumber: `AHC-2026-${orderNumSuffix}`,
      trackingNumber: `TCS-${trackingSuffix}`,
      customerName: params.customerName.trim(),
      email: params.email.trim().toLowerCase(),
      phone: params.phone.trim(),
      whatsapp: params.whatsapp.trim() || params.phone.trim(),
      city: params.city.trim(),
      address: params.address.trim(),
      orderNotes: params.orderNotes?.trim(),
      items: orderItems,
      subtotal,
      discount,
      couponCode: appliedCoupon?.code,
      deliveryCharges,
      total: grandTotal,
      paymentMethod: params.paymentMethod,
      paymentStatus:
        params.paymentMethod === 'cod'
          ? 'unpaid'
          : params.transactionId
          ? 'pending_verification'
          : 'unpaid',
      transactionId: params.transactionId,
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update customers list in storage
    const customers = storageService.getCustomers();
    const existingCustIndex = customers.findIndex(
      (c) => c.email.toLowerCase() === newOrder.email.toLowerCase()
    );

    if (existingCustIndex > -1) {
      customers[existingCustIndex].totalSpent += newOrder.total;
      customers[existingCustIndex].ordersCount += 1;
      customers[existingCustIndex].phone = newOrder.phone;
      customers[existingCustIndex].city = newOrder.city;
      customers[existingCustIndex].address = newOrder.address;
      storageService.saveCustomers([...customers]);
    } else {
      const newCust = {
        id: 'cust-' + timestamp,
        fullName: newOrder.customerName,
        email: newOrder.email,
        phone: newOrder.phone,
        whatsapp: newOrder.whatsapp,
        city: newOrder.city,
        address: newOrder.address,
        totalSpent: newOrder.total,
        ordersCount: 1,
        role: 'customer' as const,
        createdAt: new Date().toISOString(),
      };
      storageService.saveCustomers([newCust, ...customers]);
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast('Order Placed!', `Your order ${newOrder.orderNumber} has been received.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const orderToUpdate = orders.find((o) => o.id === orderId);
    if (!orderToUpdate) return;

    // If changing to cancelled, restore stock!
    if (status === 'cancelled' && orderToUpdate.orderStatus !== 'cancelled') {
      orderToUpdate.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        if (prod) {
          updateProduct(prod.id, {
            stock: prod.stock + item.quantity,
            status: 'active',
          });
        }
      });
      showToast('Inventory Restored', 'Products have been restored to available stock.', 'info');
    }

    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            orderStatus: status,
            updatedAt: new Date().toISOString(),
          }
        : o
    );
    setOrders(updated);
    showToast('Status Updated', `Order marked as ${status}.`);
  };

  const updatePaymentStatus = (
    orderId: string,
    status: PaymentStatus,
    transactionId?: string
  ) => {
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            paymentStatus: status,
            ...(transactionId ? { transactionId } : {}),
            updatedAt: new Date().toISOString(),
          }
        : o
    );
    setOrders(updated);
    showToast('Payment Status Updated', `Payment marked as ${status}.`);
  };

  const deleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    showToast('Order Deleted', 'Order record removed.');
  };

  const findOrder = (query: string): Order | undefined => {
    const clean = query.trim().toUpperCase();
    if (!clean) return undefined;
    return orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === clean ||
        o.trackingNumber.toUpperCase() === clean ||
        o.id === clean
    );
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        updatePaymentStatus,
        deleteOrder,
        findOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
