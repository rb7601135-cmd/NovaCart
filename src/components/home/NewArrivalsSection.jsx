import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { ProductCard } from '../common/ProductCard';
import { QuickViewModal } from '../common/QuickViewModal';
import { useCms } from '../../hooks/useCms';
import { getNewArrivals } from '../../data/products';

export const NewArrivalsSection = () => {
  const { products } = useCms();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const newArrivals = useMemo(() => {
    const pool = products && products.length > 0 ? products : getNewArrivals();
    const filtered = pool.filter((p) => p.isNew);
    return filtered.length > 0 ? filtered.slice(0, 8) : pool.slice(0, 8);
  }, [products]);

  return (
    <section className="py-20 bg-neutral-50/70 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              <Flame className="w-4 h-4 text-indigo-600" />
              <span>Just Unveiled</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?sort=newest"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Explore All New Releases <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
};
