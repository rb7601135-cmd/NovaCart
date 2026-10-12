import React from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Package,
  Plus
} from 'lucide-react';
import { useCms } from '../../hooks/useCms';

export const AdminDashboard = () => {
  const { metrics, orders, products, settings, formatMoney, updateOrderStatus } = useCms();

  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter((p) => Number(p.stock) <= 10).slice(0, 4);

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'In Transit':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white p-6 sm:p-8 border border-neutral-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Store Status: Live & Operational
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back to {settings.storeName} CMS
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Your store is performing smoothly. Monitor live sales, fulfill orders, manage your catalog, and tweak store branding below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/products"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
            <Link
              to="/admin/settings"
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-colors border border-neutral-700 flex items-center gap-2"
            >
              <span>Store Settings</span>
            </Link>
          </div>
        </div>

        {/* Decorative background blur gradient */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Gross Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {formatMoney(metrics.totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {metrics.totalOrdersCount}
            </div>
            <div className="text-xs text-neutral-500 font-medium mt-1">
              <strong className="text-amber-600">{metrics.pendingOrdersCount}</strong> awaiting fulfillment
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Customer Directory
            </span>
            <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {metrics.totalCustomersCount}
            </div>
            <div className="text-xs text-neutral-500 font-medium mt-1">
              Verified registered profiles
            </div>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Low Stock Alerts
            </span>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                metrics.lowStockCount > 0
                  ? 'bg-rose-50 text-rose-600 border-rose-100'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {metrics.lowStockCount}
            </div>
            <div className="text-xs text-neutral-500 font-medium mt-1">
              {metrics.lowStockCount > 0 ? (
                <span className="text-rose-600 font-bold">Needs restock attention</span>
              ) : (
                <span className="text-emerald-600 font-bold">All inventory healthy</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Orders & Inventory Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-black text-neutral-900 tracking-tight">
                Recent Orders Pipeline
              </h3>
              <p className="text-xs text-neutral-500">Live order activities and fulfillment statuses</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Total</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 font-bold text-neutral-900 font-mono">
                      #{order.id}
                      <div className="text-[10px] text-neutral-400 font-sans font-normal">
                        {order.date}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-neutral-800">
                        {order.shippingAddress?.fullName || 'Alex Morgan'}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate max-w-[140px]">
                        {order.items?.length || 1} item(s)
                      </div>
                    </td>
                    <td className="py-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer bg-white ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 text-right font-black text-neutral-900">
                      {formatMoney(order.total)}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Inventory Alerts & Quick Stats (1 col) */}
        <div className="space-y-6">
          
          {/* Low Stock Items Card */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-black text-neutral-900 tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Low Inventory Watch</span>
              </h3>
              <Link
                to="/admin/products"
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                All Products
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400">
                All inventory quantities are above threshold!
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-neutral-50 border border-neutral-100"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        Price: {formatMoney(p.price)}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black">
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick CMS Shortcuts Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-neutral-950 rounded-3xl p-6 text-white space-y-4 shadow-xl border border-indigo-800/40">
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-400" />
              <span>Quick Actions</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Instant shortcuts to configure your shop identity, check orders, or customize email triggers.
            </p>

            <div className="space-y-2 pt-1">
              <Link
                to="/admin/settings"
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                <span>Edit Logo & Brand Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
              </Link>
              <Link
                to="/admin/settings"
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                <span>SMTP & Email Notification Config</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
              </Link>
              <Link
                to="/admin/customers"
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                <span>View Customer CRM & LTV</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
