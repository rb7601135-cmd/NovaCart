import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  LayoutGrid,
  Grid3X3,
  ChevronDown
} from 'lucide-react';

import { products as fallbackProducts } from '../data/products';
import { useCms } from '../hooks/useCms';
import { categories } from '../data/categories';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { formatPrice } from '../utils/currency';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: cmsProducts } = useCms();

  const products = cmsProducts && cmsProducts.length > 0 ? cmsProducts : fallbackProducts;
  const productsLoading = false;

  // Search & Filters state
  const selectedCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'featured';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [priceRange, setPriceRange] = useState(3000);
  const [minRating, setMinRating] = useState(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [gridColumns, setGridColumns] = useState(3); // 3 or 4
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Handle category change and sync URL
  const handleCategoryChange = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSortBy('featured');
    setPriceRange(3000);
    setMinRating(0);
    setOnlyInStock(false);
    setSearchParams({});
  };

  // Count active non-default filters
  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0) +
    (priceRange < 3000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (onlyInStock ? 1 : 0);

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (
          searchQuery.trim() &&
          !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          return false;
        }
        // Price filter
        if (p.price > priceRange) {
          return false;
        }
        // Rating filter
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }
        // In-stock filter
        if (onlyInStock && p.stock <= 0) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        if (sortBy === 'popularity') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default: featured
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, priceRange, minRating, onlyInStock, sortBy]);

  return (
    <div className="bg-neutral-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-neutral-900">Shop</span>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="text-indigo-600 capitalize">{selectedCategory}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
            Collection Catalogue
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Showing {filteredProducts.length} curated pieces available for immediate dispatch.
          </p>
        </div>

        {/* Top Control Bar: Search + Sorting + Mobile Filter trigger */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Live Search */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-neutral-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title, feature, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white text-xs sm:text-sm rounded-xl border border-neutral-200 focus:border-indigo-400 focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right controls: Sort + Grid Switcher + Mobile Filter toggle */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-600 font-semibold hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-xs sm:text-sm font-semibold text-neutral-800 rounded-xl border border-neutral-200 focus:border-indigo-400 focus:outline-hidden cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">Sort by Newest</option>
                  <option value="popularity">Sort by Popularity</option>
                  <option value="rating">Sort by Highest Rated</option>
                  <option value="price-low">Sort by Price: Low to High</option>
                  <option value="price-high">Sort by Price: High to Low</option>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Grid Column Layout Switcher (Desktop only) */}
            <div className="hidden lg:flex items-center gap-1 p-1 bg-neutral-100 rounded-xl">
              <button
                onClick={() => setGridColumns(3)}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridColumns === 3 ? 'bg-white shadow-xs text-indigo-600' : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridColumns === 4 ? 'bg-white shadow-xs text-indigo-600' : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="4 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Main Body: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Desktop Left Sidebar Filter Column */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs space-y-6">

              {/* Header with Reset */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                    Filters
                  </h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                  Categories
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>All Categories</span>
                    <span>{products.length}</span>
                  </button>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-neutral-900 text-white shadow-xs'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Price Filter */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Max Price
                  </h4>
                  <span className="text-xs font-bold text-indigo-600">
                    {formatPrice(priceRange)}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-600 mt-1">
                  <span>$50</span>
                  <span>$3,000</span>
                </div>
              </div>

              {/* 3. Rating Filter */}
              <div className="pt-4 border-t border-neutral-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  Minimum Rating
                </h4>
                <div className="space-y-1">
                  {[4.8, 4.5, 4.0, 0].map((star) => (
                    <button
                      key={star}
                      onClick={() => setMinRating(star)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        minRating === star
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{star === 0 ? 'Any Rating' : `${star} Stars & Above`}</span>
                      {star > 0 && <span className="text-amber-500">★</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. In Stock Filter */}
              <div className="pt-4 border-t border-neutral-100">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-neutral-700">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>

            </div>
          </div>

          {/* Products Grid Area */}
          <div className="lg:col-span-3">
            {productsLoading && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-neutral-200/80">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs font-semibold text-neutral-500">Loading products catalogue...</p>
              </div>
            )}

            {!productsLoading && filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/80 shadow-xs flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">
                  No products matched your criteria
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mb-6">
                  Try broadening your price limit, searching with different terms, or resetting applied filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear All Filters
                </button>
              </div>
            ) : !productsLoading && (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  gridColumns === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
                } gap-6`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Slide-out Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative ml-auto w-full max-w-xs h-full bg-white shadow-2xl flex flex-col p-6 z-10 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="text-base font-bold text-neutral-900">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-800 rounded-lg hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Body */}
              <div className="py-4 space-y-6 flex-1">
                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Category
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                        selectedCategory === 'all'
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                          selectedCategory === cat.id
                            ? 'bg-neutral-900 text-white'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex justify-between text-xs font-bold text-neutral-900 mb-2">
                    <span>Max Price:</span>
                    <span className="text-indigo-600">{formatPrice(priceRange)}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="3000"
                    step="50"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* In Stock */}
                <div className="pt-4 border-t border-neutral-100">
                  <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                    />
                    <span>In-Stock Only</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-100 flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-3 px-4 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-800 hover:bg-neutral-50"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 px-4 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
