import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { formatPrice } from '../../utils/currency';
import { RatingStars } from './RatingStars';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 overflow-hidden"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discount > 0 && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-rose-600 text-white rounded-md shadow-sm">
              -{product.discount}%
            </span>
          )}
          {product.badge && product.discount === 0 && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-neutral-900 text-white rounded-md shadow-sm">
              {product.badge}
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded border border-amber-200">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Top-Right Action: Wishlist */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-md'
              : 'bg-white/90 backdrop-blur-md text-neutral-600 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorited ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Floating Quick Action Buttons on Desktop Hover */}
        <div
          className={`absolute inset-x-3 bottom-3 flex items-center gap-2 transition-all duration-300 z-10 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          } sm:flex hidden`}
        >
          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="flex-1 py-2.5 px-3 bg-white/95 backdrop-blur-md hover:bg-white text-neutral-800 rounded-xl text-xs font-semibold shadow-md border border-neutral-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
          )}

          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 px-3 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <Link
            to={`/shop?category=${product.category}`}
            className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600 hover:text-indigo-600 transition-colors"
          >
            {product.categoryName || product.category}
          </Link>

          <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${product.id}`}
          className="text-sm sm:text-base font-semibold text-neutral-900 hover:text-indigo-600 transition-colors line-clamp-2 min-h-[2.5rem] mb-2 leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Spacer */}
        <div className="mt-auto pt-2 flex items-baseline justify-between border-t border-neutral-100">
          {/* Price Block */}
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-neutral-600 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Mobile Add to Cart Icon Button */}
          <button
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="sm:hidden w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
