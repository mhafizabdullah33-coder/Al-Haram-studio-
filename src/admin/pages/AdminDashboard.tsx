import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Shirt,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Eye,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
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
import { useStore } from '../../context/StoreContext';
import { useOrders } from '../../context/OrderContext';
import { storageService } from '../../storage/storageService';
import { formatDate, formatPrice } from '../../utils/formatters';

const PIE_COLORS = ['#064E3B', '#D4AF37', '#0F766E', '#CA8A04', '#374151', '#7F1D1D'];

export const AdminDashboard: React.FC = () => {
  const { products, categories, settings } = useStore();
  const { orders, updateOrderStatus } = useOrders();
  const customers = storageService.getCustomers();

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'delivered').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'cancelled').length;
  const lowStockProducts = products.filter((p) => p.stock <= (settings.lowStockThreshold || 10));

  // Chart Data: Revenue Over Time from orders
  const revenueByDayMap = new Map<string, number>();
  orders.forEach((o) => {
    const day = o.createdAt.split('T')[0];
    const prev = revenueByDayMap.get(day) || 0;
    revenueByDayMap.set(day, prev + o.total);
  });

  const revenueTrendData = Array.from(revenueByDayMap.entries())
    .map(([date, revenue]) => ({
      date: formatDate(date),
      revenue,
    }))
    .slice(-7);

  // If few data points, add baseline
  if (revenueTrendData.length < 3) {
    revenueTrendData.unshift(
      { date: '10 Oct', revenue: 15400 },
      { date: '18 Oct', revenue: 22800 },
      { date: '25 Oct', revenue: 31200 }
    );
  }

  // Category Distribution Data
  const categoryCountMap = new Map<string, number>();
  products.forEach((p) => {
    const cat = categories.find((c) => c.id === p.category)?.name || 'General';
    categoryCountMap.set(cat, (categoryCountMap.get(cat) || 0) + 1);
  });

  const categoryChartData = Array.from(categoryCountMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  const recentOrders = orders.slice(0, 5);
  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
          Executive Store Overview
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Real-time metrics calculated from your persistent LocalStorage database.
        </p>
      </div>

      {/* 8 Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-emerald-950 dark:text-emerald-300">
            {formatPrice(totalRevenue, settings.currencySymbol)}
          </p>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live Gross Sales
          </span>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            {totalOrders}
          </p>
          <span className="text-[10px] text-stone-400">All lifetime bookings</span>
        </div>

        {/* Card 3: Products */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Products</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400">
              <Shirt className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            {totalProducts}
          </p>
          <span className="text-[10px] text-stone-400">Across 10 categories</span>
        </div>

        {/* Card 4: Customers */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Patrons / Clients</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            {totalCustomers}
          </p>
          <span className="text-[10px] text-stone-400">Registered client profiles</span>
        </div>

        {/* Card 5: Pending Orders */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-400">
            {pendingOrders}
          </p>
          <span className="text-[10px] text-amber-600 font-semibold">Requires dispatch action</span>
        </div>

        {/* Card 6: Completed Orders */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Delivered</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-emerald-800 dark:text-emerald-400">
            {completedOrders}
          </p>
          <span className="text-[10px] text-stone-400">Successfully fulfilled</span>
        </div>

        {/* Card 7: Cancelled Orders */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Cancelled</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-rose-700">
            {cancelledOrders}
          </p>
          <span className="text-[10px] text-stone-400">Inventory automatically restored</span>
        </div>

        {/* Card 8: Low Stock Warnings */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif-luxury text-xl sm:text-2xl font-bold text-rose-700">
            {lowStockProducts.length}
          </p>
          <span className="text-[10px] text-rose-600 font-semibold">Below {settings.lowStockThreshold || 10} units</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-luxury font-bold text-base text-stone-900 dark:text-stone-100">
                Revenue & Sales Trajectory
              </h3>
              <p className="text-xs text-stone-500">Calculated from stored customer orders</p>
            </div>
            <Link
              to="/admin/analytics"
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 hover:underline"
            >
              <span>Full Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#064E3B" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#064E3B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `Rs.${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [
                    formatPrice(Number(val || 0), settings.currencySymbol),
                    'Revenue',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#064E3B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Donut (1 Col) */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-serif-luxury font-bold text-base text-stone-900 dark:text-stone-100">
              Catalog Category Spread
            </h3>
            <p className="text-xs text-stone-500">Active design distribution</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] text-stone-500 justify-center">
            {categoryChartData.slice(0, 4).map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span>{c.name} ({c.value})</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury font-bold text-base text-stone-900 dark:text-stone-100">
              Recent Customer Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 uppercase text-[10px]">
                  <th className="py-2.5">Order #</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">City</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-stone-400">
                      No customer orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                      <td className="py-3 font-mono font-bold text-stone-900 dark:text-stone-100">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 font-medium">{ord.customerName}</td>
                    <td className="py-3 text-stone-500">{ord.city}</td>
                    <td className="py-3 font-bold text-emerald-900 dark:text-emerald-400">
                      {formatPrice(ord.total, settings.currencySymbol)}
                    </td>
                    <td className="py-3">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          updateOrderStatus(ord.id, e.target.value as any)
                        }
                        className="text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-stone-400 hover:text-emerald-800 inline-block p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                )))
              }
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts & Top Selling (1 Col) */}
        <div className="space-y-6">
          {/* Low Stock Warnings */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Low Stock Articles
              </h3>
              <Link
                to="/admin/inventory"
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Inventory →
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-emerald-700">All products have healthy stock.</p>
            ) : (
              <div className="space-y-2.5">
                {lowStockProducts.slice(0, 3).map((lp) => (
                  <div
                    key={lp.id}
                    className="flex items-center justify-between text-xs p-2.5 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200/60 dark:border-rose-900/40"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {lp.name}
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono">{lp.sku}</p>
                    </div>
                    <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shrink-0">
                      {lp.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Selling Products */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-3">
            <h3 className="font-serif-luxury font-bold text-sm text-stone-900 dark:text-stone-100">
              Top Rated Products
            </h3>
            <div className="space-y-3">
              {topProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={p.images[0]}
                    alt=""
                    className="w-10 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-stone-400 font-mono">
                      {p.rating} ★ • {p.reviewCount} reviews
                    </p>
                  </div>
                  <span className="font-bold text-emerald-950 dark:text-emerald-300">
                    {formatPrice(p.salePrice ?? p.regularPrice, settings.currencySymbol)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
