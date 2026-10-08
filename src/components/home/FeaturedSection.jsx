import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../common/ProductCard';
import { QuickViewModal } from '../common/QuickViewModal';
import { getFeaturedProducts } from '../../data/products';

export const FeaturedSection = () => {
  const featured = getFeaturedProducts();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Curated Highlights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View Full Catalogue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
};
