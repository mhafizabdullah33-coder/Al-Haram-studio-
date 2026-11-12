import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useOrders } from '../../context/OrderContext';
import { useStore } from '../../context/StoreContext';
import { exportOrdersToCSV, formatDate, formatPrice } from '../../utils/formatters';

const PIE_COLORS = ['#064E3B', '#D4AF37', '#0F766E', '#CA8A04', '#374151', '#7F1D1D'];

export const AdminAnalytics: React.FC = () => {
  const { orders } = useOrders();
  const { categories, products, settings, showToast } = useStore();

  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | '90days' | 'year' | 'all'>(
    '30days'
  );

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    const now = new Date().getTime();
    return orders.filter((o) => {
      const orderTime = new Date(o.createdAt).getTime();
      const diffDays = (now - orderTime) / (1000 * 3600 * 24);

      if (dateFilter === 'today') return diffDays <= 1;
      if (dateFilter === '7days') return diffDays <= 7;
      if (dateFilter === '30days') return diffDays <= 30;
      if (dateFilter === '90days') return diffDays <= 90;
      if (dateFilter === 'year') return diffDays <= 365;
      return true;
    });
  }, [orders, dateFilter]);

  // Actual calculations from filtered orders
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = filteredOrders.length;
  const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const totalItemsSold = filteredOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  // Daily revenue aggregation for chart
  const revenueChartData = useMemo(() => {
    const dayMap = new Map<string, number>();
    filteredOrders.forEach((o) => {
      const d = o.createdAt.split('T')[0];
      dayMap.set(d, (dayMap.get(d) || 0) + o.total);
    });

    const list = Array.from(dayMap.entries()).map(([day, rev]) => ({
      date: formatDate(day),
      revenue: rev,
    }));

    if (list.length === 0) {
      return [
        { date: '10 Oct', revenue: 12000 },
        { date: '20 Oct', revenue: 19650 },
        { date: '28 Oct', revenue: 24800 },
      ];
    }
    return list;
  }, [filteredOrders]);

  // Status Distribution
  const statusDistribution = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach((o) => {
      map.set(o.orderStatus, (map.get(o.orderStatus) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({
      name: name.toUpperCase(),
      value,
    }));
  }, [filteredOrders]);

  // Payment Method Breakdown
  const paymentBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    filteredOrders.forEach((o) => {
      const method = o.paymentMethod.toUpperCase();
      map.set(method, (map.get(method) || 0) + o.total);
    });
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredOrders]);

  const handleExportCSV = () => {
    if (orders.length === 0) {
      showToast('No Orders', 'There are no order records to export.', 'warning');
      return;
    }
    exportOrdersToCSV(orders);
    showToast('Report Exported', 'Orders CSV download initiated successfully.');
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Analytics & Financial Intelligence
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Audited revenue, average basket size, and fulfillment performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setDateFilter('7days')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                dateFilter === '7days'
                  ? 'bg-emerald-950 text-amber-300 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateFilter('30days')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                dateFilter === '30days'
                  ? 'bg-emerald-950 text-amber-300 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setDateFilter('year')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                dateFilter === 'year'
                  ? 'bg-emerald-950 text-amber-300 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              This Year
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                dateFilter === 'all'
                  ? 'bg-emerald-950 text-amber-300 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All Time
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-emerald-950 hover:bg-emerald-900 text-amber-200 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 border border-amber-500/40 shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Period Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-luxury text-2xl font-bold text-emerald-950 dark:text-emerald-300">
            {formatPrice(totalRevenue, settings.currencySymbol)}
          </p>
          <span className="text-[10px] text-stone-400">Actual gross order receipts</span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Booked Orders</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            {totalOrdersCount}
          </p>
          <span className="text-[10px] text-stone-400">{totalItemsSold} total articles dispatched</span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Order Value (AOV)</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            {formatPrice(aov, settings.currencySymbol)}
          </p>
          <span className="text-[10px] text-stone-400">Average spending per parcel</span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Payment Volume</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-luxury text-2xl font-bold text-emerald-950 dark:text-emerald-300">
            {paymentBreakdown.length} Modes
          </p>
          <span className="text-[10px] text-stone-400">COD, JazzCash, EasyPaisa, Bank</span>
        </div>
      </div>

      {/* Main Revenue Bar / Area Chart */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
        <div>
          <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100">
            Revenue Performance Timeline
          </h3>
          <p className="text-xs text-stone-500">
            Income trajectory based on customer booking dates
          </p>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `Rs.${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any) => [
                  formatPrice(Number(val || 0), settings.currencySymbol),
                  'Gross Sales',
                ]}
              />
              <Bar dataKey="revenue" fill="#064E3B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2 Sub-charts: Fulfillment Status & Payment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="font-serif-luxury font-bold text-base text-stone-900 dark:text-stone-100">
            Order Fulfillment Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name || ''}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="font-serif-luxury font-bold text-base text-stone-900 dark:text-stone-100">
            Sales by Payment Gateway (PKR)
          </h3>
          <div className="space-y-3 pt-2">
            {paymentBreakdown.map((pm, idx) => {
              const pct = totalRevenue > 0 ? Math.round((pm.value / totalRevenue) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{pm.name}</span>
                    <span>
                      {formatPrice(pm.value, settings.currencySymbol)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-800 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
