import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Leaf,
  Globe2,
  ArrowRight
} from 'lucide-react';


export const About = () => {
  return (
    <div className="bg-neutral-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Story Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-radial from-neutral-900 via-neutral-950 to-black text-white p-8 sm:p-16 lg:p-20 border border-neutral-800 shadow-2xl mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-4 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The NovaCart Heritage</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            Crafting the Future of Modern Commerce
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-10">
            NovaCart was founded on a simple conviction: modern consumers deserve timeless craftsmanship, transparent ethical sourcing, and uncompromising aesthetic delight.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-neutral-800 max-w-4xl mx-auto">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">50K+</p>
              <p className="text-xs text-neutral-400 font-medium mt-1">Global Dispatches</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">99.8%</p>
              <p className="text-xs text-neutral-400 font-medium mt-1">Courier On-Time Rate</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">4.9 / 5</p>
              <p className="text-xs text-neutral-400 font-medium mt-1">Verified Client Score</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">100%</p>
              <p className="text-xs text-neutral-400 font-medium mt-1">Carbon Balanced</p>
            </div>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-2">
              Our Genesis
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-6 leading-tight">
              Bridging Old-World Craft & Modern Innovation
            </h2>
            <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
              <p>
                In a retail landscape overflowing with disposable fast fashion and uninspired mass production, NovaCart emerged in 2024 as an antidote. We set out to curate a world where every item in your life possesses a reason, a story, and enduring durability.
              </p>
              <p>
                From mechanical automatic timepieces engineered in independent workshops to acoustic drivers hand-tuned for audiophiles and Mongolian double-faced cashmere, each creation undergoes rigorous quality audits before earning a place in our collection.
              </p>
              <p>
                We do not chase ephemeral fads. We design and partner for the long haul.
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80"
              alt="NovaCart Design Atelier"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Core Values Pillars */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-2">
              What Guides Us
            </span>
            <h2 className="text-3xl font-black text-neutral-900">
              Our Foundational Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                Uncompromising Quality
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We test materials down to stitch counts, tactile switch resistance, and acoustic dampening. Only pieces that pass 40+ inspection checkpoints are released.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                Conscious Sustainability
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                From biodegradable cornstarch packaging tape to 100% recycled Cordura fabrics and GOTS certified organic Egyptian cotton, planet stewardship is non-negotiable.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                White-Glove Support
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Experience dedicated concierge styling and logistics guidance. No automated maze, just thoughtful experts who care about your satisfaction.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-2xl font-black text-neutral-900 mb-1">
              Ready to experience NovaCart?
            </h3>
            <p className="text-xs text-neutral-500">
              Browse our latest arrivals and discover pieces made to inspire.
            </p>
          </div>
          <Link
            to="/shop"
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-indigo-600/25 flex items-center gap-2"
          >
            Explore Catalogue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
