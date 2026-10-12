import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShoppingBag,
  ArrowRight,
  Sparkles
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithOAuth } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    const res = await login(email, password);
    setIsLoading(false);

    if (res?.success) {
      navigate('/account');
    } else {
      setError(res?.error || 'Failed to sign in. Please check your credentials.');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('alex.morgan@example.com');
    setPassword('••••••••••••');
    setIsLoading(true);
    const res = await login('alex.morgan@example.com', 'password', true);
    setIsLoading(false);
    if (res?.success) {
      navigate('/account');
    }
  };

  const handleOAuthLogin = async (provider) => {
    setIsLoading(true);
    await loginWithOAuth(provider);
    setIsLoading(false);
  };

  return (
    <div className="bg-neutral-50 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/80 shadow-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-neutral-900">
              Nova<span className="text-indigo-600">Cart</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-neutral-900">Welcome Back</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Sign in to access your orders, wishlist, and VIP perks.
          </p>
        </div>

        {/* Demo Fast Login Pill */}
        <div className="mb-6 p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-indigo-900 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Quick test? Use 1-Click Demo account</span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Fill Demo
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-neutral-700">Password</label>
              <button
                type="button"
                onClick={() => addToast('Reset link sent to demo address.', 'info')}
                className="text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-indigo-600 rounded"
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2 pt-3"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Social Mockup Buttons */}
        <div className="mt-6 pt-6 border-t border-neutral-100">
          <p className="text-center text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-3">
            Or continue with
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="py-2.5 px-3 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('apple')}
              className="py-2.5 px-3 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Apple</span>
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <p className="text-center text-xs text-neutral-500 mt-6">
          Don&apos;t have an account yet?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
