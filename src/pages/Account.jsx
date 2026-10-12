import React, { useState, useEffect, useRef } from 'react';
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
  ExternalLink,
  MapPin,
  Plus,
  Compass,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { formatPrice } from '../utils/currency';

export const Account = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const {
    user,
    orders,
    updateProfile,
    updateAvatar,
    addAddress,
    removeAddress,
    setDefaultAddress,
    updatePassword,
    resetPassword,
    logout
  } = useAuth();

  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const fileInputRef = useRef(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Synchronize profileForm when user loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Password Change state
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: 'Home',
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false
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
    addToast('Profile updated successfully!', 'success');
  };

  // Profile image upload handler (compresses to clean base64)
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        updateAvatar(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Auto-Detect Current GPS Location & Reverse Geocode
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address || {};

          const streetParts = [
            addr.house_number,
            addr.road || addr.street || addr.pedestrian || addr.suburb
          ].filter(Boolean);

          setAddressForm((prev) => ({
            ...prev,
            street: streetParts.join(' ') || prev.street,
            city: addr.city || addr.town || addr.village || addr.county || prev.city,
            state: addr.state || prev.state,
            postalCode: addr.postcode || prev.postalCode,
            country: addr.country || prev.country
          }));

          addToast('Location detected successfully!', 'success');
        } catch {
          addToast('Could not resolve street address from location coordinates.', 'error');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        let msg = 'Failed to detect location.';
        if (err.code === 1) msg = 'Location access was denied. Please allow location permissions in your browser.';
        else if (err.code === 2) msg = 'Location unavailable.';
        else if (err.code === 3) msg = 'Location request timed out.';
        addToast(msg, 'error');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.street || !addressForm.city) {
      addToast('Please enter at least street and city.', 'error');
      return;
    }

    await addAddress(addressForm);
    setIsAddressModalOpen(false);
    setAddressForm({
      title: 'Home',
      fullName: user?.name || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      isDefault: false
    });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      addToast('Password must be at least 8 characters long.', 'error');
      return;
    }
    setIsUpdatingPassword(true);
    const res = await updatePassword(newPassword);
    setIsUpdatingPassword(false);
    if (res?.success) {
      setNewPassword('');
    }
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
            <div className="relative group">
              <img
                src={user?.avatar}
                alt={user?.name || 'Customer'}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-indigo-50 border border-neutral-200 shadow-md bg-neutral-100"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 rounded-full bg-neutral-900 text-white hover:bg-indigo-600 shadow-md transition-all hover:scale-105 cursor-pointer"
                title="Upload profile picture"
                aria-label="Upload profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
                  {user?.name || 'Valued Customer'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {user?.tier || 'Member'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mb-2">{user?.email}</p>
              <p className="text-[11px] text-neutral-400">
                NovaCart Member since {user?.joinDate || 'Recently'} • Secure Account Active
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
              <p className="text-xl font-black text-indigo-600">Active</p>
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
                { id: 'profile', label: 'My Profile & Addresses', icon: User },
                { id: 'orders', label: 'Recent Orders', icon: Package, badge: orders.length },
                { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, badge: wishlist.length },
                { id: 'settings', label: 'Account Settings', icon: Settings }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
                      className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="w-full px-3.5 py-2.5 bg-neutral-100/70 rounded-xl text-xs sm:text-sm border border-neutral-200 text-neutral-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>

                {/* Stored Addresses Section */}
                <div className="pt-8 border-t border-neutral-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">Saved Shipping Destinations</h3>
                      <p className="text-xs text-neutral-500">Auto-detect your location or add multiple shipping addresses.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 self-start sm:self-auto transition-colors shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Address</span>
                    </button>
                  </div>

                  {(!user?.addresses || user.addresses.length === 0) ? (
                    <div className="p-8 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 text-center">
                      <MapPin className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-neutral-800 mb-1">No Delivery Address Set</h4>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
                        Add your address or use GPS auto-detect to speed up future checkouts.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsAddressModalOpen(true)}
                        className="px-5 py-2.5 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Add Delivery Address</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`p-4 rounded-2xl bg-neutral-50 border transition-all relative ${
                            addr.isDefault ? 'border-indigo-400 ring-2 ring-indigo-50 shadow-xs' : 'border-neutral-200/80'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-neutral-900">{addr.title}</span>
                            {addr.isDefault ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                Primary
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDefaultAddress(addr.id)}
                                className="text-[10px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                              >
                                Set as Primary
                              </button>
                            )}
                          </div>
                          {addr.fullName && (
                            <p className="text-xs font-semibold text-neutral-800 mb-0.5">{addr.fullName}</p>
                          )}
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {addr.street}<br />
                            {addr.city}, {addr.state} {addr.postalCode}<br />
                            {addr.country}
                          </p>
                          <div className="mt-3 pt-3 border-t border-neutral-200/60 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeAddress(addr.id)}
                              className="text-xs text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 font-medium cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500 text-xs">
                      No orders placed yet.
                    </div>
                  ) : (
                    orders.map((ord) => (
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

                        <div className="flex flex-wrap gap-3">
                          {ord.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-neutral-200"
                                />
                              )}
                              <span className="text-xs text-neutral-700 font-medium">
                                {item.name} (x{item.quantity})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 3. Tab: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
                <div className="pb-4 border-b border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900">Saved Wishlist</h2>
                  <p className="text-xs text-neutral-500">Products you have saved for later.</p>
                </div>

                {wishlist.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500 text-xs">
                    Your wishlist is currently empty.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-36 object-cover rounded-xl mb-3"
                          />
                        )}
                        <h4 className="text-xs font-bold text-neutral-900 truncate">{item.name}</h4>
                        <p className="text-xs font-extrabold text-neutral-900 mt-1">{formatPrice(item.price)}</p>
                        <button
                          type="button"
                          onClick={() => handleMoveWishlistToCart(item)}
                          className="w-full mt-3 py-2 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                        </button>
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
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                      Security & Password
                    </h3>
                    <p className="text-xs text-neutral-500 mb-4">
                      Update your account password or request a password reset link to your email.
                    </p>
                    <form onSubmit={handlePasswordUpdate} className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="submit"
                          disabled={isUpdatingPassword || !newPassword}
                          className="px-4 py-2.5 bg-neutral-900 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          {isUpdatingPassword ? 'Updating...' : 'Save New Password'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (user?.email) {
                              resetPassword(user.email);
                            }
                          }}
                          className="px-4 py-2.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          Send Reset Link to Email
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Add Address Modal with Location Detection */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Add Delivery Destination</h3>
                <p className="text-xs text-neutral-500">Provide shipping address or detect via GPS.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPS Auto Detect Pill */}
            <div className="mb-5 p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-indigo-950 font-medium">
                <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Fill automatically with current GPS location?</span>
              </div>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {isDetectingLocation ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Auto-Detect</span>
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Label</label>
                  <input
                    type="text"
                    value={addressForm.title}
                    onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                    placeholder="e.g. Home, Office"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    placeholder="Recipient's Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="Street and apartment / suite number"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">State / Province</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    placeholder="ZIP / Postal Code"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Country</label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    placeholder="Country"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                  <span>Make this my primary delivery destination</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2.5 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
