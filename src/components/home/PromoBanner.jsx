import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const PromoBanner = () => {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('NOVA20');
    setCopied(true);
    addToast('Coupon code NOVA20 copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-16 bg-neutral-900 text-white relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/25 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-indigo-950 border border-neutral-700/80 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left Text */}
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Limited Flash Event</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
              Save 20% on Every Single Order
            </h3>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6">
              Unlock extraordinary savings across premium electronics, luxury timepieces, and apparel with our exclusive seasonal VIP checkout code.
            </p>

            {/* Promo Code Box */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <div className="flex items-center gap-3 px-4 py-3 bg-black/60 rounded-2xl border border-neutral-700">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                  Promo Code:
                </span>
                <span className="text-base font-extrabold text-amber-400 tracking-wider font-mono">
                  NOVA20
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
                  title="Copy Code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <Link
                to="/shop"
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
              >
                Claim Discount <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Countdown Timer Card */}
          <div className="bg-neutral-950/70 border border-neutral-800 p-6 sm:p-8 rounded-2xl backdrop-blur-md flex flex-col items-center shrink-0 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
              <Clock className="w-4 h-4 text-amber-400" /> Offer Expires In
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-white font-mono shadow-inner">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase mt-2">Hours</span>
              </div>

              <span className="text-2xl font-bold text-neutral-500 -mt-6">:</span>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-white font-mono shadow-inner">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase mt-2">Minutes</span>
              </div>

              <span className="text-2xl font-bold text-neutral-500 -mt-6">:</span>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-emerald-400 font-mono shadow-inner">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase mt-2">Seconds</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
