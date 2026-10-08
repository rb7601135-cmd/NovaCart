import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    setIsSubscribed(true);
    addToast('Thank you for subscribing! Check your inbox for your 15% welcome code.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-900 mt-20">
      {/* Top Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-neutral-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-indigo-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Free Express Delivery</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Complimentary worldwide courier on all orders exceeding $100.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Certified Authenticity</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Direct from verified artisans & vetted premier manufacturers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-indigo-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">30-Day Returns</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Hassle-free return policy with prepaid shipping labels provided.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-indigo-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">24/7 Concierge Support</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Dedicated client specialists on standby for styling and order guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                Nova<span className="text-indigo-400">Cart</span>
              </span>
            </Link>

            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Discover curated excellence. We bring together modern luxury garments, precision audio, ergonomic home aesthetics, and forward-thinking technology.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-2">
                Join our Private VIP List
              </h5>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {isSubscribed && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> You are on the VIP guest list!
                </p>
              )}
            </div>
          </div>

          {/* Column: Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Categories
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/shop?category=electronics" className="hover:text-white transition-colors">
                  Electronics & Gadgets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=audio" className="hover:text-white transition-colors">
                  Audio & Acoustics
                </Link>
              </li>
              <li>
                <Link to="/shop?category=fashion" className="hover:text-white transition-colors">
                  Fashion & Apparel
                </Link>
              </li>
              <li>
                <Link to="/shop?category=footwear" className="hover:text-white transition-colors">
                  Footwear & Sneakers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="hover:text-white transition-colors">
                  Luxury Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home" className="hover:text-white transition-colors">
                  Home & Living
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Quick Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Customer Account
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Story & Mission
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Customer Care */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Help Center & FAQ
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Shipping Status
                </Link>
              </li>
              <li>
                <span className="text-neutral-500 cursor-not-allowed">
                  Returns & Exchanges
                </span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-not-allowed">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-not-allowed">
                  Terms of Service
                </span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center gap-2 text-neutral-400 text-xs">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>256-bit SSL Secure Checkout</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <div>
          &copy; {CURRENT_YEAR} NovaCart Inc. All rights reserved. Built with React & Vite.
        </div>


        {/* Payment Methods Simulation */}
        <div className="flex items-center gap-3 text-neutral-400">
          <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800 text-[10px] font-bold">VISA</span>
          <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800 text-[10px] font-bold">MC</span>
          <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800 text-[10px] font-bold">AMEX</span>
          <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800 text-[10px] font-bold">APPLE PAY</span>
          <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800 text-[10px] font-bold">PAYPAL</span>
        </div>
      </div>
    </footer>
  );
};
