import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  RotateCcw,
  Star
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithOAuth, isAuthenticated } = useAuth();

  const redirectPath = location.state?.from?.pathname || '/account';

  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect automatically
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    const res = await login(email, password);
    setIsLoading(false);

    if (res?.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(res?.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleOAuthLogin = async (provider) => {
    setIsLoading(true);
    await loginWithOAuth(provider);
    setIsLoading(false);
  };

  return (
    <div className="bg-neutral-50 min-h-[90vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border border-neutral-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Visual Panel: Brand & Perks (Hidden on small screens) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-neutral-900 via-neutral-950 to-indigo-950 text-white p-10 flex-col justify-between relative overflow-hidden">
          {/* Subtle glow orb */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Nova<span className="text-indigo-400">Cart</span>
              </span>
            </Link>

            <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-white mb-3">
              Curated Luxury, Seamless Delivery.
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Sign in to manage your saved destinations, track orders in real-time, and unlock VIP member benefits.
            </p>
          </div>

          {/* Middle Feature Highlights */}
          <div className="space-y-4 my-8 relative z-10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 text-indigo-400">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Priority Express Courier</p>
                <p className="text-[11px] text-neutral-400">Real-time live map tracking to your door.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 text-indigo-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Bank-Grade Isolation</p>
                <p className="text-[11px] text-neutral-400">Row-level security protecting your personal data.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 text-indigo-400">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">30-Day Hassle-Free Returns</p>
                <p className="text-[11px] text-neutral-400">One-click returns and instant refunds.</p>
              </div>
            </div>
          </div>

          {/* Bottom Testimonial Pill */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative z-10">
            <div className="flex items-center gap-1 text-amber-400 mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs italic text-neutral-300">
              &ldquo;The fastest and most reliable checkout experience I&apos;ve used.&rdquo;
            </p>
            <p className="text-[10px] text-neutral-400 mt-1 font-semibold uppercase tracking-wider">
              Verified NovaCart Member
            </p>
          </div>
        </div>

        {/* Right Form Panel: Executive Sign In */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          
          {/* Header Mobile Brand */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-neutral-900">
                Nova<span className="text-indigo-600">Cart</span>
              </span>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Customer Sign In
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
              Welcome back! Please enter your account credentials to continue.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-medium"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{error}</p>
                  {error.toLowerCase().includes('not confirmed') && (
                    <p className="mt-1 text-[11px] text-rose-600 font-normal">
                      Tip: If this email was created before email confirmation was turned off, you can register a new test email or click the 1-Click Sign In button above.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 rounded-2xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-neutral-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 bg-neutral-50 rounded-2xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-indigo-600 active:scale-[0.99] disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-neutral-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Sign In Divider */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <div className="relative flex justify-center text-xs uppercase mb-4">
              <span className="bg-white px-3 text-[11px] font-semibold text-neutral-400">
                Or continue with
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className="py-2.5 px-3 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 rounded-2xl text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleOAuthLogin('github')}
                className="py-2.5 px-3 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 rounded-2xl text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* Switch to Register */}
          <p className="text-center text-xs text-neutral-500 mt-8">
            Don&apos;t have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Create an account
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};
