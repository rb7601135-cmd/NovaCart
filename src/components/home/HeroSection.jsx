import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Award } from 'lucide-react';


export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-radial from-neutral-900 via-neutral-950 to-black text-white pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-violet-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/80 backdrop-blur-md text-xs font-semibold text-indigo-300 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Autumn 2026 Architectural Collection</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
              Discover products <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-white">
                you&apos;ll love.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl leading-relaxed mb-8">
              Explore meticulously crafted timepieces, concert-grade acoustic headphones, tailored organic garments, and Scandinavian minimalist home essentials.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/categories"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98"
              >
                Explore Collection
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-800/80 w-full max-w-lg">
              <div>
                <p className="text-2xl font-black text-white">50K+</p>
                <p className="text-xs text-neutral-400 font-medium">Curated Items Sold</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">4.9/5</p>
                <p className="text-xs text-neutral-400 font-medium">Verified Customer Score</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">99.8%</p>
                <p className="text-xs text-neutral-400 font-medium">On-Time Global Delivery</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Collage Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            {/* Main Featured Showcase Card */}
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-neutral-900/80 backdrop-blur-md shadow-2xl p-4 sm:p-5 group">
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
                  alt="Aether Pro Headphones"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 bg-neutral-950/80 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Editor&apos;s Choice 2026
                </div>

                {/* Glass Info Pill at Bottom */}
                <div className="absolute inset-x-4 bottom-4 bg-neutral-950/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Audio & Acoustics
                    </p>
                    <p className="text-sm font-bold text-white truncate max-w-[180px]">
                      Aether Pro Wireless
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-400 line-through">$379.99</p>
                    <p className="text-base font-extrabold text-emerald-400">$299.99</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Floating Accent Badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 sm:-left-8 bg-white text-neutral-900 p-4 rounded-2xl shadow-2xl border border-neutral-100 flex items-center gap-3.5 z-20"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 font-bold">
                <Zap className="w-5 h-5 fill-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">Same Day Dispatch</p>
                <p className="text-[11px] text-neutral-500 font-medium">Orders placed before 2PM</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
