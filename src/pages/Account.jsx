import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  Settings,
  Camera,
  Trash2,
  ShoppingBag,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { formatPrice } from '../utils/currency';

export const Account = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, orders, updateProfile, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };


  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handleMoveWishlistToCart = (item) => {
    addToCart(item, 1);
    removeFromWishlist(item.id);
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={user?.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-indigo-50 border border-neutral-200 shadow-md"
              />
              <button
                onClick={() => addToast('Avatar upload available in backend sync.', 'info')}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-neutral-900 text-white hover:bg-indigo-600 shadow-sm transition-colors"
                title="Change photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
                  {user?.name || 'Alex Morgan'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {user?.tier || 'Diamond VIP'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mb-2">{user?.email}</p>
              <p className="text-[11px] text-neutral-400">
                NovaCart Member since {user?.joinDate || 'March 2024'} • Free Express Perks Active
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-neutral-100 pt-4 md:pt-0 md:pl-8 text-center">
            <div>
              <p className="text-xl font-black text-neutral-900">{orders.length}</p>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase">Orders</p>
            </div>
            <div>
              <p className="text-xl font-black text-neutral-900">{wishlist.length}</p>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase">Wishlist</p>
            </div>
            <div>
              <p className="text-xl font-black text-emerald-600">VIP</p>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase">Status</p>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Nav (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-3 border border-neutral-200/80 shadow-xs space-y-1">
              {[
                { id: 'profile', label: 'My Profile', icon: User },
                { id: 'orders', label: 'Recent Orders', icon: Package, badge: orders.length },
                { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, badge: wishlist.length },
                { id: 'settings', label: 'Account Settings', icon: Settings }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
                      activeTab === item.id
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          activeTab === item.id
                            ? 'bg-white/20 text-white'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-2 border-t border-neutral-100 mt-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area (lg:col-span-9) */}
          <div className="lg:col-span-9">
            
            {/* 1. Tab: Profile */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-8">
                <div className="pb-4 border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">Personal Details</h2>
                    <p className="text-xs text-neutral-500">Manage your name, contact email, and primary phone.</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>

                {/* Stored Addresses Section */}
                <div className="pt-8 border-t border-neutral-100">
                  <h3 className="text-sm font-bold text-neutral-900 mb-4">Saved Shipping Destinations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user?.addresses?.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 relative"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-neutral-900">{addr.title}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {addr.street}<br />
                          {addr.city}, {addr.state} {addr.postalCode}<br />
                          {addr.country}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Tab: Orders */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">Your Recent Orders</h2>
                    <p className="text-xs text-neutral-500">View real-time tracking, receipts, and order summaries.</p>
                  </div>
                  <Link
                    to="/orders"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                  >
                    View All Orders <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors bg-neutral-50/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-200/60">
                        <div>
                          <span className="text-xs font-bold text-neutral-900">Order #{ord.id}</span>
                          <span className="text-xs text-neutral-500 ml-3">{ord.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-neutral-900">
                            {formatPrice(ord.total)}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'In Transit'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto">
                          {ord.items.map((it, i) => (
                            <img
                              key={i}
                              src={it.image}
                              alt={it.name}
                              className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                              title={it.name}
                            />
                          ))}
                        </div>
                        <Link
                          to="/orders"
                          className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition-colors"
                        >
                          Track Package
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Tab: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
                <div className="pb-4 border-b border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900">
                    Saved Wishlist ({wishlist.length})
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Items you bookmarked for later. Move them directly to your bag when ready.
                  </p>
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-neutral-800">Your wishlist is empty</p>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 mb-6">
                      Explore our products and tap the heart icon to save your favorites.
                    </p>
                    <Link
                      to="/shop"
                      className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
                    >
                      Browse Catalogue
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-neutral-200 overflow-hidden bg-white flex flex-col justify-between"
                      >
                        <div className="relative aspect-square overflow-hidden bg-neutral-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-rose-600 shadow-xs hover:bg-white transition-colors"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs font-bold text-neutral-900 line-clamp-1 mb-1">
                              {item.name}
                            </p>
                            <p className="text-xs font-extrabold text-neutral-900">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleMoveWishlistToCart(item)}
                            className="w-full mt-4 py-2 px-3 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Tab: Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
                <div className="pb-4 border-b border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900">Account Preferences</h2>
                  <p className="text-xs text-neutral-500">Configure notifications, security credentials, and alerts.</p>
                </div>

                <div className="space-y-6 max-w-xl">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                      Email & SMS Alerts
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 cursor-pointer">
                        <span className="text-xs font-semibold text-neutral-800">
                          Order Dispatch & Tracking Emails
                        </span>
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          className="w-4 h-4 accent-indigo-600"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 cursor-pointer">
                        <span className="text-xs font-semibold text-neutral-800">
                          SMS Instant Courier Notifications
                        </span>
                        <input
                          type="checkbox"
                          checked={smsNotifications}
                          onChange={(e) => setSmsNotifications(e.target.checked)}
                          className="w-4 h-4 accent-indigo-600"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                      Security & Password
                    </h3>
                    <button
                      type="button"
                      onClick={() => addToast('Password reset link sent to registered email.', 'info')}
                      className="px-4 py-2.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 hover:bg-neutral-50"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
