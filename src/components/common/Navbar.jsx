import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Package,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { useCms } from '../../hooks/useCms';
import { SearchOverlay } from './SearchOverlay';

export const Navbar = () => {
  const { totalItems, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useCms();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const accountRef = useRef(null);
  const prevPathRef = useRef(location.pathname);

  // Scroll listener for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setIsMobileMenuOpen(false);
      setIsAccountMenuOpen(false);
      setIsSearchOverlayOpen(false);
    }
  }, [location.pathname]);

  // Global search shortcut: Ctrl+K or Cmd+K or "/"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOverlayOpen(true);
      } else if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) &&
        !document.activeElement?.isContentEditable
      ) {
        e.preventDefault();
        setIsSearchOverlayOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Secret admin shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Click outside listener for account dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Orders', path: '/orders' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      {settings.isAnnouncementActive && (
        <div className="bg-neutral-900 text-neutral-300 text-[11px] sm:text-xs py-2 px-4 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {settings.announcementBadge && (
                <span className="hidden sm:inline font-medium">{settings.announcementBadge}</span>
              )}
              <span>{settings.announcementText}</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-neutral-400">
              <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                100% Authentic Guarantee
              </span>
              <span>Free Express Worldwide over ${settings.freeShippingThreshold || 100}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-neutral-200/80 py-3'
            : 'bg-white border-b border-neutral-200 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              {settings.storeLogo ? (
                <img
                  src={settings.storeLogo}
                  alt={settings.storeName}
                  className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1 border border-neutral-200 group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 group-hover:text-indigo-600 transition-colors">
                  {settings.storeName || 'NovaCart'}
                </span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-600 -mt-1 hidden sm:block">
                  {settings.storeTagline || 'Luxury Essentials'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Desktop Search Trigger Bar */}
            <button
              type="button"
              onClick={() => setIsSearchOverlayOpen(true)}
              className="relative flex-1 max-w-xs xl:max-w-sm hidden sm:flex items-center justify-between pl-3.5 pr-2.5 py-2 bg-neutral-100/90 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 rounded-xl border border-neutral-200/80 hover:border-neutral-300 transition-all text-xs sm:text-sm group cursor-pointer shadow-2xs"
              aria-label="Open search catalog"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Search className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                <span className="truncate text-neutral-500 group-hover:text-neutral-700">
                  Search products, styles...
                </span>
              </div>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400 bg-white border border-neutral-200/90 rounded shadow-xs shrink-0 group-hover:border-neutral-300">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Action Buttons: Search (Mobile), Wishlist, Cart, Account */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOverlayOpen(true)}
                className="sm:hidden p-2.5 text-neutral-700 hover:text-indigo-600 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Open search catalog"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* Wishlist Link */}
              <Link
                to="/account?tab=wishlist"
                aria-label={`Wishlist with ${wishlistCount} items`}
                className="relative p-2.5 text-neutral-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCartDrawer}
                aria-label={`Shopping cart with ${totalItems} items`}
                className="relative p-2.5 text-neutral-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Account Menu Dropdown */}
              <div ref={accountRef} className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
                >
                  {isAuthenticated && user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className="hidden xl:inline text-xs font-semibold text-neutral-800 max-w-[100px] truncate">
                    {isAuthenticated ? user.name.split(' ')[0] : 'Sign In'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
                </button>

                {/* Account Menu Popover */}
                <AnimatePresence>
                  {isAccountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 overflow-hidden"
                    >
                      {isAuthenticated ? (
                        <>
                          <div className="px-4 py-2.5 border-b border-neutral-100">
                            <p className="text-xs font-bold text-neutral-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-neutral-500 truncate">
                              {user.email}
                            </p>
                            <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {user.tier || 'Member'}
                            </span>
                          </div>

                          <div className="p-1 space-y-0.5">
                            <Link
                              to="/account"
                              onClick={() => setIsAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-indigo-600 hover:bg-neutral-50 rounded-xl transition-colors"
                            >
                              <User className="w-4 h-4" /> My Account
                            </Link>
                            <Link
                              to="/orders"
                              onClick={() => setIsAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-indigo-600 hover:bg-neutral-50 rounded-xl transition-colors"
                            >
                              <Package className="w-4 h-4" /> My Orders
                            </Link>
                            <Link
                              to="/account?tab=wishlist"
                              onClick={() => setIsAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-indigo-600 hover:bg-neutral-50 rounded-xl transition-colors"
                            >
                              <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
                            </Link>
                          </div>

                          <div className="p-1 border-t border-neutral-100">
                            <button
                              onClick={() => {
                                logout();
                                setIsAccountMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                            >
                              <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-2 space-y-1.5">
                          <Link
                            to="/login"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold text-center block transition-colors"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="w-full py-2 px-4 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-xl text-xs font-semibold text-center block transition-colors"
                          >
                            Create Account
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-4/5 max-w-sm h-full bg-white shadow-2xl flex flex-col p-6 z-10 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-xl text-neutral-900">
                    Nova<span className="text-indigo-600">Cart</span>
                  </span>
                </Link>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-neutral-800 rounded-lg hover:bg-neutral-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Input */}
              {/* Mobile Search Trigger */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOverlayOpen(true);
                }}
                className="mt-5 w-full flex items-center justify-between px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200/70 text-neutral-600 rounded-xl border border-neutral-200 transition-colors text-sm text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Search className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span className="truncate text-neutral-600 font-medium">Search catalog...</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-white px-2 py-0.5 rounded border border-neutral-200">
                  Open
                </span>
              </button>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1 mt-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1 px-3">
                  Menu
                </span>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                        isActive
                          ? 'text-indigo-600 bg-indigo-50'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`
                    }
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-40" />
                  </NavLink>
                ))}
              </div>

              {/* Auth Status & Account links in Mobile Drawer */}
              <div className="mt-auto pt-6 border-t border-neutral-100 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl mb-3">
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-2.5 px-4 bg-neutral-900 text-white rounded-xl text-xs font-semibold text-center block"
                    >
                      Go to Dashboard
                    </Link>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2.5 px-4 bg-neutral-900 text-white rounded-xl text-xs font-semibold text-center block"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2.5 px-4 border border-neutral-300 text-neutral-800 rounded-xl text-xs font-semibold text-center block"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Black Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />
    </header>
  );
};
