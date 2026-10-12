import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  ShoppingBag,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useCms } from '../../hooks/useCms';
import { useToast } from '../../hooks/useToast';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAdminAuthenticated, failedAttempts } = useAdminAuth();
  const { settings } = useCms();
  const { addToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated) {
      const destination = location.state?.from?.pathname || '/admin';
      navigate(destination, { replace: true });
    }
  }, [isAdminAuthenticated, navigate, location]);

  // Handle countdown if locked out
  useEffect(() => {
    const now = Date.now();
    if (failedAttempts.lockoutUntil && failedAttempts.lockoutUntil > now) {
      const remaining = Math.ceil((failedAttempts.lockoutUntil - now) / 1000);
      setCountdown(remaining);

      const timer = setInterval(() => {
        const currentRemaining = Math.ceil((failedAttempts.lockoutUntil - Date.now()) / 1000);
        if (currentRemaining <= 0) {
          setCountdown(0);
          clearInterval(timer);
        } else {
          setCountdown(currentRemaining);
        }
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCountdown(0);
    }
  }, [failedAttempts.lockoutUntil]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please provide both username and password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsSubmitting(false);

      if (res.success) {
        addToast('Admin authentication verified. Welcome back!', 'success');
        const destination = location.state?.from?.pathname || '/admin';
        navigate(destination, { replace: true });
      } else {
        setErrorMessage(res.error);
        addToast(res.error, 'error');
      }
    }, 400);
  };

  const isLocked = countdown > 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden select-none">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Branding & Shield Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl shadow-indigo-500/10 group">
            {settings.storeLogo ? (
              <img
                src={settings.storeLogo}
                alt={settings.storeName}
                className="w-10 h-10 object-contain rounded-xl"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              <span>{settings.storeName || 'NovaCart'}</span>
              <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Portal
              </span>
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Restricted management access • Authorized administrators only
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 text-xs">
            <span className="font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              Security Check
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Protected
            </span>
          </div>

          {/* Lockout Warning Banner */}
          {isLocked && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-white">Terminal Temporarily Locked</div>
                <div>
                  Too many consecutive failed attempts. Retry enabled in{' '}
                  <strong className="text-white font-mono text-sm underline">{countdown}s</strong>.
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && !isLocked && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Username or Admin Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  disabled={isLocked || isSubmitting}
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950/70 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLocked || isSubmitting}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-neutral-950/70 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLocked || isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <span>Authenticating Terminal...</span>
              ) : isLocked ? (
                <span>Locked ({countdown}s)</span>
              ) : (
                <>
                  <span>Authenticate & Enter CMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Hint Banner */}
          <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
            <div className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Default Initial Credentials:</span>
            </div>
            <div className="font-mono text-[10px] text-neutral-400 pl-5">
              User: <strong className="text-white">admin</strong> | Pass: <strong className="text-white">admin123</strong>
            </div>
          </div>

        </div>

        {/* Footer Link back to storefront */}
        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors inline-flex items-center gap-1"
          >
            <span>&larr; Return to Public Storefront</span>
          </Link>
        </div>

      </div>

    </div>
  );
};
