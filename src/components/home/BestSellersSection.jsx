import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { ProductCard } from '../common/ProductCard';
import { QuickViewModal } from '../common/QuickViewModal';
import { useCms } from '../../hooks/useCms';
import { getBestSellers } from '../../data/products';

export const BestSellersSection = () => {
  const { products } = useCms();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const bestSellers = useMemo(() => {
    const pool = products && products.length > 0 ? products : getBestSellers();
    const filtered = pool.filter((p) => p.isBestSeller || p.reviewsCount > 150);
    return filtered.length > 0 ? filtered.slice(0, 8) : pool.slice(0, 8);
  }, [products]);

  return (
    <section className="py-20 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/shop?sort=popularity"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Explore All Best Sellers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {bestSellers.slice(0, 4).map((product) => (
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
