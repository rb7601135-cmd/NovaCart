import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  LogOut
} from 'lucide-react';
import { useCms } from '../hooks/useCms';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useToast } from '../hooks/useToast';

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { settings, products, orders, customers } = useCms();
  const { logout, adminUser } = useAdminAuth();
  const { addToast } = useToast();
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package,
      badge: products.length
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBag,
      badge: orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length,
      badgeColor: 'bg-amber-500'
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: Users,
      badge: customers.length
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings
    }
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Executive Dashboard';
    if (path.startsWith('/admin/products')) return 'Product Management';
    if (path.startsWith('/admin/orders')) return 'Orders & Fulfillment';
    if (path.startsWith('/admin/customers')) return 'Customer Directory';
    if (path.startsWith('/admin/settings')) return 'Store & System Settings';
    return 'CMS Admin';
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex text-neutral-900 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-neutral-950 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-800/80 bg-neutral-950">
            <Link to="/admin" className="flex items-center gap-3 group">
              {settings.storeLogo ? (
                <img
                  src={settings.storeLogo}
                  alt={settings.storeName}
                  className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1 border border-neutral-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  {settings.storeName}
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    CMS
                  </span>
                </span>
                <span className="text-[11px] text-neutral-400 truncate max-w-[140px]">
                  {settings.storeTagline || 'Admin Portal'}
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Store Quick Switcher Banner */}
          <div className="p-4">
            <Link
              to="/"
              className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-neutral-900 border border-indigo-800/40 text-neutral-200 hover:text-white hover:border-indigo-500 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    Live Storefront
                  </div>
                  <div className="text-[10px] text-neutral-400">View customer store</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-400 transition-colors" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-2 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-1">
              Store Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        item.badgeColor
                          ? `${item.badgeColor} text-white`
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Admin User Footer Card with Sign Out */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-950 space-y-2">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-neutral-700">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {adminUser?.username || 'admin'}
              </div>
              <div className="text-[11px] text-neutral-400 truncate">
                {adminUser?.role || 'Super Admin'}
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <button
            onClick={() => {
              logout();
              addToast('Admin terminal session ended. Signed out safely.', 'info');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 border border-neutral-800/80 hover:border-rose-800/40 text-xs font-semibold transition-all duration-150"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Terminal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-neutral-700 hover:bg-neutral-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                <span>NovaCart CMS</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-indigo-600 font-semibold">{getPageTitle()}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/admin/products"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Product</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
