import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  TrendingUp,
  History,
  ArrowRight,
  Star,
  Sparkles,
  ShoppingBag,
  ChevronRight,
  Tag
} from 'lucide-react';
import { formatPrice } from '../../utils/currency';
import { useCms } from '../../hooks/useCms';
import { products as fallbackProducts } from '../../data/products';
import { categories as fallbackCategories } from '../../data/categories';

const POPULAR_SEARCHES = [
  'Wireless Headphones',
  'Mechanical Watch',
  'Leather Sneakers',
  'Minimalist Lamp',
  'Noise Cancelling',
  'Italian Leather'
];

export const SearchOverlay = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { products: cmsProducts, categories: cmsCategories, settings } = useCms();
  const products = cmsProducts && cmsProducts.length > 0 ? cmsProducts : fallbackProducts;
  const categories = cmsCategories && cmsCategories.length > 0 ? cmsCategories : fallbackCategories;

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('novacart_recent_searches');
      return saved ? JSON.parse(saved) : ['Headphones', 'Watch', 'Sneakers'];
    } catch {
      return ['Headphones', 'Watch', 'Sneakers'];
    }
  });

  const inputRef = useRef(null);

  // Auto-focus input when overlay opens & prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small timeout to allow framer-motion mount
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Save recent searches to localStorage
  const saveRecentSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem('novacart_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  const removeRecentSearch = (e, term) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== term);
      try {
        localStorage.setItem('novacart_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('novacart_recent_searches');
    } catch {
      // ignore
    }
  };

  // Filtered products calculation
  const searchResults = useMemo(() => {
    let list = products;

    if (selectedCategory !== 'all') {
      list = list.filter(
        (p) =>
          p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          p.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (!query.trim()) {
      return list.filter((p) => p.isFeatured || p.isBestSeller).slice(0, 8);
    }

    const q = query.trim().toLowerCase();
    return list.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q) || p.categoryName?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      return matchName || matchCat || matchDesc || matchTags;
    });
  }, [products, query, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      const catParam = selectedCategory !== 'all' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
      navigate(`/shop?search=${encodeURIComponent(query.trim())}${catParam}`);
      onClose();
    }
  };

  const handleSelectProduct = (productId) => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
    navigate(`/product/${productId}`);
    onClose();
  };

  const handleSelectPill = (term) => {
    setQuery(term);
    saveRecentSearch(term);
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search Catalog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-neutral-950/98 backdrop-blur-2xl text-white flex flex-col overflow-hidden"
        >
          {/* Subtle Ambient Glow Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-600/30 via-violet-600/10 to-transparent blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/15 blur-3xl rounded-full" />
          </div>

          {/* Top Bar: Brand + Shortcuts + Close Button */}
          <header className="relative z-10 border-b border-neutral-800/80 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between shrink-0 bg-neutral-950/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  {settings?.storeName || 'NovaCart'}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  Search Catalog
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-lg">
                <kbd className="font-mono text-[11px] text-neutral-300">ESC</kbd>
                <span>to close</span>
              </span>

              <button
                onClick={onClose}
                aria-label="Close search overlay"
                className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </header>

          {/* Main Search Controls */}
          <section className="relative z-10 px-4 sm:px-8 pt-6 pb-4 shrink-0 max-w-5xl mx-auto w-full">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center bg-neutral-900/90 rounded-2xl border border-neutral-800 focus-within:border-indigo-500/80 focus-within:ring-4 focus-within:ring-indigo-500/15 transition-all shadow-2xl shadow-black/80">
                <div className="pl-4 sm:pl-5 text-indigo-400 shrink-0">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, styles, categories, or keywords..."
                  className="w-full py-4 sm:py-5 px-3.5 sm:px-4 text-base sm:text-xl font-medium text-white placeholder-neutral-500 bg-transparent outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    className="p-2 mr-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                    aria-label="Clear search input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="mr-3 px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4 hidden sm:inline" />
                </button>
              </div>
            </form>

            {/* Category Filter Chips */}
            <nav aria-label="Search category filters" className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar mt-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-white text-neutral-950 font-bold shadow-md shadow-white/10'
                    : 'bg-neutral-900/90 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id || cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id || cat.slug)}
                  className={`px-3.5 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                    selectedCategory === (cat.id || cat.slug)
                      ? 'bg-white text-neutral-950 font-bold shadow-md shadow-white/10'
                      : 'bg-neutral-900/90 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          </section>

          {/* Results / Content Area */}
          <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 pb-12 max-w-5xl mx-auto w-full">
            {/* If query is empty, show Recent Searches + Popular Queries + Trending Picks */}
            {!query.trim() ? (
              <div className="space-y-8 pt-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                        <History className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Recent Searches</span>
                      </div>
                      <button
                        onClick={clearAllRecent}
                        className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                      >
                        Clear history
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          onClick={() => handleSelectPill(term)}
                          className="group inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl text-xs text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                          <Search className="w-3 h-3 text-neutral-500 group-hover:text-indigo-400" />
                          <span>{term}</span>
                          <button
                            type="button"
                            onClick={(e) => removeRecentSearch(e, term)}
                            className="text-neutral-500 hover:text-neutral-300 p-0.5 rounded-full hover:bg-neutral-700/50"
                            aria-label={`Remove recent search for ${term}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Keywords */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSelectPill(term)}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800/80 hover:border-indigo-500/50 rounded-xl text-xs text-neutral-300 hover:text-indigo-300 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-400/70" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending & Featured Products Showcase */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Trending Right Now</span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      Top curated selections
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                    {searchResults.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id)}
                        className="group bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800/80 hover:border-indigo-500/40 rounded-2xl p-3 flex flex-col transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-800 mb-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          {product.badge && (
                            <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-md text-white border border-neutral-700">
                              {product.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col">
                          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider truncate mb-1">
                            {product.categoryName || product.category}
                          </span>
                          <h4 className="text-xs font-semibold text-white group-hover:text-indigo-400 line-clamp-2 transition-colors mb-2">
                            {product.name}
                          </h4>
                          <div className="mt-auto flex items-center justify-between pt-2 border-t border-neutral-800/60">
                            <span className="text-xs font-bold text-white">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-[11px] font-medium text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                              View <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              /* Active Search Results */
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {searchResults.length}
                    </span>
                    <span>
                      {searchResults.length === 1 ? 'product found' : 'products found'} for &ldquo;
                      <span className="text-indigo-400 font-semibold">{query}</span>
                      &rdquo;
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      saveRecentSearch(query.trim());
                      const catParam = selectedCategory !== 'all' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
                      navigate(`/shop?search=${encodeURIComponent(query.trim())}${catParam}`);
                      onClose();
                    }}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View all in Shop</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Product Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.slice(0, 8).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      className="group bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/90 hover:border-indigo-500/50 rounded-2xl p-3 flex flex-col transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-800 mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {product.discount > 0 && (
                          <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-600 text-white shadow-xs">
                            -{product.discount}%
                          </span>
                        )}
                        {product.badge && (
                          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-md text-white border border-neutral-700">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                          <span className="uppercase tracking-wider truncate">
                            {product.categoryName || product.category}
                          </span>
                          {product.rating && (
                            <span className="flex items-center gap-0.5 text-amber-400 font-bold shrink-0">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {product.rating}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-semibold text-white group-hover:text-indigo-400 line-clamp-2 transition-colors mb-2">
                          {product.name}
                        </h4>

                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-neutral-800/60">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {formatPrice(product.price)}
                            </span>
                            {product.oldPrice && (
                              <span className="text-[11px] text-neutral-500 line-through">
                                {formatPrice(product.oldPrice)}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-medium text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            Details <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View More in Catalog Footer */}
                {searchResults.length > 8 && (
                  <div className="pt-4 text-center">
                    <button
                      onClick={() => {
                        saveRecentSearch(query.trim());
                        const catParam = selectedCategory !== 'all' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
                        navigate(`/shop?search=${encodeURIComponent(query.trim())}${catParam}`);
                        onClose();
                      }}
                      className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs border border-neutral-800 hover:border-neutral-700 transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <span>Explore all {searchResults.length} matching products</span>
                      <ArrowRight className="w-4 h-4 text-indigo-400" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* No Results State */
              <div className="py-16 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  No products found
                </h3>
                <p className="text-xs text-neutral-400 mb-6">
                  We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try checking the spelling or using broader search terms.
                </p>

                <div className="space-y-3">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                    Suggested Searches
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {POPULAR_SEARCHES.slice(0, 4).map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelectPill(term)}
                        className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setQuery('');
                      setSelectedCategory('all');
                      inputRef.current?.focus();
                    }}
                    className="mt-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 cursor-pointer"
                  >
                    Clear filters & search again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Keyboard Shortcut / Helper Hint Bar */}
          <footer className="relative z-10 border-t border-neutral-800/80 px-4 sm:px-8 py-3 bg-neutral-950/90 flex items-center justify-between text-[11px] text-neutral-500 shrink-0">
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[10px]">
                  ↵ Enter
                </kbd>
                <span>to view in shop</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[10px]">
                  ESC
                </kbd>
                <span>to exit</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-neutral-400">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real-time instant search</span>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
