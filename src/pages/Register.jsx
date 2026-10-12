import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    setError('');

    const res = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password
    });

    setIsLoading(false);

    if (res?.success) {
      if (res.needsConfirmation) {
        setRegisteredEmail(formData.email.trim());
      } else {
        navigate('/account');
      }
    } else {
      setError(res?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="bg-neutral-50 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-2xl font-extrabold text-neutral-900">Create an Account</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Join NovaCart for personalized order tracking and VIP perks.
          </p>
        </div>

        {registeredEmail ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-2">Check Your Email</h3>
            <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
              We&apos;ve sent a confirmation link to{' '}
              <span className="font-semibold text-neutral-900">{registeredEmail}</span>. Please verify your email to log in and start shopping.
            </p>
            <Link
              to="/login"
              className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors block text-center"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <>
            {/* Security Badge */}
            <div className="mb-6 p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center gap-2.5 text-xs text-indigo-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Passwords are hashed and protected with Supabase Auth</span>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                <p>{error}</p>
                {(error.toLowerCase().includes('already registered') || error.toLowerCase().includes('already exists')) && (
                  <div className="mt-2 pt-2 border-t border-rose-200/60">
                    <button
                      type="button"
                      onClick={() => navigate('/login', { state: { email: formData.email } })}
                      className="font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Sign In with {formData.email} &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Johnson"
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength <= 1
                            ? 'w-1/4 bg-rose-500'
                            : strength === 2
                            ? 'w-2/4 bg-amber-500'
                            : strength === 3
                            ? 'w-3/4 bg-indigo-500'
                            : 'w-full bg-emerald-500'
                        }`}
                      />
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Strength:{' '}
                      <span className="font-bold">
                        {strength <= 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : 'Very Strong'}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 text-xs text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="accent-indigo-600 rounded mt-0.5"
                  />
                  <span>
                    I agree to the{' '}
                    <span className="text-neutral-900 underline font-medium">Terms of Service</span> and{' '}
                    <span className="text-neutral-900 underline font-medium">Privacy Policy</span>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2 pt-3 cursor-pointer"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <p className="text-center text-xs text-neutral-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:underline">
                Sign In here
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};
