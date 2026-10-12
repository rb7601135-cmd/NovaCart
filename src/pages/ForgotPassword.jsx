import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    const res = await resetPassword(email);
    setIsLoading(false);

    if (res?.success) {
      setSubmitted(true);
    } else {
      setError(res?.error || 'Failed to send password reset link. Please verify your email.');
    }
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
          <h1 className="text-2xl font-extrabold text-neutral-900">Reset Password</h1>
          <p className="text-xs text-neutral-500 mt-1">
            {submitted
              ? 'Check your inbox for password recovery instructions.'
              : 'Enter your registered email address to receive a secure recovery link.'}
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-2">Password Reset Link Sent</h3>
            <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
              We&apos;ve sent an email to <span className="font-semibold text-neutral-900">{email}</span>. Click the link in the email to choose a new password.
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full py-3 px-4 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors block text-center"
              >
                Return to Sign In
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Didn&apos;t receive email? Try another address
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Account Email Address
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
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Sending Reset Link...</span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
