import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/categories';
import { useCms } from '../../hooks/useCms';

export const CategoriesSection = () => {
  const { products } = useCms();
  return (
    <section className="py-20 bg-neutral-100/60 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-2">
              Browse Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, index) => {
            const count = (products || []).filter((p) => p.category === cat.id).length || cat.itemCount;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Link
                  to={`/shop?category=${cat.id}`}
                  className="group relative block rounded-3xl overflow-hidden aspect-4/3 shadow-md hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent transition-opacity" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-end text-white">
                    <span className="text-xs font-semibold text-indigo-300 mb-1">
                      {count} Premium Pieces
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
                      {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-2 mb-3 opacity-90">
                    {cat.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Explore Department <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
