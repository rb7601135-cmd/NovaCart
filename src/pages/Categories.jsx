import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layers } from 'lucide-react';

import { categories } from '../data/categories';
import { products as staticProducts } from '../data/products';
import { useCms } from '../hooks/useCms';

export const Categories = () => {
  const { products: cmsProducts } = useCms();
  const products = cmsProducts && cmsProducts.length > 0 ? cmsProducts : staticProducts;
  return (
    <div className="bg-neutral-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Departments</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight mb-4">
            Explore All Categories
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Delve into our specialized ateliers. From audiophile soundscapes to timeless tailored cashmere and minimalist homeware.
          </p>
        </div>

        {/* Categories Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const count = products.filter((p) => p.category === cat.id).length;
            const categoryProducts = products.filter((p) => p.category === cat.id).slice(0, 3);

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Banner Image */}
                <div className="relative aspect-16/9 overflow-hidden bg-neutral-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                  
                  <span className="absolute bottom-3 left-4 text-xs font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                    {count} Products in Catalogue
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors mb-2">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                      {cat.description}
                    </p>

                    {/* Preview Thumbnails */}
                    {categoryProducts.length > 0 && (
                      <div className="mb-6">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                          Featured in this collection
                        </span>
                        <div className="flex gap-2">
                          {categoryProducts.map((p) => (
                            <Link
                              key={p.id}
                              to={`/product/${p.id}`}
                              className="w-12 h-12 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0 hover:scale-105 transition-transform"
                              title={p.name}
                            >
                              <img src={p.image} alt="" className="w-full h-full object-cover" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA link */}
                  <Link
                    to={`/shop?category=${cat.id}`}
                    className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-indigo-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-colors mt-auto"
                  >
                    <span>Browse {cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
