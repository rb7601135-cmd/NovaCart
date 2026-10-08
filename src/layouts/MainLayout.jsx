import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CartDrawer } from '../components/common/CartDrawer';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MainLayout = () => {
  const { pathname } = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Track scroll position for floating back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <Footer />

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-30 w-11 h-11 rounded-full bg-neutral-900/90 backdrop-blur-md text-white shadow-xl hover:bg-indigo-600 flex items-center justify-center transition-all duration-200 border border-neutral-700 hover:scale-105 active:scale-95"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
