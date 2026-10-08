import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please provide a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Welcome to the NovaCart VIP Circle! Check your email for $20 off.', 'success');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-radial from-indigo-900 via-neutral-900 to-black text-white p-8 sm:p-14 lg:p-16 border border-neutral-800 shadow-2xl">
          {/* Subtle Ambient Dots/Lights */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-4 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Members Only Privilege</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              Get $20 Off Your First Order
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 mb-8 leading-relaxed">
              Subscribe to the NovaCart Gazette for early access to limited artisanal drops, private runway sales, and editorial lookbooks.
            </p>

            {subscribed ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-2xl flex items-center justify-center gap-3 text-emerald-300 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>You&apos;re subscribed! Check your inbox for your exclusive code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-3.5 bg-neutral-900/90 border border-neutral-700 rounded-2xl text-sm text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 shrink-0"
                >
                  Subscribe <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <p className="text-xs text-neutral-400 mt-4 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-neutral-400" />
              We respect your privacy. Unsubscribe at any time with one click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
